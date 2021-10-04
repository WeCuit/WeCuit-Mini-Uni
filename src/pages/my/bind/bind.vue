<template>
	<view class="my-bind">
		<view class="top">
			<view class="input">
				<view class="iconfont icon-dingyue"></view>
				<input v-model="userId" placeholder="请输入学号"/>
			</view>
			<view class="input">
				<view class="iconfont icon-dingyue"></view>
				<input v-model="userPass" placeholder="请输入密码" password="true"/>
			</view>
			<view class="button">
				<view class="login-btn">登录</view>
			</view>
		</view>
		<view class="bottom">
			<view @click="gotoForget">忘记密码</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				userId: '111111111111111111',
				userPass: '',
				style: {
					'border-radius': 'calc(50%)'
				}
			}
		},
		methods: {
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
