<template>
<!--pages/map/details.wxml-->
<view>
  <swiper class="swiper" :indicator-dots="building.img.length == 1 ? false : true" indicator-active-color="#fff" autoplay="1" interval="3000" duration="500">
    <block v-for="(item, index) in building.img" :key="index">
      <swiper-item>
        <image class="swiper-image" v-if="cdnSign" :src="imgCDN + '' + (item  + '!wecuit.swiper?') + '&token=' + cdnToken + '&sign=' + cdnSign"> </image>
      </swiper-item>
    </block>
  </swiper>
  <view class="building">
    <view class="buildingName">{{building.name}}</view>
    <navigator class="nav_map" :url="'polyline?latitude=' + building.latitude + '&longitude=' + building.longitude">
      <image src="../../img/location.svg"> </image>
    </navigator>
  </view>

  <view class="descript">
    <view class="description">
      <rich-text :nodes="building.description"></rich-text>
    </view>
  </view>
</view>
</template>

<script>
// pages/map/details.js
const {
  imgCDN
} = require("../../../config.js");
const CDN = require("../../../../components/cdn.js").UPYUN; //获取应用实例
//获取应用实例
var app = getApp();

export default {
  data() {
    return {
      tid: 0,
      bid: 0,
      building: {
        img: [] //加载中图片地址

      },
      imgCDN: imgCDN,
      cdnToken: '',
      cdnSign: null,
      cdnEtime: 0
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    CDN.getCdnToken(this, app);
    var bid = parseInt(options.bid);
    var tid = parseInt(options.tid);

    if (!options.bid || !options.tid) {
      var data = app.globalData.introduce;
    } else {
      var data = app.globalData.map[tid].data[bid];
    }

    this.setData({
      bid: bid,
      tid: tid,
      building: data
    });
    uni.setNavigationBarTitle({
      title: data.name
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
    CDN.getCdnToken(this, app);
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
  onShareAppMessage: function (res) {
    var title, path;

    if (this.introduce) {
      title = app.globalData.introduce.name + '校园导览';
      path = "/pages/map/details";
    } else {
      title = this.building.name + ' - ' + app.globalData.introduce.name + '校园导览';
      path = "/pages/map/details?tid=" + this.tid + "&bid=" + this.bid;
    }

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }

    return {
      title: title,
      path: path,
      imageUrl: app.globalData.imgCDN + this.building.img[0],
      success: function (res) {// 转发成功
      },
      fail: function (res) {// 转发失败
      }
    };
  },
  methods: {}
};
</script>
<style>
/* pages/map/details.wxss */

.description {
  padding: 40rpx 40rpx;
  line-height: 30px;
  font-size: 30rpx;
}

.swiper {
  height: 40vh;
}

.swiper-image {
  width: 100%;
  height:100%;
}

.building {
  height: 10vh;
  display: flex;
  margin: auto 20rpx;
}

.buildingName {
  margin: auto 15rpx;
  width: 80%;
  color: #079df2;
  font-size: 50rpx;
  white-space:nowrap;
}

.nav_map {
  margin: auto 10rpx;
}

.nav_map image {
  width: 80rpx;
  height: 80rpx;
}

.descript {
  background: #f8f8f8;
  width: 100%;
  min-height: 49vh;
}

.descript rich-text {
  font-size: 30rpx;
  color: #000;
}

</style>