<template>
<view>
<!--pages/computerCenter/index.wxml-->
<view class="title">龙泉校区</view>
<view>
    <view class="grid-item-container">
        <block v-for="(item, j) in menuList_lq" :key="j">
          <view class="grid-item-child">
            <view :data-path="item.path" :data-needlogin="item.needLogin" @tap="bindAction">
              <image v-if="item.img" class="grid-item-icon" :src="'../../static/img/' + item.img" :style="'height:' + item.size + 'vw;width:' + item.size + 'vw'"></image>
              <view v-else :class="'grid-item-icon iconfont ' + item.icon" :style="'color:' + item.color"></view>
              <text class="grid-item-label">{{item.text}}</text>
            </view>
          </view>
        </block>
    </view>
</view>


<view class="title">航空港校区</view>
<view>
   <view class="grid-item-container">
        <block v-for="(item, j) in menuList_hk" :key="j">
          <view class="grid-item-child">
            <view :data-path="item.path" :data-needlogin="item.needLogin" @tap="bindAction">
              <image v-if="item.img" class="grid-item-icon" :src="'../../static/img/' + item.img" :style="'height:' + item.size + 'vw;width:' + item.size + 'vw'"></image>
              <view v-else :class="'grid-item-icon iconfont ' + item.icon" :style="'color:' + item.color"></view>
              <text class="grid-item-label">{{item.text}}</text>
            </view>
          </view>
        </block>
    </view>
</view>
</view>
</template>

<script>

export default {
  data() {
    return {
      menuList_lq: [{
        path: "../menu/menu?college=gl&name=管理学院",
        size: 22,
        color: "rgb(0,255,255)",
        img: "gl.jpg",
        text: "管理学院"
      }, {
        path: "../menu/menu?college=tj&name=统计学院",
        size: 23,
        color: "rgb(0,255,255)",
        img: "tj.jpg",
        text: "统计学院"
      }, {
        path: "../menu/menu?college=whys&name=文化艺术",
        size: 25,
        color: "rgb(0,255,255)",
        img: "whys.jpg",
        text: "文化艺术"
      }, {
        path: "../menu/menu?college=wl&name=物流学院",
        size: 23,
        color: "rgb(0,255,255)",
        img: "wl.jpg",
        text: "物流学院"
      }],
      menuList_hk: [{
        path: "../menu/menu?college=dqkx&name=大气科学",
        size: 25,
        color: "rgb(0,255,255)",
        img: "dqkx.jpg",
        text: "大气科学"
      }, {
        path: "../menu/menu?college=dzgc&name=电子工程",
        size: 25,
        color: "rgb(0,255,255)",
        img: "dzgc.jpg",
        text: "电子工程"
      }, {
        path: "../menu/menu?college=gdgc&name=光电工程",
        size: 25,
        color: "rgb(0,255,255)",
        img: "gdgc.jpg",
        text: "光电工程"
      }, {
        path: "../menu/menu?college=compute&name=计算机",
        size: 24,
        color: "rgb(0,255,255)",
        img: "jsj.jpg",
        text: "计算机"
      }, {
        path: "../menu/menu?college=kzgc&name=控制工程",
        size: 25,
        color: "rgb(0,255,255)",
        img: "kzgc.jpg",
        text: "控制工程"
      }, {
        path: "../menu/menu?college=rjgc&name=软件工程",
        size: 25,
        color: "rgb(0,255,255)",
        img: "rjgc.jpg",
        text: "软件工程"
      }, {
        path: "../menu/menu?college=txgc&name=通信工程",
        size: 25,
        color: "rgb(0,255,255)",
        img: "txgc.jpg",
        text: "通信工程"
      }, {
        path: "../menu/menu?college=wgy&name=外国语",
        size: 23,
        color: "rgb(0,255,255)",
        img: "wgy.jpg",
        text: "外国语"
      }, {
        path: "../menu/menu?college=wlaq&name=网安",
        size: 23,
        color: "rgb(0,255,255)",
        img: "wlkjaq.jpg",
        text: "网安"
      }, {
        path: "../menu/menu?college=yysx&name=应用数学",
        size: 25,
        color: "rgb(0,255,255)",
        img: "yysx.jpg",
        text: "应用数学"
      }, {
        path: "../menu/menu?college=zyhj&name=资源环境",
        size: 25,
        color: "rgb(0,255,255)",
        img: "zyhj.jpg",
        text: "资源环境"
      }, {
        path: "../menu/menu?college=qkl&name=区块链",
        size: 25,
        color: "rgb(0,255,255)",
        img: "qkl.jpg",
        text: "区块链"
      } // {
      //     path: "../menu/menu?college=compute&name=",
      //     size: 25,
      //     color: "rgb(0,255,255)",
      //     icon: "icon-tongzhi",
      //     text: "马克思主义学院",
      // },
      ]
    };
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
  onReady: function () {
    uni.showShareMenu({
      withShareTicket: true,
      // for wx
      menus: ["shareAppMessage", "shareTimeline"],
      // for qq
      showShareItems: ["qq", "qzone", "wechatFriends", "wechatMoment"]
    });
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
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 分享至微信朋友圈
   */
  onShareTimeline: function (e) {
    
    return {
      title: '教学部门',
      query: ""
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '教学部门',
      // for wechat
      path: "/college/pages/list/list",
      // for qq
      query: ""
    };
  },
  methods: {
    bindAction: function (e) {
      var data = e.currentTarget.dataset;

      if (data.needlogin && !app.isUser) {
        uni.showToast({
          title: '需要登录',
          icon: "none"
        });
        return;
      }

      uni.navigateTo({
        url: data.path,
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

.title{
  text-align: center;
  margin: 35rpx;
  font-size: 30rpx;
}

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
  .grid-item-child > view{
    align-self: center;
  }
  /*
    icon样式
  */
  .grid-item-icon {
    display:flex;
    display: -webkit-flex;
    justify-content:center;
    font-size: 2.5rem;
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