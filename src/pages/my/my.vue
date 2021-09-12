<template>
<view>
<navigator url="/pages/my/sso/sso" open-type="navigate" class="btnLoginJWC">统一登录中心</navigator>

<view class="setting">
	<label v-if="isQQ" class="label">
		<view class="subicon iconfont icon-wenti" style></view>
		<button class="buttonFix" plain="true" open-type="openGroupProfile" group-id="940309953" style>有问题加群：940309953</button>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</label>
	<label v-else @tap="bindGroup" class="label">
		<view class="subicon iconfont icon-wenti" style></view>
		<view>有问题加群</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</label>
	<label @tap="bindOpen" class="label">
		<view class="subicon iconfont icon-github"></view>
		<view>开源地址</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</label>
	<!-- <navigator url="/pages/my/sub/sub" class="label">
		<view class="subicon iconfont icon-dingyue"></view>
		<view>订阅管理</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</navigator> -->
	<label class="label">
		<view class="subicon iconfont icon-yijian" style="color:#1CBBB4"></view>
		<button class="buttonFix" plain="true" open-type="feedback">意见反馈</button>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</label>
	<label class="label">
		<view class="subicon iconfont icon-fenxiang" style="color:#1CBBB4"></view>
		<button class="buttonFix" plain="true" open-type="share">分享小程序</button>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</label>
	<navigator url="/pages/my/dataMag/dataMag" class="label">
		<view class="subicon iconfont icon-data"></view>
		<view>数据管理</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</navigator>
	<navigator v-if="isQQ" url="/pages/my/ADMag/ADMag" class="label">
		<view class="subicon iconfont icon-guanggao"></view>
		<view>广告管理</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</navigator>
	<label @tap="bindThanks" class="label">
		<view class="subicon iconfont icon-guanyu" style="color:orange"></view>
		<view @tap="bindThanks">关于</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</label>
	<label style="color:red" @tap="bindLogout" class="label">
		<view class="subicon iconfont icon-tuichu"></view>
		<view>退出登录</view>
		<view class="subicon-r iconfont icon-arr-right"></view>
	</label>
</view>

<!-- TabBar 占位 -->
<view style="height: 10vh;"></view>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      isQQ: false,
      selected: 0
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isQQ = false;
    if ("undefined" != typeof qq) isQQ = true;
    this.setData({
      isQQ: isQQ
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
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
  methods: {
    // 点击事件
    bindGroup: function () {
      uni.showModal({
        title: '将复制以下内容',
        content: app.globalData.config.group,

        success(res) {
          if (res.confirm) {
            uni.setClipboardData({
              data: app.globalData.config.group
            });
          } else if (res.cancel) {}
        }

      });
    },
    bindOpen: function () {
      uni.showModal({
        title: '将复制以下内容',
        content: app.globalData.config.github,

        success(res) {
          if (res.confirm) {
            uni.setClipboardData({
              data: app.globalData.config.github
            });
          } else if (res.cancel) {}
        }

      });
    },
    bindThanks: function () {
      uni.navigateTo({
        url: '/pages/articleView/articleView?link=' + app.globalData.API_DOMAIN + app.globalData.config['about-link']
      });
    },
    bindLogout: function () {
      uni.removeStorageSync('TWFID');
      uni.removeStorageSync('SSO_TGC');
      uni.removeStorageSync('JWGL_cookie');
      uni.removeStorageSync('SSO_TGC');
      uni.showToast({
        title: '登录凭据清除完毕'
      });
    }
  }
};
</script>
<style>
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