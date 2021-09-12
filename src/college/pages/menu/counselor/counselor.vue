<template>
<!--college/pages/menu/counselor/counselor.wxml-->
<mp-cells title="辅导员">
    <mp-cell v-for="(item, index) in list" :key="index" ext-class="my-cell" :data-id="item.cid" @tap="bindViewCounselor">
      <view>{{item.name}}</view>
    </mp-cell>
</mp-cells>
</template>

<script>
// college/pages/menu/counselor/counselor.js
import { getCounselorList } from './api';
const app = getApp();
import mpCell from "../../../../miniprogram_npm/weui-miniprogram/cell/cell";
import mpCells from "../../../../miniprogram_npm/weui-miniprogram/cells/cells";

export default {
  data() {
    return {
      list: [],
      college: ''
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
  onLoad: function (options) {
    console.log('options', options);
    this.college = options.college;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getCounselorList(this.college);
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
    this.getCounselorList(this.college);
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
    /**
     * 拉取辅导员列表
     */
    getCounselorList: function (college) {
      getCounselorList(college).then(res => {
        const resp = res.data;
        const data = resp.data;
        this.setData({
          list: data.list
        });
      });
    },
    bindViewCounselor: function (e) {
      console.log(e);
      let data = e.currentTarget.dataset; // 无辅导员

      if ("false" === data.id) {
        uni.showToast({
          icon: "none",
          title: "无效操作！"
        });
      } else {
        let query = 'link=' + app.globalData.API_DOMAIN + '/college/getCounselorInfo/id/' + data.id;
        uni.navigateTo({
          url: '/pages/articleView/articleView?' + query
        });
      }
    }
  }
};
</script>
<style>
/* college/pages/menu/counselor/counselor.wxss */
@import "../../common.css";
</style>