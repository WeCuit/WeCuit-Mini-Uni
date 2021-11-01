<template>
	<view class="card">
		<view class="title">{{title}}</view>
		<text class="body">{{content}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '标题'
			},
			content: {
				type: String,
				default: '内容'
			},
		},
	}
</script>

<style>
	.card{
		background-color: #fff;
		border-radius: 20rpx;
		margin: 20rpx;
		padding: 20rpx;
	}
	.card > .title{
		border-bottom: #eee solid 1px;
		padding: 10rpx;
		display: flex;
	}
	.card > .body{
		padding: 10rpx;
		display: block;
		word-break: break-all;
		font-size: small;
	}
</style>
