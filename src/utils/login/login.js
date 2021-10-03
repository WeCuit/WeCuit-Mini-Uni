const {
	RSAEncrypt
} = require("../rsa/index.js");
const log = require("../log.js");
const XMLParser = require('@xmldom/xmldom')
const request = require("../request.js");
const RSA = require('../rsa/wx_rsa.js')
const xmlParser = new XMLParser.DOMParser();
let loginFailed = 0;

const AutoLogin = {}

// 计算中心
const Compute = {
	doLogin: (stuId, stuPass) => {
		return request.post("/Jszx/loginRSAv1/", {
				userId: stuId,
				userPass: RSAEncrypt(stuPass)
			})
	},
	checkLogin: (cookie) => request.post("/Jszx/checkLogin/", {
		cookie
	}).then(res=>{
		return res.data.data.login?Promise.reject(0):Promise.resolve
	})
}

AutoLogin.Compute = async (account, session)=>{
		try{
			const check = await Compute.checkLogin(session.JSZX_cookie);
			const login = await Compute.doLogin(account.userId, account.userPass)
			session.JSZX_cookie = login?.data?.data?.cookie??null
			if(session.JSZX_cookie){
				uni.setStorage({
					key: "JSZX_cookie",
					data: session.JSZX_cookie
				});
			}
			
		}catch(err){
			if(err === 0)return;
			log.error('JSZX err -> ', err)
		}
	}

// 教务管理
const JWGL = {
	checkLogin: (twfid, cookie) => request.post("/Jwgl/loginCheck", {
		cookie: `${cookie}; TWFID=${twfid}`
	}).then(res=>{
		const {data} = res.data
		return data.login?Promise.reject(0): Promise.resolve()
	}),
	doLogin: (twfid, tgc) => request.post("/Jwgl/login", {
		cookie: `TGC=${tgc}; TWFID=${twfid}`
	})
}

AutoLogin.JWGL = async (account, session)=>{
	try{
		const check = await JWGL.checkLogin(session.TWFID, session.JWGL_cookie)
		const login = await JWGL.doLogin(session.TWFID, session.SSO_TGC)
		session.JWGL_cookie = login?.data?.data?.cookie??''
		uni.setStorage({
			key: "JWGL_cookie",
			data: session.JWGL_cookie
		});
	}catch(err){
		if(err === 0)return;
		log.error('JWGL err -> ', err)
	}
}

// WEBVPN
const WEBVPN = {
	auth(isNeedCaptcha, TWFID) {
		return request.get('https://webvpn.cuit.edu.cn/por/login_auth.csp', {apiversion:1},
			{
				header: {
					cookie: `language=zh_CN; privacy=1; ENABLE_RANDCODE=${isNeedCaptcha};TWFID=${TWFID}`
				}
			}
		).then(res=>{
			const doc = xmlParser.parseFromString(res.data);
			let randCode = doc.getElementsByTagName("CSRF_RAND_CODE")[0].firstChild
				.data;
			let msg = doc.getElementsByTagName("Message")[0].firstChild.data;
			let TwfID = doc.getElementsByTagName("TwfID")[0].firstChild.data;
			let RSA_ENCRYPT_KEY = doc.getElementsByTagName("RSA_ENCRYPT_KEY")[0]
				.firstChild.data;
			let RSA_ENCRYPT_EXP = doc.getElementsByTagName("RSA_ENCRYPT_EXP")[0]
				.firstChild.data;

			if (msg == "login auth success") {
				let auth = {
					rc: randCode,
					TwfID,
					RSA_ENCRYPT_KEY,
					RSA_ENCRYPT_EXP: parseInt(RSA_ENCRYPT_EXP)
				};
				return Promise.resolve(auth);
			} else {
				return Promise.reject(2004);
			}
		})
	},
	doLogin(userId, userPass, auth) {
		let encrypt = new RSA.RSAKey();
		encrypt.setPublic(auth.RSA_ENCRYPT_KEY, auth.RSA_ENCRYPT_EXP.toString(16));
		userPass = encrypt.encrypt(userPass);
		return request.post('https://webvpn.cuit.edu.cn/por/login_psw.csp?anti_replay=1&encrypt=1&apiversion=1',
			{
				mitm_result: "",
				svpn_req_randcode: auth.rc,
				svpn_name: userId,
				svpn_password: userPass,
				svpn_rand_code: ""
			},
			{
				header: {
					"Content-Type": "application/x-www-form-urlencoded",
					cookie: `language=zh_CN; privacy=1; ENABLE_RANDCODE=0; TWFID=${auth.TwfID}`
				}
			}
		).then(res=>{
			let ret = {};
			let doc = xmlParser.parseFromString(res.data);
			let msg = doc.getElementsByTagName("Message")[0].firstChild.data;
			let cookie = "";
			if ("undefined" != typeof res.header["set-cookie"]) cookie = res.header[
				"set-cookie"];
			else if ("undefined" != typeof res.header["Set-Cookie"]) cookie = res.header[
				"Set-Cookie"];
			
			if (msg == "radius auth succ") {
				ret["code"] = 200;
				let TWFID = doc.getElementsByTagName("TwfID")[0].firstChild.data;
				return Promise.resolve(TWFID);
			} else {
				ret["doc"] = doc;
				let code = doc.getElementsByTagName("ErrorCode")[0].firstChild.data;
				ret.code = code
				if (code == 20021) {
					return Promise.reject(0)
				} else if (code == 20004) {
					ret.msg = '账号信息错误'
				} else if (code == 20041) {
					ret.msg = '错误次数过多'
				} else if (code == 20023) {
					ret.msg = '验证码错误'
				} else if (code == 20026) {
					ret.msg = '密码格式不正确'
				}else{
					ret.msg = doc.getElementsByTagName("Message")[0].firstChild.data;
				}
				
				if (-1 != cookie.indexOf("ENABLE_RANDCODE=1")) ret["needCaptcha"] = true;
				return Promise.reject(ret);
			}
		})
	},
	checkLogin(isNeedCaptcha, twfid) {
		// 已登录 ---> 抛异常
		return request.get('https://webvpn.cuit.edu.cn/por/svpnSetting.csp?apiversion=1',null,
			{
				header: {
					cookie: `language=zh_CN; privacy=1; ENABLE_RANDCODE=${isNeedCaptcha}; TWFID=${twfid}`
				},
			}
		).then(res=>{
				const doc = xmlParser.parseFromString(res.data);
				let msg = doc.getElementsByTagName("Message")[0].firstChild.data;
				if ("auth succ." == msg) {
					return Promise.reject(0)
				} else {
					return Promise.resolve(msg)
				}
		})
	}
}

