<template>
<!--pages/maintenance/maintenance.wxml-->
<!-- 维护界面 -->
<view>
  <view class="maintenance-title">维护公告</view>
  <beat-char :beat-text="maintenanceBText"></beat-char>
  <view class="maintenance-other-text">
    <text>{{maintenanceOText}}</text>
  </view>
</view>
</template>

<script>
import beatChar from "../../components/beat-char/beat-char";

export default {
  data() {
    return {
      maintenanceBText: "",
      maintenanceOText: ""
    };
  },

  components: {
    beatChar
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: "系统维护"
    });
    uni.hideHomeButton();
    this.maintenanceBText = options.BText;
    this.maintenanceOText = options.OText;
    // this.getTabBar().setData({
    //     isShow: false,
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      maintenanceBText: this.maintenanceBText,
      maintenanceOText: this.maintenanceOText
    });
  },

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
  methods: {}
};
</script>
<style>
/* pages/maintenance/maintenance.wxss */
.maintenance-title{
    padding: 50rpx;
    font-size: 100rpx;
    text-align: center;
}
.maintenance-other-text{
    color:cadetblue;
    text-align: center;
}
</style>