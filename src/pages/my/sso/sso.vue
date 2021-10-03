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

			<view>WEBVPN<text v-if="isWebVpnLogin">已登录</text><text v-else data-type="WEBVPNLogin"
					@tap="loginAction">未登录</text></view>
			<view>教务处<text v-if="isJwglLogin">已登录</text><text v-else data-type="JWGLLogin" @tap="loginAction">未登录</text>
			</view>

			<text
				style="margin:20px;display: block;">注：\r\n一旦阁下成功登录了统一认证中心，\r\n那么系统将会自动登录以下服务：\r\n1.WEBVPN\r\n2.教务管理系统\r\n
				\r\n 另外：如果看到“未登录”三个字请戳一下它们~</text>
			<button type="primary" @tap="bindButtonLogout">注销</button>
			<button style="margin-top:40rpx" @tap="bindButtonBack">返回</button>
		</view>
	</view>
</template>

<script>
	// pages/my/sso/sso.js
	const XMLParser = require('@xmldom/xmldom')
	const xmlParser = new XMLParser.DOMParser();
	const log = require('../../../utils/log.js')
	import {LoginObj, CaptchaDecode} from '../../../utils/login/login.js'
	import {
		jwglLogin,
		ssoLogout,
		WV_login,
		WV_loginAuth,
		WV_loginCheck
	} from '../api'; 
	
	// var L = new login.DoLogin();
	// rsa 加密
	const RSA = require("../../../utils/rsa/wx_rsa.js");
	const encrypt = new RSA.RSAKey();
	const app = getApp();
	let _this;
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
			this.SSORefresh()
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
				this.captchaCode = formData.captcha;

				if (this.isRemPass) {
					uni.setStorage({
						key: "accountInfo",
						data: this.accountInfo
					});
				}

				this.SSOLogin().then(res=>{
					this.isNeedLogin = false
					this.OtherLogin()
				}).catch(err=>{
					log.error('formSubmit err -> ', err)
				})
			},

			/**
			 * 获取验证码
			 * @param {*} r
			 */
			getCaptcha: function(SESSION) {
				LoginObj.SSO.getCaptcha(SESSION).then(res => {
					const captcha = res.data;
					let imgBase64 = "data:image/png;base64," + uni.arrayBufferToBase64(captcha);
					this.captchaImg = imgBase64
					this.captchaDecode(captcha);
				}).catch(err => {
					console.log("error", err);
				});
			},
			
			// ORC识别验证码
			captchaDecode: function(pic) {
				CaptchaDecode(pic).then(res=>{
					this.captchaCode = res.data.data.result;
				}).catch ((err) => {
					log.error('OCR识别失败', err)
					uni.showToast({
						title: 'OCR识别失败',
						icon: 'error'
					});
				})
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
					this.SSORefresh()
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
				this[e.currentTarget.dataset.type]();
			},
			SSORefresh:async function(){
				try{
					const checkRet = await LoginObj.SSO.checkLogin(this.SSO_SESSION, this.sessionInfo.SSO_TGC);
					this.SSO_SESSION = checkRet.session
					this.execution = checkRet.execution
					await this.refreshCaptcha();
				}catch(err){
					log.info('SSORefresh err -> ', err)
					if(err.code === 0){
						this.isNeedLogin = false
						this.OtherLogin(true)
						return;
					}
				}
			},
			SSOLogin: async function(check = false) {
				try{
					const loginCookie = await LoginObj.SSO.doLogin({
						SSO_SESSION: this.SSO_SESSION,
						userId: this.userId,
						userPass: this.userPass,
						captcha: this.captchaCode,
						execution: this.execution
					})
					let tgc = loginCookie.match(/TGC=(.*?);/);
					this.sessionInfo.SSO_TGC = tgc[1]
					uni.setStorage({
						key: "SSO_TGC",
						data: tgc[1]
					});
				}catch(err){
					log.error('sso err -> ', err)
					uni.showToast({
						icon: "none",
						title: err.msg
					});
					if(err.code === 12405 || err.code === 401){
						// 验证码有误
						setTimeout(this.refreshCaptcha, 2000)
					}
					if(err.execution)this.execution = err.execution
					throw err
				}
			},
			WEBVPNLogin: async function(check = false) {
				try{
					// check 
					if(check)
						await LoginObj.WEBVPN.checkLogin(0, this.sessionInfo.TWFID);
					
					const auth = await LoginObj.WEBVPN.auth(0, this.sessionInfo.TWFID);
					this.sessionInfo.TWFID = auth.TwfID
					const twfid = await LoginObj.WEBVPN.doLogin(this.userId, this.vpnPass || (this.userPass + "_" + auth.rc), auth)
					this.sessionInfo.TWFID = twfid
					uni.setStorage({
						key: "TWFID",
						data: twfid
					});
				}catch(err){
					if(err === 0)return;
					log.error('webvpn err -> ', err)
					uni.showToast({
						title: `WEBVPN${err.msg}`,
						icon:'error'
					})
					this.bindButtonLogout()
					throw err
				}
			},
			JWGLLogin: async function(check = false) {
				try{
					if(check)await LoginObj.JWGL.checkLogin(this.sessionInfo.TWFID, this.sessionInfo.JWGL_cookie)
					const login = await LoginObj.JWGL.doLogin(this.sessionInfo.TWFID, this.sessionInfo.SSO_TGC)
					this.sessionInfo.JWGL_cookie = login?.data?.data?.cookie??''
					uni.setStorage({
						key: "JWGL_cookie",
						data: this.sessionInfo.JWGL_cookie
					});
				}catch(err){
					if(err === 0)return;
					log.error('JWGL err -> ', err)
					throw err
				}
			},
			OtherLogin: async function(check = false) {
				try{
					await this.WEBVPNLogin(check)
					this.isWebVpnLogin = true
					await this.JWGLLogin(check)
					this.isJwglLogin = true
				}catch(err){
					log.error('OtherLogin err -> ', err)
				}
			},
		},
		
	};
</script>
<style>
	/* pages/my/sso/sso.wxss */
	@import "../../common.css";
	@import "./sso-wxa-auto-dark.css";

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


</style>
