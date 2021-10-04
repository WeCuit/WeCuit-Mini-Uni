<template>
	<view class="login-page">
		<view class="logo-area">
			<view class="logo">
				<image src="../../static/logo.png" class="logo-item"></image>
			</view>
		</view>
		<view class="login-area" :style="{color: fail?'red':'#707070'}">
			<view :class="'iconfont ' + classstr"></view>{{text}}
		</view>
	</view>
</template>

<script>
	import {getAccessToken} from './api.js'
	const log = require('../../utils/log.js')
	const app = getApp()
	
	export default {
		data(){
			return {
				classstr: 'icon-jiazai loading',
				text: '登录中...',
				fail: false
			}
		},
		onReady(){
			this.getAccessToken()
		},
		methods:{
			getCode: function(){
				return new Promise((resolve, reject)=>{
					uni.login({
						success: resolve,
						fail: reject
					})
				})
			},
			getAccessToken: function(){
				this.getCode().then(res=>{
					log.info(res)
					if(res.code){
						return getAccessToken(res.code)
					}else{
						return Promise.reject(res)
					}
				}).then(res=>{
					log.info(res)
					const {data} = res.data
					app.globalData.userInfo.uid = data.userInfo.uid
					app.globalData.userInfo.stuId = data.userInfo.stuId
					app.globalData.userInfo.bind = data.bind
					app.globalData.auth[0] = data.auth[0]
					app.globalData.auth[1] = data.auth[1]
					this.goToHome()
				}).catch(err=>{
					log.error(err)
					let code = err?.data?.code ?? -1
					if(code === 1404){
						this.fail = true
						this.classstr = 'icon-shibai'
						this.text = '未注册'
					}
					setTimeout(this.goToHome, 100);
				})
			},
			goToHome: function(){
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped>
	.login-page{
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		height: 100vh;
	}
	.logo-area{
		display: flex;
		justify-content: center;
		height: 80%;
	}
	.logo{
		display: flex;
		align-items: center;
	}
	.logo-item{
		height: 200rpx;
		width: 200rpx;
		border-radius: calc(50%);
	}
	.login-area{
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 50rpx;
	}
	.loading{
		/* transition: 0.5s; */
		margin-top: 5rpx;
		margin-right: 10rpx;
		transform-origin: center center;
		animation: rotate 1s linear infinite;  /*开始动画后无限循环，用来控制rotate*/
	}
	@keyframes rotate{
		0%{
				transform: rotate(0);
			}
		50%{
			transform:rotate(180deg);
		}
		100%{
				 transform: rotate(360deg);
			}
	}

</style>
