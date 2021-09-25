<template>
		<view class="my-top">
			<view class="my-avatar">
				<image mode="scaleToFill" :src="avatar.length===0?'/static/my.png':avatar" style="height: 80px; width: 80px;"></image>
			</view>
			<view v-if="nickName.length === 0" @click="miniLogin" class="miniLogin">登录</view>
			<view v-else class="miniLogin2">{{nickName}}</view>
		</view>
</template>

<script>
	const app = getApp();
	export default {
		data(){
			return {
				avatar: '',
				nickName: ''
			}
		},
		methods:{
			miniLogin(){
				console.log('login')
				// #ifdef MP-WEIXIN
				uni.getUserProfile({
					desc: '获取登录信息'
				}).then(res=>{
					if(res[0])return Promise.reject(res[0]);
					res = res[1];
					console.log(res);
					app.globalData.userPlatformInfo = res.userInfo;
					this.avatar = res.userInfo.avatarUrl;
					this.nickName = res.userInfo.nickName;
				}).catch(err=>{
					console.log(err)
				})
				// #endif
			}
		}
	}
</script>

<style>
	.my-top {
		width: 100%;
		height: 40vh;
		background-color: #0081FF;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	
	.my-avatar {
		margin-top: 20px;
		width: 80px;
		height: 80px;
		background-color: #0000FF10;
		border: #eee solid 5px;
		border-radius: calc(50%);
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.miniLogin{
		background-color: #00e000;
		color: white;
		margin-top: 20rpx;
		padding: 10rpx 30rpx;
		border-radius: calc(10rpx);
		vertical-align: middle;
		display: block;
	}
	.miniLogin2{
		color: white;
		margin-top: 20rpx;
	}
</style>
