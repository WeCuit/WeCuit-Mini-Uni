<template>
<view>
<!-- pages/welcome/admit/admit.wxml -->
<form @submit="queryHandle">
    <mp-cells title="考生号(14位)：">
        <mp-cell ext-class="my-cell">
            <input name="ksh" class="weui-input" placeholder="考生号(14位)">
        </mp-cell>
    </mp-cells>
    <mp-cells title="身份证号：">
        <mp-cell ext-class="my-cell">
            <input name="sfz" class="weui-input" placeholder="身份证号">
        </mp-cell>
    </mp-cells>
    <button type="primary" form-type="submit">查询</button>
</form>
<htmlParser :html="result">
  少女祈祷中......
</htmlParser>

<view style="color:#0a019c;">{{update}}</view>
<view class="table">
    <view class="item title">
        <view>省份及批次</view>
        <view>录取最低分</view>
    </view>
    <block v-for="(item, index) in list" :key="index">
        <view class="item sub">
            <view>{{item.site}}</view>
            <view>{{item.lowest}}</view>
        </view>
    </block>
</view>
</view>
</template>

<script>
// pages/welcome/admit/admit.js
import { queryAdmit } from './api';
const app = getApp();
import mpCells from "../../../miniprogram_npm/weui-miniprogram/cells/cells";
import mpCell from "../../../miniprogram_npm/weui-miniprogram/cell/cell";
import htmlParser from "../../../miniprogram_npm/parser-wx/index";

export default {
  data() {
    return {
      list: [],
      result: '',
      update: ""
    };
  },

  components: {
    mpCells,
    mpCell,
    htmlParser
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.queryHandle(null);
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
  onPullDownRefresh: function () {
    this.queryHandle(null);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    queryHandle: function (e) {
      let ksh = '',
          sfz = '';

      if (e) {
        let data = e.detail.value;
        ksh = data.ksh;
        sfz = data.sfz;
      }

      queryAdmit(ksh, sfz).then(res => {
        const resp = res.data;
        const data = resp.data;
        this.setData({
          list: data.list,
          result: data.result,
          update: data.update
        });
      });
    }
  }
};
</script>
<style>
/* pages/welcome/admit/admit.wxss */
@import "../common.css";

.table{
    display: flex;
    flex-direction: column;
}
.title{
    background-color: #03a9f4;
}
.item{
    display: flex;
}

.item > view{
    width: 50%;
    padding: 20rpx;
}
.sub:nth-child(odd){
    background-color: #ffffff;
}

.sub:nth-child(even){
    background-color: #cccccc;
}

@import "./admit-wxa-auto-dark.css";
</style>