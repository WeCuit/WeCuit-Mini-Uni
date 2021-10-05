<template>
	<view class="bind-mini">
		<!-- 二维码 -->
		<view class="qrcode-area">
			<!-- #ifdef MP-WEIXIN -->
			<image :src="qrcode" class="qrcode" show-menu-by-longpress="true"></image>
			<!-- #endif -->
			<!-- #ifdef MP-QQ -->
			<image :src="qrcode" class="qrcode" show-menu-by-longpress="true" @click="preview"></image>
			<!-- #endif -->
		</view>
		
		<!-- 按钮 -->
		<view class="button">
			<button type="primary" @click="loadQRCode">刷新二维码</button>
		</view>
		
		<!-- 说明 -->
		<view>
			请截屏或将图片保存后打开 QQ|微信 进行扫描
		</view>
		
	</view>
</template>

<script>
	import {getQRCode
	// #ifdef MP-WEIXIN
	, getStr2QR,
	// #endif
	} from './api.js'
	
	import log from "../../../utils/log.js"
	
	export default {
		data() {
			return {
				qrcode: ''
			}
		},
		onReady(){
			this.loadQRCode()
		},
		methods: {
			loadQRCode() {
				// #ifdef MP-QQ
				const qr = getQRCode('WX').then(res=>{
					this.qrcode = res.data.data.img
					log.info(encodeURIComponent(res.data.data.token))
				})
				// #endif
				
				// #ifdef MP-WEIXIN
				const qr = getQRCode('QQ').then(res=>{
					const {data} = res.data
					log.info(encodeURIComponent(res.data.data.token))
					return getStr2QR(data.url, 500, 500)
				}).then(res=>{
					this.qrcode = res.data.data.img
				})
				// #endif
				
			},
			// #ifdef MP-QQ
			preview: function(){
				uni.previewImage({
					urls: [this.qrcode]
				})
			}
			// #endif
		},
	}
</script>

<style>
	.bind-mini > .button{
		margin: 50rpx;
	}
	.qrcode-area{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 50rpx;
	}
	.qrcode{
		height: 500rpx;
		width: 500rpx;
	}
</style>
