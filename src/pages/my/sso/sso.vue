<template>
	<view>
		<!--pages/my/sso/sso.wxml-->
		<view v-if="isNeedLogin">
			<view class="notice">
				<view class="notice_sub">
					<view class="notice_left">提示</view>
					<view class="notice_right">QQ群:940309953</view>
				</view>
				<text>
					当前处于测试状态，存在诸多不稳定因素
					密码为教务处密码
					初始密码：名字的首字母且大写+身份证号后6位+a
				</text>
			</view>
			<form @submit="formSubmit" @reset="formReset">
				<mp-cells ext-class="my-cells" title="请输入登录信息">
					<mp-cell title="学号：">
						<view><input name="userId" class="login weui-input" type="number" placeholder="请输入学号"
								placeholder-class="placeholder" :value="userId"></view>
					</mp-cell>
					<mp-cell title="密码：">
						<input name="userPass" class="login password" password="true" placeholder="请输入密码"
							placeholder-class="placeholder" :value="userPass">
					</mp-cell>
					<mp-cell title="WebVpn密码：">
						<input name="vpnPass" class="login password" password="true" placeholder="同上请放空"
							placeholder-class="placeholder" :value="vpnPass">
					</mp-cell>
					<mp-cell prop="vcode" title="验证码：" ext-class="weui-cell_vcode">
						<input name="captcha" :value="captchaCode" data-field="vcode" class="weui-input"
							placeholder="请输入验证码" placeholder-class="placeholder">
						<image @tap="refreshCaptcha" slot="footer" class="weui-vcode-img" :src="captchaImg"
							style="width: 108px"></image>
					</mp-cell>
					<mp-cell title="自动登录">
						<switch name="isAutoLogin" slot="footer" :checked="isAutoLogin"></switch>
					</mp-cell>
					<mp-cell title="记住密码">
						<switch name="isRemPass" slot="footer" :checked="isRemPass"></switch>
					</mp-cell>
				</mp-cells>
				<view class="weui-btn-area">
					<button class="weui-btn" type="primary" form-type="submit">登录</button>
					<button style="margin-top: 12px" form-type="reset">重置</button>
				</view>
			</form>
		</view>
		<view v-else style="text-align:center;color:#a5ff2da6">
			<view style="margin:30px">恭喜阁下</view>
			<view style="margin:20px">阁下已成功登录了统一认证中心</view>

			<view>WEBVPN<text v-if="isWebVpnLogin">已登录</text><text v-else data-type="WEBVPNV2"
					@tap="loginAction">未登录</text></view>
			<view>教务处<text v-if="isJwglLogin">已登录</text><text v-else data-type="JWGL" @tap="loginAction">未登录</text>
			</view>

			<text
				style="margin:20px;display: block;">注：\r\n一旦阁下成功登录了统一认证中心，\r\n那么系统将会自动登录以下服务：\r\n1.WEBVPN\r\n2.教务管理系统\r\n
				\r\n 另外：如果看到“未登录”三个字请狂戳它们~</text>
			<button type="primary" @tap="bindButtonLogout">注销</button>
			<button style="margin-top:40rpx" @tap="bindButtonBack">返回</button>
		</view>
	</view>
</template>

