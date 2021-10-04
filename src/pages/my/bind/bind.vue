<template>
	<view class="my-bind">
		<view class="top">
			<view class="input">
				<view class="iconfont icon-xuehao"></view>
				<input v-model="userId" placeholder="请输入学号" type="number"/>
			</view>
			<view class="input">
				<view :class="'iconfont ' + (showPass?'icon-kejian':'icon-yincang')" @click="showPass = !showPass"></view>
				<input v-model="userPass" placeholder="请输入密码" :password="!showPass" />
			</view>
			<view class="input">
				<!-- <view style="margin-left: 20rpx;">验证码</view> -->
				<input v-model="captchaCode" placeholder="请输入验证码" style="width: 190rpx; margin-right: 0;margin-left: 50rpx;"/>
				<image :src="captchaImg" style="height: 50rpx;width: 150rpx;margin-right: 10rpx;" @click="refreshCaptcha"></image>
			</view>
			<view class="button">
				<view class="login-btn" @click="tryToBind">绑定</view>
			</view>
		</view>
		<view class="bottom">
			<view @click="gotoForget">忘记密码</view>
		</view>
	</view>
</template>

<script>
	const log = require('../../../utils/log.js')
	import {LoginObj, CaptchaDecode} from '../../../utils/login/login.js'
	import {postRegister} from './api.js'
	import {RSAEncrypt} from '../../../utils/rsa/index.js'
	const app = getApp()
	export default {
		data(){
			return {
				userId: '',
				userPass: '',
				showPass: false,
				captchaCode: '',
				captchaImg: '',
				SSO_SESSION: '',
				execution: '',
				accountInfo: {}
			}
		},
		onLoad: function(){
			this.initUserData()
		},
		onReady: function(){
			this.SSORefresh()
		},
		methods: {
			initUserData: function() {
				this.userId = app.globalData.accountInfo.userId;
				this.userPass = app.globalData.accountInfo.userPass;
				this.accountInfo = app.globalData.accountInfo;
			},
			
			SSORefresh:async function(){
				try{
					const checkRet = await LoginObj.SSO.checkLogin(this.SSO_SESSION, '');
					this.SSO_SESSION = checkRet.session
					this.execution = checkRet.execution
					await this.refreshCaptcha();
				}catch(err){
					log.info('SSORefresh err -> ', err)
					if(err.code === 0){
						return;
					}
				}
			},
			tryToBind: async function(check = false) {
				try{
					const loginCookie = await LoginObj.SSO.doLogin({
						SSO_SESSION: this.SSO_SESSION,
						userId: this.userId,
						userPass: this.userPass,
						captcha: this.captchaCode,
						execution: this.execution
					})
					let tgc = loginCookie.match(/TGC=(.*?);/);
					let pass = RSAEncrypt(this.userPass)
					const reg = await postRegister(this.userId, pass)
					log.info(reg)
					const data = reg.data.data;
					if(data.result === true){
						app.globalData.userInfo.sid = this.userId
						uni.showToast({
							title: '绑定成功'
						});
					}else{
						uni.showToast({
							title: '绑定失败',
							icon: 'error'
						});
					}
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

			// 刷新验证码
			refreshCaptcha: function() {
				this.getCaptcha(this.SSO_SESSION);
			},
			
			gotoForget() {
				uni.showToast({
					icon: 'none',
					title: '开发中...'
				});
			}
		},
	}
</script>

<style scoped>
	.my-bind{
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.top {
		height: 60%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.input{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 50rpx;
		border-radius: 45rpx;
		box-shadow: #eee 0rpx 0rpx 10rpx 10rpx;
		height: 90rpx;
	}
	.input > .iconfont{
		margin: 20rpx;
	}
	.input > input{
		margin-right: 40rpx;
		text-align: center;
	}
	.button{
		margin-top: 100rpx;
		color: white;
	}
	.button > .login-btn{
		background-color: #007AFF;
		border-radius: 50rpx;
		padding: 25rpx 60rpx;
	}
</style>
