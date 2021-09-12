<template>
<view>
<!--pages/watchAD/watchAD.wxml-->
<view>banner广告</view>
<ad unit-id="5454da2c63e03ff3889c8a2dc5e90fb3"></ad>

<text>\r\n\r\n</text>
<view>积木广告</view>
<ad unit-id="cc64587dbbb385f7537d2b3a4f3b56fd" type="block" block-orientation="landscape" block-size="5"></ad>

<text>\r\n\r\n</text>
<view @tap="AD_box">点击显示盒子广告</view>

<text>\r\n\r\n</text>
<view @tap="AD_IScreen">点击显示插屏广告</view>

<text>\r\n\r\n</text>
<view @tap="AD_reward">点击激励视频广告</view>

<text>\r\n\r\n</text>
<view>feeds广告</view>
<ad unit-id="240fc3785c9751daa217884bbd12334d" type="feeds"></ad>

<text>\r\n\r\n</text>
<view>卡片广告</view>
<ad unit-id="a787d6d9637a2c0c6c69d927e301c9d2" type="card"></ad>
</view>
</template>

<script>
// pages/watchAD/watchAD.js
var InterstitialAd = null;
var videoAd = null;
var InterstitialAd_timeout = null;

export default {
  data() {
    return {};
  },

  components: {},
  props: {},

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {},

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    // this.AD_box();
    videoAd = uni.createRewardedVideoAd({
      adUnitId: "bb4d8c56d8a3852de532e389f329f10a"
    });
    /* 建议放在onReady里执行，提前加载广告 */

    InterstitialAd = uni.createInterstitialAd({
      adUnitId: "2ad3e6c8da66801a9da798a6a006847b"
    });
    InterstitialAd.load().catch(err => {
      console.error("load", err);
    });
    InterstitialAd.onLoad(() => {
      console.log("onLoad event emit");
    });
    InterstitialAd.onClose(() => {
      console.log("close event emit");
    });
    InterstitialAd.onError(e => {
      console.log("error", e);
    });
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    InterstitialAd_timeout = setTimeout(this.AD_IScreen, 30 * 1000);
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    clearTimeout(InterstitialAd_timeout);
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    clearTimeout(InterstitialAd_timeout);
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {},

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {},
  methods: {
    // 插屏广告
    AD_IScreen: function () {
      /* 建议放在需要展示插屏广告的时机执行 */
      InterstitialAd.show().catch(err => {
        console.error("show", err);
        uni.showModal({
          title: "出错了",
          content: err.errMsg,
          showCancel: false
        });
      });
    },
    // 盒子广告
    AD_box: function () {
      let appbox = uni.createAppBox({
        adUnitId: "7b53a3d9df5f054de548988860f206e4"
      });
      appbox.load().then(() => {
        appbox.show();
      });
    },
    // 激励视频广告
    AD_reward: function () {
      videoAd.onError(function (res) {
        console.log("videoAd onError", res);
      });
      videoAd.onLoad(function (res) {
        console.log("videoAd onLoad", res);
      });
      videoAd.onClose(function (res) {
        console.log("videoAd onClose", res);
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
    }
  }
};
</script>
<style>
/* pages/watchAD/watchAD.wxss */
</style>