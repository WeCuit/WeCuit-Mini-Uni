<template>
<view>
<!--index.wxml-->

<view class="search">
  <view class="search-icon">
    <icon type="search" size="16" color="blue"></icon>
  </view>
  <view class="search-form">
    <form>
      <input @input="bindSearchInput" type="text" name="search" placeholder="请输入景点名称关键词" :value="keyword" style="font-size: 30rpx;">
    </form>
  </view>
  <view class="search-icon" @tap="reset">
    <icon type="cancel" size="16" color="purple"></icon>
  </view>
</view>

<view v-for="(item, index) in showData" :key="index" class="building-item">

  <view style="height:100%; display: flex;">
    <navigator class="img" :url="'details?tid=' + item.tid + '&bid=' + item.bid">
      <image :src="imgCDN + '' + item.img[0]" mode="aspectFill"> </image>
      <view class="item">
        <view class="itemName">
          {{item.name}}
        </view>
        <view class="itemFloor" v-if="item.floor">
          {{item.floor}}
        </view>
      </view>
    </navigator>
    <navigator class="text" :url="'polyline?latitude=' + item.latitude + '&longitude=' + item.longitude">
      <image src="../../img/location.svg"> </image>
    </navigator>
  </view>
</view>
</view>
</template>

<script>
// pages/map/search.js
//获取应用实例
var app = getApp();

export default {
  data() {
    return {
      keyword: null,
      buildlData: [],
      showData: null,
      cursor: 0,
      imgCDN: null
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.buildlData = app.globalData.map;
    this.setData({
      imgCDN: app.globalData.imgCDN
    });
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
    bindSearchInput: function (e) {
      let showData = new Array();
      let searchdata = this.buildlData;

      if (e.detail.cursor >= this.cursor) {
        //输入文字
        let inputData = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");

        if (inputData) {
          let z = 0,
              x = 100;

          for (var b in searchdata) {
            for (var i in searchdata[b].data) {
              if (searchdata[b].data[i].name.indexOf(inputData) != -1 || searchdata[b].data[i].floor && searchdata[b].data[i].floor.indexOf(inputData) != -1) {
                let build = searchdata[b].data[i];
                build.tid = b;
                build.bid = i;
                z = z + 1;
                build.index = z;
                showData.push(build);
              } else if (searchdata[b].data[i].description.indexOf(inputData) != -1) {
                let build = searchdata[b].data[i];
                build.tid = b;
                build.bid = i;
                x = x + 1;
                build.index = x;
                showData.push(build);
              }
            }
          } //冒泡排序


          for (var i = 0; i < showData.length; i++) {
            for (var j = 0; j < showData.length - i - 1; j++) {
              if (showData[j].index > showData[j + 1].index) {
                var temp = showData[j];
                showData[j] = showData[j + 1];
                showData[j + 1] = temp; // console.log('交换' + showData[j].index + ':' + showData[j + 1].index)
              }
            }
          }

          if (inputData == 'gxgk') {
            showData.push({
              name: "莞香广科"
            });
          }

          this.setData({
            showData: showData
          });
        }
      } else {
        //删除文字
        console.log('删除文字');
        this.setData({
          showData: null
        });
      }

      this.cursor = e.detail.cursor;
    },
    reset: function () {
      this.setData({
        keyword: null
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

.search {
  width: 96%;
  height: 80rpx;
  background-color: #f5f5f5;
  border-radius: 15px;
  margin: 20rpx 2%;
  display: flex;
}
.search-icon{
  margin:auto 20rpx;
}
.search-form{
  margin:auto 15rpx; width: 100%;
}
</style>