<template>
	<div class="my-login">
		<uni-row>
			<uni-col>
				<view style="display: flex;padding: 30rpx;">
					<view class="uinfo">
						<view class="avatar">
							<open-data type="userAvatarUrl"></open-data>
						</view>
						<view class="nick">
							<open-data type="userNickName" class="nickname"></open-data>
							<view class="uid">UID:{{uid === -1? '未注册': uid}}</view>
						</view>
					</view>
					<view class="semester-area">
						<view class="semester">
							<view>2021-2022学年 第1学期</view>
							<!-- <view>第5周--星期日</view> -->
						</view>
					</view>
				</view>
			</uni-col>
			<uni-col>
				<view class="num-area" @click="developing">
					<view>学号: {{num||'未绑定'}}</view>
					<view>立即绑定 ></view>
				</view>
				<!-- <navigator url="/pages/my/bind/bind" class="num-area" >
					<view>学号: {{num||'未绑定'}}</view>
					<view>立即绑定 ></view>
				</navigator> -->
			</uni-col>
		</uni-row>
	</div>
</template>

<script>
	const app = getApp();
	
	export default {
		data(){
			return {
				uid: -1
			}
		},
		onReady(){
			this.uid = app.globalData.userInfo.uid
			this.num = app.globalData.userInfo.sid
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#7a9fcc'
			})
		},
		methods:{
			developing: function(){
				uni.showToast({
					title: '开发中...',
					icon: 'none'
				});
			},
		}
	}
</script>

<style>
	.my-login{
		background-color: #7a9fcc;
		padding: 10rpx;
	}
	.avatar{
		height: 100rpx;
		width: 100rpx;
		border: #ffffff44 1px solid;
		border-radius: 10rpx;
		overflow: hidden;
	}
	.uinfo{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.uinfo > .nick{
		margin-left: 10rpx;
	}
	.uinfo .nickname{
		color: #eee;
		font-size: 30rpx;
	}
	.uinfo .uid{
		color: #ddd;
	}
	.semester-area{
		flex: 1;
		color: #dddddd;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		flex-direction: column;
	}
	.semester{
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.num-area{
		display: flex;
		color: #ddd;
		justify-content: space-between;
		padding: 0 30rpx 20rpx 30rpx;
	}
	.uinfo .uid, .semester-area, .num-area{
		font-size: 25rpx;
	}
</style>
