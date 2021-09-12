<template>
<!--pages/my/dataMag/dataMag.wxml-->

<view class="setting">
	<navigator url="/pages/my/ADMag/watchAD/watchAD" class="label">
		<view class="subicon iconfont icon-guanggao"></view>
		<view>欣赏广告</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</navigator>
	<label v-if="isADClose" @tap="openAD" class="label" style="color:green">
		<view class="subicon iconfont icon-guanggao" style="color:green"></view>
		<view>打开广告</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</label>
	<label v-else @tap="closeAD" class="label" style="color:red">
		<view class="subicon iconfont icon-wuguanggao" style="color:red"></view>
		<view>关闭广告</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</label>
</view>
</template>

<script>
// pages/my/dataMag/dataMag.js
const app = getApp();
var videoAd = null;

export default {
  data() {
    return {
      isADClose: false
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isADClose: app.globalData.isADClose
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    videoAd = uni.createRewardedVideoAd({
      adUnitId: "bb4d8c56d8a3852de532e389f329f10a"
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    openAD: function () {
      this.showConfirm("阁下确定要打开广告吗？").then(() => {
        app.globalData.isADClose = false;
        uni.setStorage({
          key: 'isADClose',
          data: false,
          success: res => {
            console.log(res);
            uni.showModal({
              title: "提示",
              content: '不出意外，广告已经打开~',
              showCancel: false
            });
          }
        });
        this.setData({
          isADClose: false
        });
      });
    },
    closeAD: function () {
      this.showConfirm("需观看视频广告才可关闭广告").then(() => {
        videoAd.onClose(res => {
          console.log("videoAd onClose", res);

          if (res.isEnded) {
            app.globalData.isADClose = res.isEnded;
            uni.setStorage({
              key: 'isADClose',
              data: true,
              success: res => {
                console.log(res);
                uni.showModal({
                  title: "提示",
                  content: '不出意外，广告已经关闭~',
                  showCancel: false
                });
              }
            });
            this.setData({
              isADClose: true
            });
          } else {
            uni.showModal({
              title: "提示",
              content: '未看完，关闭广告失败~',
              showCancel: false
            });
          }
        });
        videoAd.load().then(() => {
          console.log("激励视频加载成功");
          videoAd.show().then(() => {
            console.log("激励视频 广告显示成功");
          }).catch(err => {
            console.log("激励视频 广告显示失败");
          });
        }).catch(err => {
          console.log("激励视频加载失败");
        });
      });
    },
    showConfirm: function (text) {
      return new Promise((resolve, reject) => {
        uni.showModal({
          title: "提示",
          content: text,
          confirmColor: "black",
          success: res => {
            if (res.confirm) {
              resolve();
            } else if (res.cancel) {
              uni.showToast({
                icon: "none",
                title: "取消"
              });
              reject();
            }
          }
        });
      });
    }
  }
};
</script>
<style>
/* pages/my/dataMag/dataMag.wxss */

.btnLoginJWC {
    margin: 0.5rem;
    text-align: center;
    background-color: #0066ff;
    border-radius: 9px;
    padding: 0.8rem;
    color: white;
    font-size: 30rpx;
}

.setting {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    border-radius: 7px;
    margin: 0.3rem;
    font-size: small;
    margin-top: 3vh;
    margin-bottom: 4rem;
}
.setting > .label {
    color: gray;
    border-bottom: 1rpx solid #d9d9d9;
    height: 9vh;
    font-size: 30rpx;
    align-items: center;
    display: flex;
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
    margin: 11px;
    font-size: 30rpx;
}
.subicon-r {
    margin-left: auto;
    margin-right: 1rem;
    font-size: 30rpx;
}

</style>