AutoLogin.WEBVPN = async (account, session)=>{
	try{
		// check 
		const check = await WEBVPN.checkLogin(0, session.TWFID);
		const auth = await WEBVPN.auth(0, session.TWFID);
		session.TWFID = auth.TwfID
		const twfid = await WEBVPN.doLogin(account.userId, account.vpnPass || (account.userPass + "_" + auth.rc), auth)
		session.TWFID = twfid
		uni.setStorage({
			key: "TWFID",
			data: twfid
		});
	}catch(err){
		if(err === 0)return;
		log.error('webvpn err -> ', err)
	}
	
}

/**
 * ORC识别验证码
 *
 * @param pic arraybuffer
 * @return {object} res
 */
export const CaptchaDecode = (pic) => {
	try {
		const byteArray = new Uint8Array(pic);
		const hexParts = [];
		let start = parseInt(byteArray.length / 3);
		let end = parseInt(byteArray.length / 2);

		while (end - start > 20) end = parseInt((start + end) / 2);

		for (let i = start; i < end; i++) {
			// convert value to hexadecimal
			const hex = byteArray[i].toString(16); // pad with zeros to length 2

			const paddedHex = ("00" + hex).slice(-2); // push to array

			hexParts.push(paddedHex);
		} // join all the hex values of the elements into a single string


		let h = hexParts.join("");
		var verify = h + "/@jysafe.cn";
		
		return request.post('/Tool/captchaDecodeV2', pic, {
				header: {
					"x-verify": RSAEncrypt(verify)
				},
		})
	} catch (err) {
		console.log('CaptchaDecode err -> ', err);
	}
}

