<template>
<!--pages/map/map.wxml-->
<view style="width: 100%;">
  <scroll-view scroll-x="true">
    <view class="top-swich" :style="'width:' + (buildlData.length * 120 < windowWidth ? windowWidth: buildlData.length * 120) + 'rpx;'" v-if="!fullscreen">
      <label v-for="(item, index) in buildlData" :key="index" :id="index" @tap="changePage" :class="'top-swich-btn ' + (isSelectedBuildType == index ? 'active' : '')">{{item.name}}
      </label>
    </view>
  </scroll-view>
  <map :longitude="longitude" :latitude="latitude" :scale="buildlData[isSelectedBuildType].scale" :markers="buildlData[isSelectedBuildType].data" @markertap="markertap" @regionchange="regionchange" :include-points="buildlData[isSelectedBuildType].data" :show-location="islocation? 'true': 'false'" enable-overlooking="true" enable-traffic="true" enable-3D="true" :style="'width: auto; height:' + (fullscreen ? 94 : 48) + 'vh;'">
    <cover-view :class="'controls ' + (fullscreen ? 'full' : '')">
      <cover-view @tap="navigateSearch">
        <cover-image class="img" src="../../../img/search.png"></cover-image>
      </cover-view>
      <cover-view @tap="location">
        <cover-image class="img" src="../../../img/location.png"></cover-image>
      </cover-view>
    </cover-view>
  </map>
  <button @tap="clickButton">
    共有{{buildlData[isSelectedBuildType].data.length}}个景观 ◕‿◕
  </button>
  <scroll-view scroll-y="true" :style="'height:' + (fullscreen ? 0 : 40) + 'vh'" :scroll-top="(isSelectedBuild -1 ) * 70">
    <view v-for="(item, index) in buildlData[isSelectedBuildType].data" :key="index" class="building-item" :style="isSelectedBuild -1 == index ? 'background-color: #d5d5d5;' : ''">
      <view class="img-view">
        <navigator class="img" :url="'details?tid=' + isSelectedBuildType + '&bid=' + index">
          <image :src="(imgCDN + item.img[0] + '!wecuit.map.item?') + '&token=' + cdnToken + '&sign=' + cdnSign" mode="aspectFill"> </image>
          <view class="item">
            <view class="itemName">
              {{item.name}}
            </view>
            <view class="itemFloor" v-if="item.floor">
              位置：{{item.floor}}
            </view>
          </view>
        </navigator>
        <navigator class="text" :url="'polyline?latitude=' + item.latitude + '&longitude=' + item.longitude">
          <image src="../../../img/location.svg"> </image>
        </navigator>
      </view>
    </view>
  </scroll-view>
</view>
</template>

<script>
//获取应用实例
var app = getApp();
const CDN = require("../../../../components/cdn.js").UPYUN;

export default {
  data() {
    return {
      fullscreen: false,
      latitude: 30.581442,
      longitude: 103.989211,
      buildlData: app.globalData.map,
      windowHeight: "",
      windowWidth: "",
      isSelectedBuild: 0,
      isSelectedBuildType: 0,
      imgCDN: null,
      islocation: true
    };
  },

  components: {},
  props: {},
  onLoad: function () {
    CDN.getCdnToken(this, app);
    uni.showShareMenu({
      withShareTicket: true
    });

    var _this = this;

    uni.getSystemInfo({
      success: function (res) {
        //获取当前设备宽度与高度，用于定位控键的位置
        _this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        });
      }
    }); //载入更新后的数据

    this.setData({
      imgCDN: app.globalData.imgCDN,
      buildlData: app.globalData.map
    });
  },
  onShow: function () {
    CDN.getCdnToken(this, app);
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }

    return {
      title: app.globalData.introduce.name + ' - 校园导览',
      path: '/pages/map/index',
      success: function (res) {// 转发成功
      },
      fail: function (res) {// 转发失败
      }
    };
  },
  methods: {
    regionchange(e) {// 视野变化
      // console.log(e.type)
    },

    markertap(e) {
      // 选中 其对应的框
      this.setData({
        isSelectedBuild: e.markerId
      }); // console.log("e.markerId", e.markerId)
    },

    navigateSearch() {
      uni.navigateTo({
        url: 'search'
      });
    },

    location: function () {
      var _this = this;

      uni.getLocation({
        type: 'gcj02',
        // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
        success: function (res) {
          app.globalData.latitude = res.latitude;
          app.globalData.longitude = res.longitude;

          _this.setData({
            longitude: res.longitude,
            latitude: res.latitude
          });
        }
      });
    },
    clickButton: function (e) {
      //console.log(this.data.fullscreen)
      //打印所有关于点击对象的信息
      this.setData({
        fullscreen: !this.fullscreen
      });
    },
    changePage: function (event) {
      this.setData({
        isSelectedBuildType: event.currentTarget.id,
        isSelectedBuild: 0
      });
    }
  }
};
</script>
<style>
/* pages/map/map.wxss */

.building-item {
  height: 50px;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px;
}

.top-swich {
  background-color: #079df2;
  height: 6vh;
  color: white;
  display: flex;
  justify-content: space-around;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

.top-swich-btn {
  background-color: none;
  letter-spacing: 3rpx;
  height: 65rpx;
  color: #fff;
  font-size: 30rpx;
}

.active {
  border-bottom: solid white;
  height: 50rpx;
  display: inline-block;
}

button {
  font-size: 26rpx;
  height: 6vh;
}

.img-view {
  height: 100%;
  display: flex;
}

.img {
  width: 85%;
  height: 100%;
  display: flex;
}

.img image {
  width: 60px;
  height: 90%;
  margin: auto 7rpx;
}

.item {
  display: flex;
  flex-direction: column;
  margin: auto 0;
}

.itemName {
  margin: 0 20rpx;
  font-size: 32rpx;
}

.itemFloor {
  margin: 0 20rpx;
  font-size: 28rpx;
  color: #555;
}

.text {
  margin: auto 15px;
  width: 13%;
}

.text image {
  width: 70rpx;
  height: 70rpx;
}

.controls {
  position: relative;
  top: 65%;
  left: 85%;
  /* display: flex; */
}

.controls .img {
  margin-top: 5px;
  width: 80rpx;
  height: 80rpx;
}

.full {
  top: 82%;
}

</style>