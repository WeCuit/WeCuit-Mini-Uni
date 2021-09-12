<template>
<view>
<view class="page" :style="(cdnSign?('background: url('+imgCDN+images+'?token='+cdnToken+'&sign='+cdnSign +');'):'') + ' background-size: 100% 100%;'">
  <view class="button_container">
    <navigator class="button" url="map/details">
      <text>{{shortName}}简介</text>
    </navigator>
    <navigator class="button" url="map/index">
      <text>逛逛{{shortName}}</text>
    </navigator>
  </view>
  <view class="copyright">
    <text>© 成信大</text>
    <text>{{mapCopyright?"数据版权："+mapCopyright.name:""}}</text>
  </view>
</view>
<!-- 回首页按钮悬浮按钮 -->
<view v-if="fromShare">
  <navigator url="/pages/index/index" open-type="reLaunch" class="floatBtn" style="bottom: 5%;font-size: x-large;"><view class="iconfont icon-shouye"></view></navigator>
</view>
</view>
</template>

<script>
//获取应用实例
const app = getApp();
const config = require("../../config.js");
const school = require("../../resources/school.js");
const CDN = require("../../../components/cdn.js").UPYUN;

export default {
  data() {
    return {
      // app.js
      debug: config.debug,
      //开启后只调用本地数据
      imgCDN: config.imgCDN,
      globalData: {
        userInfo: null,
        map: null,
        introduce: null,
        latitude: null,
        longitude: null
      },
      // app.introduce.images
      images: school.introduce.images,
      // app.introduce.shortName
      shortName: school.introduce.shortName,
      // app.introduce.mapCopyright
      mapCopyright: school.introduce.mapCopyright,
      // app.imgCDN
      imgCDN: config.imgCDN,
      cdnToken: '',
      cdnEtime: 0,
      cdnSign: null,
      fromShare: false
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    CDN.getCdnToken(this, app); // app.js

    app.globalData.imgCDN = config.imgCDN;
    this.subPackageInit();
    uni.setNavigationBarTitle({
      title: app.globalData.introduce.name
    });
  },
  onShow: function () {
    if ("undefined" !== typeof qq && 1 === getCurrentPages().length) {
      this.setData({
        fromShare: true
      });
    }
  },

  /**
   * 分享至微信朋友圈
   */
  onShareTimeline: function (e) {
    // console.log(e)
    return {
      title: app.globalData.introduce.name + " - 校园导览",
      query: ""
    };
  },
  onShareAppMessage: function (res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }

    return {
      title: app.globalData.introduce.name + " - 校园导览",
      path: "/map/pages/index",
      imageUrl: app.globalData.imgCDN + app.globalData.introduce.share,
      success: function (res) {// 转发成功
      },
      fail: function (res) {// 转发失败
      }
    };
  },
  methods: {
    // 分包初始化数据处理
    subPackageInit: function () {
      var _this = this; //载入学校位置数据


      _this.loadSchoolConf(); //如果已经授权，提前获取定位信息


      uni.getSetting({
        success(res) {
          if (res.authSetting["scope.userLocation"]) {
            //获取地理位置
            uni.getLocation({
              type: "wgs84",
              // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
              success: function (res) {
                app.globalData.latitude = res.latitude;
                app.globalData.longitude = res.longitude;
                app.globalData.islocation = true;
              }
            });
          }
        }

      });
    },
    loadNetWorkScoolConf: function () {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (!_this.debug) {
          // 优先读取缓存信息
          var map = uni.getStorageSync("map");
          var introduce = uni.getStorageSync("introduce");

          if (map && introduce) {
            app.globalData.map = map;
            app.globalData.introduce = introduce;
          } // 再加载网络数据


          uni.request({
            url: config.updateUrl,
            header: {
              "content-type": "application/json"
            },
            success: function (res) {
              if (res.data.map && res.data.map.length > 0) {
                //刷新数据
                app.globalData.map = res.data.map;
                app.globalData.introduce = res.data.introduce;
                app.globalData.imgCDN = res.data.imgCDN; // 存储学校位置数据于缓存中

                uni.setStorage({
                  key: "map",
                  data: res.data.map
                });
                uni.setStorage({
                  key: "introduce",
                  data: res.data.introduce
                });
              }
            },
            complete: function (info) {
              resolve();
            },
            fail: err => {
              console.log(err);
            }
          });
        } else {
          resolve();
        }
      });
    },
    loadSchoolConf: function () {
      var _this = this; // 载入本地数据


      app.globalData.map = school.map;
      app.globalData.introduce = school.introduce;

      _this.loadNetWorkScoolConf().then(function () {
        // 渲染id
        for (let i = 0; i < app.globalData.map.length; i++) {
          for (let b = 0; b < app.globalData.map[i].data.length; b++) {
            app.globalData.map[i].data[b].id = b + 1;
          }
        }

        _this.setData({
          images: app.globalData.introduce.images,
          shortName: app.globalData.introduce.shortName,
          mapCopyright: app.globalData.introduce.mapCopyright
        });
      });
    }
  }
};
</script>
<style>
.page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: white;
}

.button_container {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 120px;
  justify-content: center;
}

.button {
  width: 145rpx;
  height: 145rpx;
  margin: 20px;
  background-color: rgba(255, 224, 115, 0.9);
  border-radius: 80rpx;
  display: flex;
  justify-content: center;
}

.button text {
  width: 55%;
  align-self: center;
  text-align: center;
}

.copyright {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: center;
  height: 55vh;
  font-size: 27rpx;
  text-align: center;
  line-height: 150%;
  text-shadow:#000 1rpx 0 0,#000 0 1rpx 0,#000 -1rpx 0 0,#000 0 -1rpx 0;
}

</style>