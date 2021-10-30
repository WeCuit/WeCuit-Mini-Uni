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
import {getDirTree} from '../api.js'
import log from '../../../utils/log.js'

export default {
  data() {
    return {
      treeData: {
        text: "列表加载中~",
        id: 0
      },
      lid: ""
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
  onLoad: function(options) {
    this.courseId = options.courseId;
    console.log(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.loadDirTree(this.courseId);
  },

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
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.loadDirTree(this.courseId);
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
    tapDirItem: function(e) {
			log.info("tapDirItem")
      uni.navigateTo({
        url: "../dir/dir?lid=" + this.courseId + "&folderId=" + e.detail.itemid
      });
    },
    loadDirTree: function(lid) {
			getDirTree(lid).then(res=>{
				const resp = res.data
				this.treeData = resp.dir
			})
    }
  }
};
</script>
<style>
/* pages/THEOL/dir/dir.wxss */
@import "../../common.css";
</style>