<script>
	//app.js
	const RSA = require("./utils/rsa/wx_rsa.js");
	const config = require("./config.js");
	const login = require("./utils/login/login.js");
	const log = require("./utils/log.js");
	import {
		getUserInfo
	} from './api';

	export default {
		onLaunch: function(e) {
			console.log("APP onLaunch", e); // 初始化数据

			this.initData(); // =========版本升级检测===============

			this.checkUpdate();
			this.loginClass = new login.DoLogin(this.globalData);
			this.globalData.autoLoginProcess = Promise.resolve();
			this.getUserInfo().then(res => {
				if ("string" != typeof res.openid) {
					uni.showToast({
						icon: 'none',
						title: '用户数据获取异常，请重启程序'
					});
				}

				this.globalData.openid = res.openid;
				this.globalData.accountInfo.isAdmin = res.isAdmin;

				if (this.globalData.accountInfo.isAutoLogin) {
					uni.showLoading({
						title: '自动登录中~'
					});
					this.globalData.autoLoginProcess = this.loginClass.autoLogin();
				} else {
					this.globalData.autoLoginProcess = Promise.resolve();
					console.log("未启用自动登录");
				}
			}).catch(e => {});
		},
		// 小程序发生脚本错误或 API 调用报错时触发。
		onError: function(e) {
			console.error('onError', e);
			log.info("onError" + JSON.stringify(e));
		},
		globalData: {
			API_DOMAIN: config.API_DOMAIN,
			start: null,
			classtable: null,
			checkInList: null,
			location: null,
			openid: "",
			accountInfo: {
				isAdmin: false,
				userId: "",
				userPass: "",
				vpnPass: "",
				isRemPass: false,
				isAutoLogin: false
			},
			isUser: false,
			sessionInfo: {
				JWGL_cookie: "",
				SSO_TGC: "",
				JSZX_cookie: "",
				theolCookie: ""
			},
			config: {
				github: "",
				group: ""
			},
			isADClose: "undefined" !== typeof qq ? false : true,
			autoLoginProcess: null
		},
		methods: {

			// 初始化数据
			initData: function() {
				uni.getSystemInfo({
					success: res => {
						this.globalData.windowHeight = res.windowHeight;
						this.globalData.windowWidth = res.windowWidth;
					},

					fail(err) {
						console.log(err);
					}

				});
				let ai = uni.getStorageSync("accountInfo");
				if (ai) this.globalData.accountInfo = ai;
				uni.getStorage({
					key: "isADClose",
					success: res => {
						this.globalData.isADClose = res.data;
					}
				});

				if (this.globalData.accountInfo.isAutoLogin) {
					this.globalData.isUser = uni.getStorageSync("isUser");
					this.globalData.sessionInfo.JSZX_cookie = uni.getStorageSync("JSZX_cookie");
					this.globalData.sessionInfo.JWGL_cookie = uni.getStorageSync("JWGL_cookie");
					this.globalData.sessionInfo.theolCookie = uni.getStorageSync("theolCookie");
					this.globalData.sessionInfo.SSO_SESSION = uni.getStorageSync("SSO_SESSION");
					this.globalData.sessionInfo.SSO_TGC = uni.getStorageSync("SSO_TGC");
					this.globalData.sessionInfo.TWFID = uni.getStorageSync("TWFID");
				} else {
					uni.getStorage({
						key: "isUser",
						success: res => {
							this.globalData.isUser = res.data;
						}
					});
					uni.getStorage({
						key: "JSZX_cookie",
						success: res => {
							this.globalData.sessionInfo.JSZX_cookie = res.data;
						}
					});
					uni.getStorage({
						key: "JWGL_cookie",
						success: res => {
							this.globalData.sessionInfo.JWGL_cookie = res.data;
						}
					});
					uni.getStorage({
						key: "theolCookie",
						success: res => {
							this.globalData.sessionInfo.theolCookie = res.data;
						}
					});
					uni.getStorage({
						key: "SSO_SESSION",
						success: res => {
							this.globalData.sessionInfo.SSO_SESSION = res.data;
						}
					});
					uni.getStorage({
						key: "SSO_TGC",
						success: res => {
							this.globalData.sessionInfo.SSO_TGC = res.data;
						}
					});
					uni.getStorage({
						key: "TWFID",
						success: res => {
							this.globalData.sessionInfo.TWFID = res.data;
						}
					});
				} // 课程表数据


				this.globalData.start = uni.getStorageSync("start");
				this.globalData.classtable = uni.getStorageSync("classtable");
				this.globalData.location = uni.getStorageSync("location"); // 初始化数据end
			},
			// =========版本升级检测===============
			checkUpdate: function() {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					console.log(res.hasUpdate);
				});
				updateManager.onUpdateReady(function() {
					uni.showModal({
						title: "更新提示",
						content: "新版本已经准备好，是否重启应用？",

						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}

					});
				});
			},
			/**
			 * 获取用户属性
			 *
			 * isAdmin, openid
			 */
			getUserInfo: function() {
				return new Promise((resolve, reject) => {
					uni.getStorage({
						key: "UserInfo",
						success: res => {
							// 本地有存储信息就直接用
							if (res.data) {
								/**
								 * {
								 *    isAdmin: boolean,
								 *    openid: *****
								 * }
								 */
								resolve(res.data);
							}
						},
						fail: err => {
							console.error(err); // 本地信息获取失败，远程获取

							this.login().then(code => {
								getUserInfo(code).then(data => {
									if ("object" == typeof data) {
										uni.setStorage({
											key: "UserInfo",
											data: data.info
										});
										/**
										 * {
										 *    isAdmin: boolean,
										 *    openid: *****
										 * }
										 */

										resolve(data.info);
									} else {
										reject(data);
									}
								});
							});
						}
					});
				});
			},

			login: function() {
				return new Promise((resolve, reject) => {
					uni.login({
						success: res => {
							if (res.code) resolve(res.code);
							else reject(res);
						},
						fail: err => {
							reject(err);
						}
					});
				});
			},
		}
	};
</script>
<style>
	@import "./assets/wxss/iconfont.css";

	/* 悬浮按钮 */
	.floatBtn {
		position: fixed;
		right: 8%;
		z-index: 888;
		background: #ff9900;
		width: 50px;
		height: 50px;
		border-radius: 30px;
		box-shadow: 0px 0px 1rem #888888;
		opacity: 0.7;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	@media (prefers-color-scheme: dark) {

		/* DarkMode 下的样式 start */
		.my-cell,
		page {
			background-color: #1b1b1b;
		}

		.footer {
			color: rgba(255, 255, 255, 0.8);
		}

		/* DarkMode 下的样式 end */
	}

	@import "./app-wxa-auto-dark.css";
</style>
