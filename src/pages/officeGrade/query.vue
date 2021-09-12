<template>
<!--pages/computerCenter/officeGrade/query.wxml-->

<form catchsubmit="formSubmit" catchreset="formReset">
    <mp-cells ext-class="my-cells" title="请输入所需信息">
        <mp-cell title="昵称：">
            <view><input name="nickname" class="login weui-input" type="number" placeholder="请输入昵称" placeholder-class="placeholder"></view>
        </mp-cell>
        <mp-cell title="邮箱：">
            <input name="email" class="login password" placeholder="请输入邮箱" placeholder-class="placeholder">
        </mp-cell>
        <mp-cell prop="vcode" title="验证码：" ext-class="weui-cell_vcode">
            <input name="captcha" :value="captchaCode" data-field="vcode" class="weui-input" placeholder="请输入验证码" placeholder-class="placeholder">
            <image @tap="refreshCaptcha" slot="footer" class="weui-vcode-img" :src="captchaImg" style="width: 108px"></image>
        </mp-cell>
    </mp-cells>
    <view class="syncTime">数据同步时间：{{syncTime}}</view>
    <view class="result">{{result}}</view>
    <view class="weui-btn-area">
        <button class="weui-btn" type="primary" form-type="submit">登录</button>
        <button style="margin-top: 12px" form-type="reset">重置</button>
    </view>
</form>
</template>

<script>
// pages/computerCenter/officeGrade/query.js
import { getOfficePrepare, getOfficeCaptcha, officeQuery } from './api';
const app = getApp();
let office;
class OFFICE {
  constructor(api) {
    this.API = api;
  }

  prepareQuery() {
    return getOfficePrepare();
  }

  getCaptcha(cookie, codeKey) {
    console.log(cookie, codeKey);
    return getOfficeCaptcha({
      cookie: cookie,
      codeKey: codeKey
    });
  }

  query(e) {
    return officeQuery(e);
  }

}
import mpCells from "../../miniprogram_npm/weui-miniprogram/cells/cells";
import mpCell from "../../miniprogram_npm/weui-miniprogram/cell/cell";

export default {
  data() {
    return {
      captchaImg: '',
      cookie: '',
      codeKey: '',
      cookie: cookie,
      codeKey: codeKey,
      captchaCode: "",
      syncTime: "",
      result: ""
    };
  },

  components: {
    mpCells,
    mpCell
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refreshPage3389(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
    console.log('下拉');
    this.refreshPage3389({});
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
    refreshCaptcha: function () {
      office.getCaptcha(this.cookie, this.codeKey).then(res => {
        const resp = res.data;
        this.setData({
          captchaImg: resp.data.base64img,
          captchaCode: resp.data.imgCode
        });
      });
    },
    formSubmit: function (e) {
      let data = e.detail.value;
      data.codeKey = this.codeKey;
      data.cookie = this.cookie;
      console.log(data);
      office.query(data).then(res => {
        const resp = res.data;
        this.setData({
          result: resp.data.result
        });
        this.refreshCaptcha();
      });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    refreshPage3389: function (options) {
      office = new OFFICE(app.globalData.API_DOMAIN);
      office.prepareQuery().then(res => {
        const resp = res.data;
        this.cookie = resp.data.cookie;
        this.codeKey = resp.data.codeKey;
        this.setData({
          syncTime: resp.data.syncTime
        });
        office.getCaptcha(this.cookie, this.codeKey).then(res => {
          const resp = res.data;
          this.setData({
            captchaImg: resp.data.base64img,
            captchaCode: resp.data.imgCode
          });
        });
      });
    }
  }
};
</script>
<style>
/* pages/computerCenter/officeGrade/query.wxss */
@import "../common.css";

.result{
    color:red
}
.syncTime{
    color:#0000FF;
}
</style>