<script>
	// pages/my/sso/sso.js
	const XMLParser = require('@xmldom/xmldom')
	const xmlParser = new XMLParser.DOMParser();
	import {
		captchaOCR,
		getSSOCaptcha,
		checkSSOLogin,
		ssoDoLogin,
		jwglLogin,
		ssoLogout,
		WV_login,
		WV_loginAuth,
		jwglLoginCheck,
		WV_loginCheck
	} from '../api'; 
	
	// var L = new login.DoLogin();
	// rsa 加密
	const RSA = require("../../../utils/rsa/wx_rsa.js");
	const encrypt = new RSA.RSAKey();
	const app = getApp();
	var _this;
	import mpCells from "../../../miniprogram_npm/weui-miniprogram/cells/cells";
	import mpCell from "../../../miniprogram_npm/weui-miniprogram/cell/cell";
	import {
		RSAEncrypt
	} from '../../../utils/rsa/index.js'

	export default {
		data() {
			return {
				userId: "",
				userPass: "",
				isRemPass: false,
				captchaImg: "",
				captchaCode: "",
				isNeedLogin: true,
				SSO_SESSION: "",
				execution: "",
				isNeedCaptcha: 0,
				isAutoLogin: false,
				accountInfo: {},
				sessionInfo: {},
				vpnPass: "",
				isWebVpnLogin: false,
				isJwglLogin: false,
				
				// 登录函数
				loginFunc: {
					// 教务管理系统登录
					JWGL: function() {
						const cookie =
							`TGC=${app.globalData.sessionInfo.SSO_TGC}; TWFID=${app.globalData.sessionInfo.TWFID}`;
						jwglLogin(cookie).then(res => {
							const resp = res.data;
							const {data} = resp
							_this.sessionInfo.JWGL_cookie = data.cookie;
							uni.setStorage({
								key: "JWGL_cookie",
								data: data.cookie
							});
				
							_this.setData({
								isJwglLogin: true
							});
				
							uni.showToast({
								title: "教务处登录成功"
							});
						});
					},
					// WebVpn登录
					WEBVPN_isAdmin: function() {
						return new Promise((resolve, reject) => {
							// 普通用户
							if (true !== app.globalData.accountInfo.isAdmin) reject();
							else // 管理员
								app.globalData.login().then(code => {
									uni.request({
										url: app.globalData.API_DOMAIN + "/Sys/getAdminTWFID",
										data: {
											code: code
										},
										success: res => {
											if (2000 === res.data.status) {
												app.globalData.sessionInfo.TWFID = res.data
													.twfid;
												uni.setStorage({
													data: res.data.twfid,
													key: "TWFID"
												});
											}
				
											resolve();
										},
										fail: err => {
											console.error("失败", err);
											uni.showToast({
												icon: "none",
												title: "网络异常"
											});
											reject();
										}
									});
								});
						});
					},
					WEBVPNV2: function() {
						this.WEBVPN_isAdmin().then(() => {
							this.WEBVPN();
							this.JWGL();
						}).catch(() => {
							this.WEBVPN(() => {
								this.JWGL();
							});
						});
					},
					WEBVPN: r => {
						new Promise((resolve, reject) => {
							_this.loginFunc.loginAuth(auth => {
								WV_login("language=zh_CN; privacy=1; ENABLE_RANDCODE=" + _this
									.isNeedCaptcha + "; TWFID=" + auth.TwfID, {
										mitm_result: "",
										svpn_req_randcode: auth.rc,
										svpn_name: _this.userId,
										svpn_password: auth.encrypted_pwd,
										svpn_rand_code: ""
									}).then(res => {
									var ret = {};
									var doc = xmlParser.parseFromString(res.data);
									var msg = doc.getElementsByTagName("Message")[0].firstChild
										.data;
									var cookie = "";
									if ("undefined" != typeof res.header["set-cookie"])
										cookie = res.header["set-cookie"];
									else if ("undefined" != typeof res.header["Set-Cookie"])
										cookie = res.header["Set-Cookie"];
				
									if (msg == "radius auth succ") {
										ret["status"] = 200;
										var TWFID = doc.getElementsByTagName("TwfID")[0]
											.firstChild.data;
										resolve(TWFID);
									} else {
										ret["doc"] = doc;
										if (-1 != cookie.indexOf("ENABLE_RANDCODE=1")) ret[
											"needCaptcha"] = true;
										reject(ret);
									}
								});
							});
						}).then(TWFID => {
							// 更新TWFID
							if (TWFID != app.globalData.sessionInfo.TWFID) {
								app.globalData.sessionInfo.TWFID = TWFID;
								uni.setStorage({
									data: TWFID,
									key: "TWFID"
								});
							}
				
							_this.setData({
								isWebVpnLogin: true
							});
				
							uni.showToast({
								title: "WebVpn登录成功"
							});
							app.globalData.sessionInfo.TWFID = TWFID;
							r();
						}).catch(err => {
							console.log(err);
							var doc = err.doc;
							var code = doc.getElementsByTagName("ErrorCode")[0].firstChild.data;
				
							if (code == 20021) {
								uni.showToast({
									title: "已是登录状态"
								});
				
								_this.setData({
									isWebVpnLogin: true,
									isNeedLogin: false
								});
							} else if (code == 20004) {
								uni.showToast({
									icon: "none",
									title: "账号信息错误"
								});
				
								if (err.needCaptcha) { // _this.getCaptcha();
								}
							} else if (code == 20041) {
								uni.showToast({
									icon: "none",
									title: "错误次数过多"
								}); // _this.getCaptcha();
							} else if (code == 20023) {
								uni.showToast({
									icon: "none",
									title: "验证码错误"
								}); // _this.getCaptcha();
							} else if (code == 20026) {
								uni.showToast({
									icon: "none",
									title: "webvpn:未登录或已超时"
								});
								app.globalData.sessionInfo.TWFID = ""; // _this.getCaptcha();
							} else {
								uni.showToast({
									icon: "none",
									title: "未知异常"
								});
							}
						});
					},
					loginAuth: function(r) {
						WV_loginAuth("language=zh_CN; privacy=1; ENABLE_RANDCODE=" + _this.isNeedCaptcha + ";TWFID=" +
								app.globalData.sessionInfo.TWFID
								) // new login.DoLogin().webVpnAuth(_this.data.isNeedCaptcha, app.sessionInfo.TWFID)
							.then(res => {
								var doc = xmlParser.parseFromString(res.data);
								var randCode = doc.getElementsByTagName("CSRF_RAND_CODE")[0].firstChild.data;
								var msg = doc.getElementsByTagName("Message")[0].firstChild.data;
								var TwfID = doc.getElementsByTagName("TwfID")[0].firstChild.data;
								var RSA_ENCRYPT_KEY = doc.getElementsByTagName("RSA_ENCRYPT_KEY")[0].firstChild
									.data;
								var RSA_ENCRYPT_EXP = doc.getElementsByTagName("RSA_ENCRYPT_EXP")[0].firstChild
									.data;
								let auth;
				
								if (msg == "login auth success") {
									auth = {
										rc: randCode,
										TwfID: TwfID,
										RSA_ENCRYPT_KEY: RSA_ENCRYPT_KEY,
										RSA_ENCRYPT_EXP: parseInt(RSA_ENCRYPT_EXP)
									};
								} else {
									return Promise.reject(2004);
								}
				
								const ret = auth;
				
								if (ret.TwfID != app.globalData.sessionInfo.TWFID) {
									app.globalData.sessionInfo.TWFID = ret.TwfID;
								}
				
								encrypt.setPublic(ret.RSA_ENCRYPT_KEY, ret.RSA_ENCRYPT_EXP.toString(16));
								ret["encrypted_pwd"] = encrypt.encrypt(_this.vpnPass ? _this.vpnPass : _this
									.userPass + "_" + ret.rc);
								r(ret);
							}).catch(err => {
								console.log(err);
								if (2004 == err) uni.showToast({
									icon: "none",
									title: "loginAuth错误"
								});
								else uni.showToast({
									icon: "none",
									title: "未知错误"
								});
							});
					}
				},
				// 登录检测
				loginCheckFunc: {
					// WEBVPN检查登录状态
					WEBVPN: function() {
						const cookie =
							`language=zh_CN; privacy=1; ENABLE_RANDCODE=${_this.isNeedCaptcha}; TWFID=${app.globalData.sessionInfo.TWFID}`;
						WV_loginCheck(cookie).then(res => {
							var doc = xmlParser.parseFromString(res.data);
							var msg = doc.getElementsByTagName("Message")[0].firstChild.data;
				
							if ("auth succ." === msg) {
								_this.setData({
									isWebVpnLogin: true
								});
							} else {
								_this.loginFunc.WEBVPN(() => {
									_this.loginFunc.JWGL();
								});
				
								app.globalData.sessionInfo.TWFID = "";
							}
						});
					},
				
					/**
					 * 教务管理登录检查
					 * @param {*} r
					 */
					JWGL: function(r) {
						jwglLoginCheck(app.globalData.sessionInfo.JWGL_cookie + "; TWFID=" + app.globalData.sessionInfo
							.TWFID).then(res => {
							if (res.data.status == 2000) {
								_this.setData({
									isJwglLogin: true
								});
							} else {
								_this.loginFunc.JWGL();
							}
						});
					}
				},
				
			};
		},

		components: {
			mpCells,
			mpCell
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			_this = this;
			this.initUserData();
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			this.checkSsoLogin(SESSION => {
				this.getCaptcha(SESSION);
			});
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() { // console.log(app.sessionInfo)
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			// 根据storage存储初始化用户数据
			initUserData: function() {
				let temp = {};
				temp.userId = app.globalData.accountInfo.userId;
				temp.userPass = app.globalData.accountInfo.userPass;
				temp.vpnPass = app.globalData.accountInfo.vpnPass ? app.globalData.accountInfo.vpnPass : "";
				temp.isRemPass = app.globalData.accountInfo.isRemPass;
				temp.isAutoLogin = app.globalData.accountInfo.isAutoLogin;
				this.setData(temp);
				this.sessionInfo = app.globalData.sessionInfo;
				this.accountInfo = app.globalData.accountInfo;
			},

			/**
			 * 表单提交
			 * 
			 * @param {*} e
			 */
			formSubmit: function(e) {
				// console.log(e.detail.value);
				let formData = e.detail.value; // 数据赋值

				this.userId = this.accountInfo.userId = formData.userId;
				this.userPass = this.accountInfo.userPass = formData.userPass;
				this.vpnPass = this.accountInfo.vpnPass = formData.vpnPass;
				this.isRemPass = this.accountInfo.isRemPass = formData.isRemPass;
				this.isAutoLogin = this.accountInfo.isAutoLogin = formData.isAutoLogin; // 记住密码

				if (this.isRemPass) {
					uni.setStorage({
						key: "accountInfo",
						data: this.accountInfo
					});
				}

				var sso_data = {
					SSO_SESSION: this.SSO_SESSION,
					execution: this.execution,
					userId: formData.userId,
					userPass: formData.userPass,
					captcha: formData.captcha
				};
				ssoDoLogin(sso_data).then(cookies => {
					var tgc = cookies.match(/TGC=(.*?);/);
					this.sessionInfo.SSO_TGC = tgc[1];
					this.setData({
						isNeedLogin: false
					});
					uni.showToast({
						title: "SSO登录成功"
					});
					app.globalData.isUser = true;
					uni.setStorage({
						data: true,
						key: "isUser"
					});
					uni.setStorage({
						data: tgc[1],
						key: "SSO_TGC"
					});
					this.loginFunc.WEBVPN_isAdmin().then(() => {
						console.log("check & login");
						this.loginCheckFunc.WEBVPN();
						this.loginFunc.JWGL();
					}).catch(() => {
						this.loginFunc.WEBVPN(() => {
							this.loginFunc.JWGL();
						});
					});
				}).catch(err => {
					if ("string" == typeof err.Msg) {
						uni.showToast({
							icon: 'none',
							title: err.errMsg
						});
					}

					this.checkSsoLogin(SESSION => {
						this.getCaptcha(SESSION);
					});
				});
			},

			/**
			 * 检查登录状态
			 * @param {SSO_SESSION} r
			 *
			 */
			checkSsoLogin: function(r) {
				checkSSOLogin("SESSION=" + this.SSO_SESSION + "; TGC=" + this.sessionInfo.SSO_TGC).then(res => {
					var ret = {};

					if (res.data && res.data.indexOf("已经成功登统一认证中心") != -1) {
						ret["status"] = 2000;
					} else if (res.data.indexOf("成都信息工程大学统一身份") != -1) {
						// 登录webvpn，未登录统一认证中心
						ret["status"] = 2002;
						ret["SESSION"] = null;
						var cookie = "";
						if ("undefined" != typeof res.header["set-cookie"]) cookie = res.header["set-cookie"];
						else if ("undefined" != typeof res.header["Set-Cookie"]) cookie = res.header[
							"Set-Cookie"];

						if (-1 != cookie.indexOf("SESSION")) {
							// SESSION需要更新
							ret["SESSION"] = cookie.match(/SESSION=(.*);/)[1];
						}

						ret["execution"] = null;

						if (res.data.indexOf("execution") != -1) {
							ret["execution"] = res.data.match(/" name="execution" value="(.*?)" \/>/)[1];
						}
					} else {
						// 两个站点都未登录
						reject(-1);
					}

					if (ret.execution) {
						this.execution = ret.execution;
					}

					if (ret.status == 2000) {
						this.setData({
							isNeedLogin: false
						}); // 检查其它登录点

						this.loginFunc.WEBVPN_isAdmin().then(() => {
							this.loginCheckFunc.WEBVPN();
							this.loginCheckFunc.JWGL();
						}).catch(() => {
							this.loginCheckFunc.WEBVPN();
							this.loginCheckFunc.JWGL();
						});
						return;
					} else {
						if (ret.SESSION != null) {
							this.SSO_SESSION = ret.SESSION;
						}

						r(this.SSO_SESSION);
					}
				}).catch(err => {
					if (err == -1) { // 无SESSION cookie 为登录webvpn
					} else {
						console.log(err);
					}
				});
			},

			/**
			 * 获取验证码
			 * @param {*} r
			 */
			getCaptcha: function(SESSION) {
				getSSOCaptcha("SESSION=" + SESSION).then(res => {
					const captcha = res.data;
					var imgBase64 = "data:image/png;base64," + uni.arrayBufferToBase64(captcha);
					this.setData({
						captchaImg: imgBase64
					});
					this.captchaDecode(captcha, code => {
						this.setData({
							captchaCode: code
						});
					});
				}).catch(err => {
					console.log("error", err);
				});
			},
			// ORC识别验证码
			captchaDecode: function(pic, r) {
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
					const encryptData = RSAEncrypt(verify);
					captchaOCR(encryptData, pic)
						.then(res => {
							if (200 == res.data.code) r(res.data.data.result);
							else {
								uni.showToast({
									icon: "none",
									title: res.data.msg
								});
							}
							return;
						}).catch(err => {
							uni.showToast({
								icon: "none",
								title: "验证码识别失败"
							});
						});
				} catch (err) {
					console.log(err);
				}
			},

			/**
			 * 注销按钮事件
			 */
			bindButtonLogout: function(e) {
				this.setData({
					userId: this.userId,
					userPass: this.userPass,
					vpnPass: this.vpnPass,
					isWebVpnLogin: false
				});
				ssoLogout("SESSION=" + this.SSO_SESSION).then(() => {
					this.setData({
						isNeedLogin: true
					});
					this.sessionInfo.SSO_TGC = "";
					this.SSO_SESSION = "";
					this.sessionInfo.JWGL_cookie = "";
					this.sessionInfo.JSZX_cookie = "";
					uni.removeStorage({
						key: "SSO_SESSION"
					});
					uni.removeStorage({
						key: "SSO_TGC"
					});
					uni.removeStorage({
						key: "JWGL_cookie"
					});
					uni.removeStorage({
						key: "JSZX_cookie"
					});
					uni.removeStorage({
						key: "TWFID"
					});
					this.checkSsoLogin(SESSION => {
						this.getCaptcha(SESSION);
					});
				});
			},
			bindButtonBack: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 刷新验证码
			refreshCaptcha: function() {
				this.getCaptcha(this.SSO_SESSION);
			},
			loginAction: function(e) {
				this.loginFunc[e.currentTarget.dataset.type]();
			},
		},
		
	};
</script>
<style>
	/* pages/my/sso/sso.wxss */
	@import "../../common.css";

	.login {
		border: 5px;
	}

	page {
		background-color: #0081ff;
		color: white;
	}

	view {
		background-color: #0081ff;
	}

	.placeholder {
		color: #77bcff;
	}

	.notice {
		padding: 1rem;
		margin: 1rem;
		border-radius: .4rem;
		background-color: #1d8cfa;
		font-size: small;
	}

	.notice_sub {
		display: flex;
		background: inherit;
		width: fit-content;
	}

	.notice_left {
		padding: .2rem;
		background: #fff;
		color: #0081ff;
		border-radius: .3rem 0rem 0rem .3rem;
	}

	.notice_right {
		border: 1px solid #fff;
		padding: .2rem;
		border-radius: 0rem .3rem .3rem 0rem;
		background-color: inherit;
	}


	@media (prefers-color-scheme: dark) {

		/* DarkMode 下的样式 start */
		page,
		view,
		.notice {
			background-color: #1b1b1b;
		}

		.placeholder {
			color: gray
		}

		.my-cells>.weui-cells__title,
		.my-cell>.weui-cell__ft {
			color: gray
		}

		/* DarkMode 下的样式 end */
	}


	@import "./sso-wxa-auto-dark.css";
</style>
