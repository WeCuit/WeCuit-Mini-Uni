<template>
	<view>
		<!--pages/card/card.wxml-->
		<view :style="'display:' + ((showQRCode || showPayRet)?'none':'block') + ';margin-bottom: 5rem;'">
			<view>
				<swiper style="height: 10rem;" :autoplay="true" duration="500">
					<block v-for="(item, index) in wallet" :key="index">
						<swiper-item>
							<view class="wallet-card">
								<text class="wallet-card-user">{{userName}}</text>
								<text class="wallet-card-name">{{item.WalletName}}余额（元）</text>
								<text class="wallet-card-count">{{item.MonDBCurr}}</text>
							</view>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<view class="actionList">
				<view v-for="(item, index) in actions" :key="index">
					<view @tap="actionHandle(item.action)" :data-data="item.data">
						<view :class="'iconfont ' + item.font" style="font-size: 2rem;"></view>{{item.text}}
					</view>
				</view>
			</view>
			<view v-for="(item, index) in DealRec" :key="index">
				<mp-cells ext-class="my-cells" :title="item.Month">
					<mp-cell v-for="(item, index2) in item.PaymentRows" :key="index2" ext-class="my-cell">
						<view style="display: flex;">
							<view
								style="border-right: 1px solid #ccc;padding: 17rpx;align-self: center;font-size: small;">
								{{item.Date}}</view>
							<view style="padding: 17rpx;">
								<view>{{item.FeeName}}</view>
								<view style="font-size:small;color:gray;">{{item.Source}}</view>
							</view>
						</view>
						<view slot="footer">
							<view style="color:orange;">{{item.MonDeal>=0?'+'+item.MonDeal:item.MonDeal}}</view>
							<view style="font-size:small;">{{item.Time}}</view>
						</view>
					</mp-cell>
				</mp-cells>
			</view>

		</view>

	</view>
</template>

<script>
	// pages/card/card.js
	const app = getApp();
	import Card from "../../utils/card";
	import {
		yktLogin,
		getAccWallet,
		getDealRec
	} from './api';
	import mpCell from "../../miniprogram_npm/weui-miniprogram/cell/cell";
	import mpCells from "../../miniprogram_npm/weui-miniprogram/cells/cells";

	export default {
		data() {
			return {
				userName: "姓名",
				CARD_AccNum: 0,
				wallet: [{
					WalletNum: "1",
					WalletName: "主钱包",
					MonDBCurr: "0.00",
					IsOpen: "0"
				}, {
					WalletNum: "9",
					WalletName: "库钱包1",
					MonDBCurr: "0.00",
					IsOpen: "0"
				}],
				actions: [{
					text: "充值",
					font: "icon-charge",
					action: "bindChargeAct",
					data: ""
				}],
				DealRec: []
			};
		},

		components: {
			mpCell,
			mpCells
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			uni.getStorage({
				key: "CARD_AccNum",
				success: res => {
					if (res.data) {
						this.CARD_AccNum = res.data;
						this.getWalletDetail();
						this.getDealRec(0, "", 0, 0);
					}
				},
				fail: err => {
					this.loginYKT(res => {
						if (res) {
							this.getWalletDetail();
							this.getDealRec(0, "", 0, 0);
						}
					});
				}
			});
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.loginYKT(res => {
				if (res) {
					this.getWalletDetail();
					this.getDealRec(0, "", 0, 0);
				}
			});
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			// 一卡通登录
			loginYKT: function(r) {
				uni.showLoading({
					title: "登录中~"
				});
				yktLogin(app.globalData.sessionInfo.SSO_TGC).then(res => {
					const resp = res.data;
					uni.stopPullDownRefresh();
					uni.hideLoading();
					this.CARD_AccNum = resp.data.AccNum;
					uni.setStorage({
						data: resp.data.AccNum,
						key: "CARD_AccNum"
					});
					r(true);
				}).catch(err => {});
			},
			// 获取钱包金额
			getWalletDetail: function() {
				getAccWallet(this.CARD_AccNum).then(res => {
					const data = res.data.data;
					this.setData({
						wallet: data.Rows[0].WalletRows,
						userName: data.Rows[0].AccName
					});
				});
			},

			/**
			 * 获取详细流水信息
			 * @param {*} begin 开始时间 年月日
			 * @param {*} end 截止时间 年月日
			 * @param {*} type  类型 全部0|充值1|转账2|消费3|其它4
			 * @param {*} walletNum  0所有钱包|指定钱包编号
			 */
			getDealRec: function(begin, end, type, walletNum) {
				const data = {
					AccNum: this.CARD_AccNum,
					// 年月日
					BeginDate: '' + begin,
					// 年月日
					EndDate: '' + end,
					// 类型 全部0|充值1|转账2|消费3|其它4
					Type: '' + type,
					ViceAccNum: '' + -1,
					// 0所有钱包|指定钱包编号
					WalletNum: '' + walletNum,
					RecNum: '' + 1,
					Count: '' + 10
				};
				getDealRec(data).then(res => {
					const data = res.data.data;
					this.setData({
						DealRec: data.Rows
					});
				});
			},
			actionHandle: function (action) {
				this[action]()
			},
			// 用户尝试点击充值按钮
			bindChargeAct: function() {
				// #ifdef MP-QQ
				uni.showModal({
					title: "需要使用“易校园”小程序",
					content: "QQ没有“易校园”小程序，故暂不支持该功能，如需充值请使用微信小程序",
					showCancel: false
				});
				return;
				// #endif

				// #ifdef MP-WEIXIN
				uni.showModal({
					title: "需要使用易校园",
					content: "当前操作需使用易校园小程序，确定将尝试打开“易校园”小程序",

					success(res) {
						if (res.confirm) {
							uni.navigateToMiniProgram({
								appId: "wxe825270ae451b798",
								path: "pages/card/pages/rechargeCard/rechargeCard"
							});
						} else if (res.cancel) {
							uni.showToast({
								icon: "none",
								title: "你取消了本次操作"
							});
						}
					}
				});
				// #endif
			},
			item() {
				console.log("占位：函数 item 未声明");
			}

		}
	};
</script>
<style>
	/* pages/card/card.wxss */
	@import "../common.css";

	.wallet-card {
		height: 90%;
		background-color: #607d8b;
		margin: 30rpx;
		border-radius: 35rpx;
		box-shadow: 0px 1px 5px #b4b4b4;
	}

	.wallet-card-user {
		padding: 0.6rem;
		display: block;
	}

	.wallet-card-name {
		padding: 0.8rem;
		font-size: small;
		color: #311919db;
	}

	.wallet-card-count {
		display: block;
		padding: 1rem;
		font-size: x-large;
	}

	.actionList {
		text-align: center;
		color: red;
	}

	.my-cells {
		padding: 0.1rem;
	}


	@media (prefers-color-scheme: dark) {

		/* DarkMode 下的样式 start */
		page {
			background-color: #1b1b1b;
		}

		.my-cells>.weui-cells__title,
		.my-cell>.weui-cell__ft {
			color: gray
		}

		/* DarkMode 下的样式 end */
	}
</style>
