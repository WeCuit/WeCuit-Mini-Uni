<template>
	<view class="my-register">
		<view style="color:red">注意，本功能还处于线上测试阶段，暂不建议注册账户</view>
		<button type="primary" @click="doRegister">注册</button>
	</view>
</template>

<script>
	import getMiniRegister from './api.js'
	const app = getApp()
	export default {
		data(){
			return{
			
			}
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
			doRegister: function(){
				this.getCode().then(res=>{
					if(res.code)return getMiniRegister(res.code)
					else return Promise.reject(res)
				}).then(res=>{
					const {data} = res.data
					const {token, userInfo} = data;
					app.globalData.userInfo.uid = userInfo.uid;
					app.globalData.token = token
					uni.showToast({
						title: '注册成功',
						icon: 'success'
					})
					setTimeout(uni.navigateBack, 1000);
				})
				
			}
		}
		
	}
</script>

<style scoped>
	.my-register{
		margin: 30rpx;
	}
</style>
