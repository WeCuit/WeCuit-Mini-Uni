<template>
  <view>
    <!--pages/THEOL/dir/dir.wxml-->

    <mp-cells title="目录" v-if="dir.folder">
      <mp-cell
        v-for="(item, index) in dir.folder"
        :key="index"
        ext-class="my-cell"
        :id="item.id"
        :data-courseId="item.courseId"
        @tap="bindViewDir"
      >
        <view>{{item.text}}</view>
        <view class="footer" slot="footer">{{item.type}}</view>
      </mp-cell>
    </mp-cells>

    <view v-if="dir.file" class="tip">文件</view>
    <view
      v-for="(item, index) in dir.file"
      :key="index"
      class="exam-card"
      :data-suffix="item.suffix"
      :data-fileid="item.id"
      :data-resid="item.resId"
      @tap="downloadFile"
    >
      <view class="exam-title">文件名：{{item.text}}</view>
      <!-- 细节 -->
      <view class="exam-info">
        <view>访问次数：{{item.view}}</view>
        <view>下载次数：{{item.download}}</view>
      </view>
    </view>

    <text v-if="dir.length==0">无目录或文件</text>
  </view>
</template>

<script>
// pages/THEOL/dir/dir.js
const app = getApp();
import mpCell from "../../../miniprogram_npm/weui-miniprogram/cell/cell";
import mpCells from "../../../miniprogram_npm/weui-miniprogram/cells/cells";

export default {
  data() {
    return {
      dir: ""
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
    console.log(options);
    this.lid = options.lid;
    this.folderId = options.folderId;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.onPullDownRefresh();
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
    this.folderList(this.lid, this.folderId);
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
    bindViewDir: function(e) {
      var folderId = e.currentTarget.id;
      uni.navigateTo({
        url: "../dir/dir?lid=" + this.lid + "&folderId=" + folderId
      });
    },
    downloadFile: function(e) {
      var data = e.currentTarget.dataset;
      var query =
        "fileId=" +
        data.fileid +
        "&resId=" +
        data.resid +
        "&lid=" +
        this.lid +
        "&cookie=" +
        app.globalData.sessionInfo.theolCookie;
      uni.showLoading({
        title: "正在尝试下载"
      });
      uni.downloadFile({
        url:
          app.globalData.API_DOMAIN +
          "/Theol/downloadFile/1." +
          data.suffix +
          "?" +
          query,
        success: res => {
          uni.hideLoading();
          uni.openDocument({
            filePath: res.tempFilePath
          });
        },
        fail: err => {
          uni.hideLoading();
        }
      });
    },
    folderList: function(lid, folderId) {
      uni.request({
        url: app.globalData.API_DOMAIN + "/Theol/folderList",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          lid: lid,
          folderId: folderId,
          theolCookie: app.globalData.sessionInfo.theolCookie
        },
        success: res => {
          var data = res.data;

          if (2000 === data.status) {
            this.setData({
              dir: data.dir
            });
          }
        },
        fail: err => {
          uni.showToast({
            icon: "none",
            title: "请求失败"
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
.exam-card {
  border-radius: 10px;
  background-color: #00c4ff;
  margin: 0.5rem;
}
.exam-title {
  padding: 5px;
  padding-left: 10px;
  border-bottom: 1px solid #a058ff;
}
.exam-info {
  display: flex;
  flex-wrap: wrap;
  font-size: small;
  padding-left: 10px;
}
.exam-info > view {
  width: 47%;
  padding: 3px;
}

.tip {
  margin-top: 40rpx;
  padding: 24rpx;
  border-bottom: solid 2rpx #dac1c1;
  color: gray;
}
</style>