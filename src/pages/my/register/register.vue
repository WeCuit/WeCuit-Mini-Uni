<template>
	<view class="my-register">
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
					const {auth, userInfo} = data;
					app.globalData.userInfo.uid = userInfo.uid;
					app.globalData.auth[0] = auth[0]
					app.globalData.auth[1] = auth[1]
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
