<template>
<!--pages/computerCenter/index.wxml-->

<view>
    <view class="grid-item-container">
        <block v-for="(item, j) in menuList" :key="j">
          <view class="grid-item-child">
            <view :data-data="item.data" :data-needlogin="item.needLogin" @tap="bindAction">
              <!-- <icon class='grid-item-icon' type='{{item.type}}' size='{{item.size}}' color='{{item.color}}'/> -->
              <view :class="'grid-item-icon iconfont ' + item.icon" :style="'color:' + item.color"></view>
              <text class="grid-item-label">{{item.text}}</text>
            </view>
          </view>
        </block>
    </view>
</view>
</template>

<script>
// pages/computerCenter/index.js
const app = getApp();

export default {
  data() {
    return {
      menuList: [{
        data: "introduce",
        size: 30,
        color: "#03a9f4",
        icon: "icon-jianjie",
        text: "学院简介"
      }, {
        data: "newsList",
        size: 30,
        color: "#03a9f4",
        icon: "icon-zixun",
        text: "学院资讯"
      }, {
        data: "counselor",
        size: 30,
        color: "#03a9f4",
        icon: "icon-fudaoyuanxinxi",
        text: "辅导员"
      }, {
        data: "contact",
        size: 30,
        color: "#03a9f4",
        icon: "icon-zixun",
        text: "联系信息"
      }],
      college: "",
      collegeName: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.college = options.college;
    this.collegeName = options.name;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    uni.setNavigationBarTitle({
      title: this.collegeName
    });
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
    newsAction: function (e) {
      var data = e.currentTarget.dataset;
      uni.navigateTo({
        url: data.data + this.college,
        fail: function (res) {
          console.log(res);
          uni.showToast({
            title: "该功能暂未开发",
            icon: "none"
          });
        }
      });
    },
    bindAction: function (e) {
      var data = e.currentTarget.dataset;

      switch (data.data) {
        case 'introduce':
          var url = '/pages/articleView/articleView?link=' + app.globalData.API_DOMAIN + '/College/introduce/college/' + this.college;
          break;

        case 'newsList':
          var url = '/pages/newsList/newsList?source=' + this.college;
          break;

        case 'counselor':
          var url = 'counselor/counselor?college=' + this.college;
          break;

        case 'contact':
          var url = '/pages/articleView/articleView?link=' + app.globalData.API_DOMAIN + '/College/contact/college/' + this.college;
          break;

        default:
          uni.showToast({
            title: "未知操作",
            icon: "none"
          });
          return;
      }

      uni.navigateTo({
        url: url,
        fail: function (res) {
          console.log(res);
          uni.showToast({
            title: "该功能暂未开发",
            icon: "none"
          });
        }
      });
    },

    item() {
      console.log("占位：函数 item 未声明");
    }

  }
};
</script>
<style>
/* pages/computerCenter/index.wxss */
@import "./iconfont.css";
/*
  九宫格容器布局样式
 */
 .grid-item-container {
    display: -webkit-flex;
    display: flex;
    /* align-items: center; */
    justify-content: space-between;
    flex-wrap: wrap;
    /* border-top: 1rpx solid #D9D9D9; */
    /* box-shadow: 0px 0px 20px 2px #b4b4b4; */
    margin: 0.5rem;
    border-radius: 0.5rem;
  }
  
  /*
    item容器样式
  */
  .grid-item-child {
    display:flex;
    display: -webkit-flex;
    justify-content:center;
    flex-direction: column;
    flex-wrap: wrap;
    float: left;
    width: 33.3%;
    /* height: 200rpx; */
    box-sizing: border-box;
    /* background-color: #FFFFFF; */
    /* border-right: 1rpx solid #D9D9D9;
    border-bottom: 1rpx solid #D9D9D9; */
  }
  
  /*
    icon样式
  */
  .grid-item-icon {
    display:flex;
    display: -webkit-flex;
    justify-content:center;
    font-size: 90rpx;
  }
  
  /*
   文本样式
  */
  .grid-item-label {
    display:flex;
    display: -webkit-flex;
    justify-content:center;
    color: #666;
    font-size: 30rpx;
  }
  
</style>