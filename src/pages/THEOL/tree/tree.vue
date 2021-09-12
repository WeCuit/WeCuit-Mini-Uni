<template>
<view>
  <mytree :model="treeData" @tapitem="tapDirItem"></mytree>
</view>
</template>

<script>
// pages/THEOL/dir/dir.js
const app = getApp();
import mytree from "../../../components/mytree/mytree";
import mpLoading from "../../../miniprogram_npm/weui-miniprogram/loading/loading";

export default {
  data() {
    return {
      treeData: {
        text: '列表加载中~',
        id: 0
      },
      lid: ''
    };
  },

  components: {
    mytree,
    mpLoading
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.courseId = options.courseId;
    console.log(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.onPullDownRefresh();
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
    this.getDirTree(this.courseId);
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
    tapDirItem: function (e) {
      console.log(e);
      uni.navigateTo({
        url: '../dir/dir?lid=' + this.courseId + '&folderId=' + e.detail.itemid
      });
    },
    getDirTree: function (lid) {
      uni.request({
        url: app.globalData.API_DOMAIN + '/Theol/dirTree?lid=' + lid,
        success: res => {
          var data = res.data;

          if (2000 == data.status) {
            this.setData({
              treeData: data.dir
            });
          } else {
            uni.showToast({
              icon: 'none',
              title: data.errMsg
            });
          }
        },
        fail: err => {
          uni.showToast({
            icon: 'none',
            title: '请求失败'
          });
          reject(err);
        }
      });
    }
  }
};
</script>
<style>
/* pages/THEOL/dir/dir.wxss */
@import "../../common.css";

</style>