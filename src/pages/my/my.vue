<template>
	<view class="index-my">
		<Info :userid="uid" :stuid="sid"></Info>

		<uni-card title="账号相关">
			<label v-if="uid < 0" class="label">
				<navigator class="loginBtn" url="/pages/my/register/register" open-type="navigate">
					<view>
						注册账户
					</view>
					<view class="subicon-r iconfont icon-arr-right"></view>
				</navigator>
			</label>
			<label v-else class="label">
				<view class="loginBtn" @click="developing">
					<view>
						注销账户
					</view>
					<view class="subicon-r iconfont icon-arr-right"></view>
				</view>
			</label>
			<label v-if="uid>0" class="label">
				<navigator class="loginBtn" url="/pages/my/bind/mini" open-type="navigate">
					<view>
						<!-- #ifdef MP-WEIXIN -->
						绑定QQ
						<!-- #endif -->
						<!-- #ifdef MP-QQ -->
						绑定微信
						<!-- #endif -->
					</view>
					<view class="subicon-r iconfont icon-arr-right"></view>
				</navigator>
			</label>
			<label class="label last-label">
				<navigator class="loginBtn" url="/pages/my/sso/sso" open-type="navigate">统一登录中心</navigator>
				<view class="subicon-r iconfont icon-arr-right"></view>
			</label>
			
		</uni-card>

		<uni-card title="其它功能">
			<!--  #ifdef  MP-QQ -->
			<label class="label" style="margin-top: 0;">
				<view class="subicon iconfont icon-wenti"></view>
				<button class="buttonFix" plain="true" open-type="openGroupProfile"
					group-id="940309953">有问题加群：940309953</button>
				<view class="subicon-r iconfont icon-arr-right"></view>
			</label>
			<!--  #endif -->
			<!--  #ifdef  MP-WEIXIN -->
			<label @tap="bindGroup" class="label" style="margin-top: 0;">
				<view class="subicon iconfont icon-wenti"></view>
				<view>有问题加群</view>
				<view class="subicon-r iconfont icon-arr-right"></view>
			</label>
			<!--  #endif -->
			<label @tap="bindOpen" class="label">
				<view class="subicon iconfont icon-github"></view>
				<view>开源地址</view>
				<view class="subicon-r iconfont icon-arr-right"></view>
			</label>
			<!-- <navigator url="/pages/my/sub/sub" class="label">
					<view class="subicon iconfont icon-dingyue"></view>
					<view>订阅管理</view>
					<view class="subicon-r iconfont icon-arr-right"></view>
				</navigator> -->
			<label class="label">
				<view class="subicon iconfont icon-yijian" style="color:#1CBBB4"></view>
				<button class="buttonFix" plain="true" open-type="feedback">意见反馈</button>
				<view class="subicon-r iconfont icon-arr-right"></view>
			</label>
			<label class="label">
				<view class="subicon iconfont icon-fenxiang" style="color:#1CBBB4"></view>
				<button class="buttonFix" plain="true" open-type="share">分享小程序</button>
				<view class="subicon-r iconfont icon-arr-right"></view>
			</label>
			<navigator url="/pages/my/dataMag/dataMag" class="label">
				<view class="subicon iconfont icon-data"></view>
				<view>数据管理</view>
				<view class="subicon-r iconfont icon-arr-right"></view>
			</navigator>
			<!-- #ifdef MP-QQ -->
			<navigator url="/pages/my/ADMag/ADMag" class="label">
				<view class="subicon iconfont icon-guanggao"></view>
				<view>广告管理</view>
				<view class="subicon-r iconfont icon-arr-right"></view>
			</navigator>
			<!-- #endif -->
			<label @tap="developing" class="label">
				<view class="subicon iconfont icon-yonghuxieyi"></view>
				<view>用户协议</view>
				<view class="subicon-r iconfont icon-arr-right"></view>
			</label>
			<label @tap="developing" class="label">
				<view class="subicon iconfont icon-yinsizhengce"></view>
				<view>隐私政策</view>
				<view class="subicon-r iconfont icon-arr-right"></view>
			</label>
			<navigator class="label last-label" url="/pages/my/about" open-type="navigate">
				<view class="subicon iconfont icon-guanyu" style="color:orange"></view>
				<view>关于</view>
				<view class="subicon-r iconfont icon-arr-right"></view>
			</navigator>
			<!-- <label style="color:red" @tap="bindLogout" class="label">
				<view class="subicon iconfont icon-tuichu"></view>
				<view>退出登录</view>
				<view class="subicon-r iconfont icon-arr-right"></view>
			</label> -->
		</uni-card>

		<!-- TabBar 占位 -->
		<view style="height: 10vh;background-color: #F1F1F1;"></view>
	</view>
</template>

<script>
	const app = getApp();
	import Info from './info.vue'
	
	export default {
		data() {
			return {
				uid: -1,
				sid: null
			};
		},

		components: {
			Info
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
		},
		
		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#7a9fcc'
			})
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.uid = app.globalData.userInfo.uid
			this.sid = app.globalData.userInfo.sid
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			developing: function(){
				uni.showToast({
					title: '开发中...',
					icon: 'none'
				});
			},
			// 点击事件
			bindGroup: function() {
				uni.showModal({
					title: '将复制以下内容',
					content: app.globalData.config.group,

					success(res) {
						if (res.confirm) {
							uni.setClipboardData({
								data: app.globalData.config.group
							});
						} else if (res.cancel) {}
					}

				});
			},
			bindOpen: function() {
				uni.showModal({
					title: '将复制以下内容',
					content: app.globalData.config.github,

					success(res) {
						if (res.confirm) {
							uni.setClipboardData({
								data: app.globalData.config.github
							});
						} else if (res.cancel) {}
					}

				});
			},
			bindLogout: function() {
				uni.removeStorageSync('TWFID');
				uni.removeStorageSync('SSO_TGC');
				uni.removeStorageSync('JWGL_cookie');
				uni.removeStorageSync('SSO_TGC');
				uni.showToast({
					title: '登录凭据清除完毕'
				});
			}
		}
	};
</script>
<style>
	.index-my {
		background-color: #F1F1F1;
		/* height: 100vh; */
	}
		
	.loginBtn{
		width: 100vw;
		font-size: 30rpx;
		color: gray !important;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	/* 下部分 */
	.label {
		color: gray;
		border-bottom: 1rpx solid #d9d9d9;
		height: 80rpx;
		font-size: 30rpx;
		align-items: center;
		display: flex;
	}

	/* 最后一个 */
	.last-label {
		border-bottom: none;
	}

	.buttonFix {
		border: 0px !important;
		color: gray !important;
		margin-left: 0px !important;
		font-size: 30rpx;
		font-weight: normal;
		text-align: left !important;
		padding: 0% !important;
	}

	.subicon {
		margin: 10px;
		font-size: 30rpx;
	}

	.subicon-r {
		margin-left: auto;
		margin-right: 1rem;
		font-size: 30rpx;
	}
</style>
