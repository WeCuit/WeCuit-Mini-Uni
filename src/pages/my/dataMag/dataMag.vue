<template>
<!--pages/my/dataMag/dataMag.wxml-->

<view class="setting">
	<label @tap="bindCleanCourse" class="label">
		<view class="subicon iconfont icon-qingchu" style="color:green"></view>
		<view>清除课表缓存</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</label>
	<label @tap="bindCleanAccount" class="label">
		<view class="subicon iconfont icon-qingchu" style="color:blue"></view>
		<view>清除账号数据</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</label>
	<label style="color:red" @tap="bindClearAll" class="label">
		<view class="subicon iconfont icon-qingchu"></view>
		<view>清除全部数据</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
    </label>
</view>
</template>

<script>
// pages/my/dataMag/dataMag.js
const app = getApp();

export default {
  data() {
    return {};
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
    showConfirm: function (text) {
      return new Promise((resolve, reject) => {
        uni.showModal({
          title: "Warning",
          content: text,
          confirmColor: "red",
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
    },
    bindCleanCourse: function () {
      this.showConfirm("是否清空本地课表数据？").then(() => {
        app.globalData.classtable = null;
        app.globalData.start = null;
        app.globalData.location = null;
        uni.removeStorageSync("classtable");
        uni.removeStorageSync("start");
        uni.removeStorageSync("location");
        uni.showToast({
          title: "清除完毕"
        });
      });
    },
    bindCleanAccount: function () {
      this.showConfirm("是否清空本地账号数据？").then(() => {
        app.globalData.sessionInfo.isRemPass = app.globalData.sessionInfo.userId = app.globalData.sessionInfo.userPass = null;
        uni.removeStorageSync("accountInfo");
        uni.showToast({
          title: "清除完毕"
        });
      });
    },
    bindClearAll: function () {
      this.showConfirm("是否清空本地所有数据？").then(() => {
        app.globalData.start = null, app.globalData.classtable = null, app.globalData.checkInList = null, app.globalData.isAutoLogin = false, app.globalData.location = null, (app.globalData.accountInfo = {
          isAdmin: app.globalData.accountInfo.isAdmin,
          userId: "",
          userPass: "",
          vpnPass: "",
          isRemPass: false,
          isAutoLogin: false
        }, app.globalData.sessionInfo = {
          JWGL_cookie: "",
          SSO_TGC: "",
          JSZX_cookie: ""
        });
        uni.clearStorage({
          success: option => {
            console.log(option);
            uni.showToast({
              title: "清除完毕"
            });
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