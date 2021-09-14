import request from '../../utils/request';

// OCR验证码识别
export const captchaOCR = (verify, data) => {
	return request.post("/Tool/captchaDecodeV2", data, {
		header: {
			'x-verify': verify
		}
	});
};

// 获取SSO页面验证码
export const getSSOCaptcha = cookie => {
	return request.get("https://sso.cuit.edu.cn/authserver/captcha", null, {
		responseType: "arraybuffer",
		header: {
			cookie
		}
	});
};

// SSO登录检查
export const checkSSOLogin = cookie => {
	return request.get("https://sso.cuit.edu.cn/authserver/login", null, {
		header: {
			cookie
		}
	});
};

// SSO登录
export const ssoDoLogin = data => {
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
		if (!res.data) resolve(-1);
		const html = res.data;

		if ("string" !== typeof html) {
			return Promise.reject({
				code: 0,
				errMsg: "预期之外的异常"
			});
		}

		if (html.indexOf("已经成功登统一认证中心") != -1) {
			// 处理cookie
			var cookie = "";
			if ("undefined" != typeof res.header["set-cookie"]) cookie = res.header[
				"set-cookie"];
			else if ("undefined" != typeof res.header["Set-Cookie"]) cookie = res
				.header["Set-Cookie"];
			return Promise.resolve(cookie);
		} else if (html.indexOf("用户名或密码错误") != -1) {
			return Promise.reject({
				code: 12401,
				errMsg: "用户名或密码错误"
			});
		} else if (html.indexOf("必须录入") != -1) {
			return Promise.reject({
				code: 12401,
				errMsg: "数据缺失"
			});
		} else if (html.indexOf("账号被锁定") != -1) {
			var unlockTime = html.match(/账号被锁定，请在(.*?)后重新登录/)[1];
			return Promise.reject({
				code: 12403,
				errMsg: "账号被锁定至" + unlockTime
			});
		} else if (html.indexOf("禁用") != -1) {
			return Promise.reject({
				code: 12403,
				errMsg: "账号被禁用！"
			});
		} else if (html.indexOf("必须录入验证码") != -1 || -1 != html.indexOf("验证码无效")) {
			return Promise.resolve({
				code: 12405,
				errMsg: "验证码有误"
			});
		} else {
			return Promise.reject({
				code: 0,
				errMsg: '未知异常'
			});
		}
	})
};

// SSO退出登录
export const ssoLogout = cookie => {
	return request.get("https://sso.cuit.edu.cn/authserver/logout", null, {
		header: {
			cookie
		}
	});
};

// 教务管理登录
export const jwglLogin = cookie => {
	return request.post("/Jwgl/login", {
		cookie
	});
};

// 教务管理登录检查
export const jwglLoginCheck = cookie => {
	return request.post("/Jwgl/loginCheck", {
		cookie
	});
};

// WEBVPN登录
export const WV_login = (cookie, data) => {
	return request.post("https://webvpn.cuit.edu.cn/por/login_psw.csp?anti_replay=1&encrypt=1&apiversion=1", data, {
		header: {
			"content-type": "application/x-www-form-urlencoded",
			cookie
		}
	});
};

// WEBVPN登录准备
export const WV_loginAuth = cookie => {
	return request.get("https://webvpn.cuit.edu.cn/por/login_auth.csp?apiversion=1", null, {
		header: {
			cookie
		}
	});
};

// WEBVPN登录检查
export const WV_loginCheck = cookie => {
	return request.get("https://webvpn.cuit.edu.cn/por/svpnSetting.csp?apiversion=1", null, {
		header: {
			cookie
		}
	});
};
