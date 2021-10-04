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
				<navigator url="/pages/my/bind/bind" class="num-area" >
					<view>学号: {{sid||'未绑定'}}</view>
					<view>{{sid?'更新绑定':'立即绑定'}} ></view>
				</navigator>
			</uni-col>
		</uni-row>
	</div>
</template>

<script>
	const app = getApp();
	const log = require('../../utils/log.js')
	export default {
		props: {
			userid: {
				type: Number,
				default: -1
			},
			stuid: {
				type: String,
				default: null
			},
		},
		data(){
			return {
				uid: this.userid,
				sid: this.stuid
			}
		},
		watch: {
			stuid(newValue, oldValue) {
				this.sid = newValue
			},
			userid(newValue, oldValue) {
				this.uid = newValue
			}
		},
		onReady(){
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#7a9fcc'
			})
		},
		methods:{
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