// 统一登录中心
const SSO = {
	/**
	 * @param {Object} data
	 * @return resolve {string} cookie
	 * 
	 */
	doLogin(data) {
		if (0 == data.userId.length || 0 == data.userPass.length) {
			return Promise.reject({
				code: -3,
				errMsg: "账号密码格式不正确"
			});
		}
		const form = {
			execution: data.execution,
			_eventId: "submit",
			lm: "usernameLogin",
			geolocation: "",
			username: data.userId,
			password: data.userPass,
			captcha: data.captcha
		}
		return request.post("https://sso.cuit.edu.cn/authserver/login", form, {
			header: {
				cookie: 'SESSION=' + data.SSO_SESSION,
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}).then(res => {
			if (!res.data) return Promise.reject({code: -1, msg: '响应体为空'});
			const html = res.data;

			if ("string" !== typeof html) {
				return Promise.reject({
					code: -1,
					msg: "预期之外的异常"
				});
			}
			let execution, ret = {};
			if (html.indexOf("execution") != -1) {
				ret["execution"] = html.match(/" name="execution" value="(.*?)" \/>/)[1];
			}
			if (html.indexOf("已经成功登统一认证中心") != -1) {
				// 处理cookie
				let cookie = "";
				if ("undefined" != typeof res.header["set-cookie"])
					cookie = res.header["set-cookie"];
				else if ("undefined" != typeof res.header["Set-Cookie"])
				 cookie = res.header["Set-Cookie"];
				return Promise.resolve(cookie);
			} else if (html.indexOf("用户名或密码错误") != -1) {
				ret.code = 12401
				ret.msg = '用户名或密码错误'
				return Promise.reject(ret);
			} else if (html.indexOf("必须录入") != -1) {
				ret.code = 12401
				ret.msg = '数据缺失'
				return Promise.reject(ret);
			} else if (html.indexOf("账号被锁定") != -1) {
				let unlockTime = html.match(/账号被锁定，请在(.*?)后重新登录/)[1];
				ret.code = 12403
				ret.msg = `账号被锁定至${unlockTime}`
				return Promise.reject(ret);
			} else if (html.indexOf("禁用") != -1) {
				ret.code = 12403
				ret.msg = `账号被禁用！`
				return Promise.reject(ret);
			} else if (html.indexOf("必须录入验证码") != -1 || -1 != html.indexOf("验证码无效")) {
				ret.code = 12405
				ret.msg = `验证码有误`
				return Promise.reject(ret);
			} else {
				return Promise.reject({
					code: -2,
					msg: '未知异常'
				});
			}
		})

	},
	getCaptcha(SESSION) {
		return request.get('https://sso.cuit.edu.cn/authserver/captcha', null, {
			responseType: 'arraybuffer',
			header: {
				cookie: `SESSION=${SESSION}`
			},
		})
	},
	/**
	 * @param {Object} sso_session
	 * @param {Object} tgc
	 * reject {code:0} 已登录
	 */
	checkLogin(sso_session, tgc) {
		return request.get('https://sso.cuit.edu.cn/authserver/login', null, {
			header: {
				cookie: `SESSION=${sso_session}; TGC=${tgc}`
			},
		}).then(res=>{
			let ret = {};
			
			if (res.data.indexOf("已经成功登统一认证中心") != -1) {
				return Promise.reject({code:0});
			} else if (res.data.indexOf("成都信息工程大学统一身份") != -1) {
				log.info("SSO NOT LOGIN."); // 未登录统一认证中心
			
				ret["status"] = 401;
				ret["session"] = sso_session;
				let cookie = "";
				if ("undefined" != typeof res.header["set-cookie"]) cookie = res.header[
					"set-cookie"];
				else if ("undefined" != typeof res.header["Set-Cookie"]) cookie = res
					.header["Set-Cookie"];
			
				if (-1 != cookie.indexOf("SESSION")) {
					// session需要更新
					ret["session"] = cookie.match(/SESSION=(.*);/)[1];
				}
			
				ret["execution"] = '';
			
				if (res.data.indexOf("execution") != -1) {
					ret["execution"] = res.data.match(
						/" name="execution" value="(.*?)" \/>/)[1];
				}
			
				return Promise.resolve(ret);
			}
		})
	}
}

AutoLogin.SSO = async (account, session)=>{
	try{
		const check = await SSO.checkLogin(session.SSO_SESSION, session.SSO_TGC);
		session.SSO_SESSION = check.session
		// 取得验证码
		const captcha = await SSO.getCaptcha(session.SSO_SESSION);
		
		let cookie = "";
		if ("undefined" != typeof captcha.header["set-cookie"]) cookie = captcha.header["set-cookie"];
		else if ("undefined" != typeof captcha.header["Set-Cookie"]) cookie = captcha.header["Set-Cookie"];
		
		if (-1 != cookie.indexOf("SESSION")) {
			session.SSO_SESSION = cookie.match(/SESSION=(.*);/)[1];
		}
		
		const captchaDecode = await CaptchaDecode(captcha.data);
		let code = captchaDecode?.data?.data?.result ?? '';
		
		const loginCookie = await SSO.doLogin({
			SSO_SESSION: session.SSO_SESSION,
			userId: account.userId,
			userPass: account.userPass,
			captcha: code,
			execution: check.execution
		})
		let tgc = loginCookie.match(/TGC=(.*?);/);
		session.SSO_TGC = tgc[1]
		uni.setStorage({
			key: "SSO_TGC",
			data: tgc[1]
		});
	}catch(err){
		if(err.code === 0)return;
		log.error('sso err -> ', err)
		
		if (err.code === 12405 || err.data.code === 500) {
			loginFailed++;
		
			// 重试登录，最多3次
			if (loginFailed <= 3) {
				log.info("第" + loginFailed + "次重试");
				AutoLogin.SSO(account, session);
				return Promise.reject(`第${loginFailed}次重试`);
			}
		} else if (12401 === err.code) {
			uni.showToast({
				icon: "none",
				title: err.msg
			});
			account.isAutoLogin = false
			uni.setStorage({
				key: 'accountInfo',
				data: account
			})
		}
		throw err
	}
}

const FullAutoLogin = async(account, session)=>{
	try{
		// SSO
		await AutoLogin.SSO(account, session)
		// WEBVPN
		await AutoLogin.WEBVPN(account, session)
		// 教务管理
		await AutoLogin.JWGL(account, session)
	}catch(err){
		log.error('FullAutoLogin err -> ',err)
	}
	// 计算中心？
	await AutoLogin.Compute(account, session)
	return Promise.resolve()
}

export const LoginObj = {
	Compute,
	JWGL,
	WEBVPN,
	SSO
}
export default FullAutoLogin
