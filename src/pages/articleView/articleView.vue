<template>
<view>
<!-- pages/articleView/articleView.wxml -->
<htmlParser :content="htmlText" @linktap="bindLinkHandle" domain="https://www.cuit.edu.cn/">
  内容加载中......
</htmlParser>
<!-- 验证码提示框 -->
<view class="container" :hidden="captchaHidden">
  <view class="float">
    <view class="floatContent">
      <view class="floatText">
        <image @tap="refreshCaptcha" :src="captchaImg" style="height:50px;width:100px"></image>
        <input @input="bindInputYZM" type="text" placeholder="验证码">
        <button @tap="downByYZM" type="primary">下载</button>
        <button @tap="downCancel">取消</button>
      </view>
    </view>
  </view>
</view>
<!-- 下载进度提示框 -->
<view class="container" :hidden="downloadHidden">
  <view class="float">
    <view class="floatContent">
      <view class="floatText">
        <view style="white-space:pre-wrap;text-align:center;">{{progress}}</view>
        <button type="primary" @tap="downloadCancel">取消</button>
      </view>
    </view>
  </view>
</view>
<!-- 回首页按钮悬浮按钮 -->
<view v-if="fromShare">
  <navigator url="/pages/index/index" open-type="reLaunch" class="floatBtn" style="bottom: 5%;font-size: x-large;"><view class="iconfont icon-shouye"></view></navigator>
</view>
<view v-if="!isADClose" style="margin-top:4rem">
  <ad unit-id="a787d6d9637a2c0c6c69d927e301c9d2" type="card"></ad>
</view>
</view>
</template>

<script>
// pages/articleView/articleView.js
import { downFilePrepare } from './api';
const app = getApp();
var downloadTask = null;
import htmlParser from "mp-html/dist/uni-app/components/mp-html/mp-html";

export default {
  data() {
    return {
      htmlText: "少女祈祷中~",
      source: '',
      domain: '',
      path: '',
      link: '',
      title: '',
      captchaHidden: true,
      downloadHidden: true,
      captchaImg: '',
      cookie: '',
      fromShare: false,
      isADClose: false,
      progress: ""
    };
  },

  components: {
    htmlParser
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * @source
     * @domain
     * @path
     * 
     * @link
     * 
     */
    this.setData({
      isADClose: app.globalData.isADClose
    });

    if ("undefined" !== typeof options.link) {
      this.source = 'html';
      this.link = options.link;
      this.loadLink(options.link);
      return;
    }

    this.source = options.source;
    this.domain = options.domain;
    this.path = -1 != options.path.indexOf('?') ? encodeURIComponent(options.path) : options.path;
    if (0 === this.path.indexOf('/')) this.link = 'http://' + this.domain + this.path;else this.link = 'http://' + this.domain + '/' + this.path;
    this.loadContent(this.path, this.source);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    uni.showShareMenu({
      withShareTicket: true,
      // for wx
      menus: ['shareAppMessage', 'shareTimeline'],
      // for qq
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		// #ifdef MP-QQ
    if (1 === getCurrentPages().length) {
      this.fromShare = true
    }
		// #endif
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
  onPullDownRefresh: function () {
    this.loadContent(this.link, this.source);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 分享至微信朋友圈
   */
  onShareTimeline: function (e) {
    
    return {
      title: this.title,
      query: 'source=' + this.source + '&path=' + this.path + '&domain=' + this.domain
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.title,
      // for wechat
      path: '/pages/articleView/articleView?source=' + this.source + '&path=' + this.path + '&domain=' + this.domain,
      // for qq
      query: 'source=' + this.source + '&path=' + this.path + '&domain=' + this.domain
    };
  },
  methods: {
    loadContent: function (data, source) {
      switch (source) {
        case 'html':
          this.loadLink(data);
          break;

        default:
          var url = app.globalData.API_DOMAIN + '/News/getContent?link=' + this.link;
          this.loadLink(url);
          break;
      }
    },

    /**
     * 加载普通html页面
     * @param {*} link 
     */
    loadLink: function (url) {
      uni.request({
        url: url,
        dataType: 'String',
        success: res => {
          this.setData({
            htmlText: res.data
          });
          var title = res.data.match(/<title>(.*?)<\/title>/i);
          if (title) this.title = title[1];
        },
        complete: res => {
          uni.stopPullDownRefresh();
        }
      });
    },
    // html链接处理
    bindLinkHandle: function (e) {
      
			const href = e.href
      if (-1 != href.search(/.pdf|.docx|.doc|.xlsx|.xls|.zip|.rar/i)) {
        // 带有指定后缀，此类链接不进行自动跳转/复制操作
        uni.showToast({
          icon: 'loading',
          title: '正在下载文件'
        });
        if (0 != href.indexOf('http') && 0 != href.indexOf('/')) href = '/' + href;
        let type = href.substr(href.lastIndexOf('.') + 1);
        uni.downloadFile({
          url: app.globalData.API_DOMAIN + '/File/transferV2/type.' + type + '?link=' + encodeURIComponent(href) + '&page=' + this.link,
          success: function (res) {
            if (200 != res.statusCode) {
              uni.showToast({
                icon: 'none',
                title: parseInt(res.statusCode).toString()
              });
              return;
            }

            uni.showToast({
              icon: 'success',
              title: '正在打开文件'
            });
            const filePath = res.tempFilePath;
            uni.openDocument({
              filePath: filePath,
              showMenu: true,
              fail: function (err) {
                console.log(err);
                uni.showToast({
                  icon: 'none',
                  title: '打开失败'
                });
              }
            });
          },

          fail(err) {
            uni.showToast({
              icon: 'none',
              title: err.error
            });
          }

        });
      } else if (-1 != href.search(/system\/_content\/download.jsp/i)) {
        // 此类链接不进行自动跳转/复制
        this.downLink = href;
        this.checkDownLink(href, '');
      }
    },
    checkDownLink: function (link, codeValue) {
      uni.showLoading({
        title: '正在尝试下载'
      });
      downFilePrepare({
        cookie: this.cookie,
        downUrl: link,
        codeValue: codeValue,
        domain: this.domain
      }).then(res => {
        const resp = res.data;
        console.log("success", resp);
        const data = resp.data;
        uni.hideLoading(); // 需验证码

        if (data.captcha) {
          console.log('验证码');
          this.setData({
            captchaImg: 'data:image/png;base64,' + data.captcha,
            captchaHidden: false
          });
          this.cookie = data.cookie;
        } // 可下载
        else {
            if (!this.captchaHidden) this.setData({
              captchaHidden: true
            });
            this.downFile(data.link);
          }
      }).catch(err => {
        console.log("error", err);
        uni.hideLoading();
        uni.showToast({
          icon: 'none',
          title: err.errMsg
        });
      });
    },
    downFile: function (link) {
      uni.showLoading({
        title: '正在下载'
      });
      downloadTask = uni.downloadFile({
        url: link,
        success: res => {
          console.log(res);
          uni.showToast({
            icon: 'loading',
            title: '尝试打开'
          });
          uni.openDocument({
            filePath: res.tempFilePath
          });
        },
        fail: err => {
          console.log(err);
        },
        complete: res => {
          this.setData({
            downloadHidden: true
          });
          uni.hideLoading();
        }
      });
      downloadTask.onProgressUpdate(p => {
        uni.hideLoading(); // wx.showLoading({
        //   title: p.progress + "%\r\n" + parseInt(p.totalBytesWritten / 1024) + '/' + parseInt(p.totalBytesExpectedToWrite / 1024) + 'KB',
        // })
        // console.log("pls stop")

        this.setData({
          downloadHidden: false,
          progress: p.progress + '%\r\n' + parseInt(p.totalBytesWritten / 1024) + '/' + parseInt(p.totalBytesExpectedToWrite / 1024) + 'KB'
        });
      });
    },
    // 提交验证码下载
    downByYZM: function () {
      this.checkDownLink(this.downLink, this.codeValue);
    },
    // 取消下载
    downCancel: function () {
      this.setData({
        captchaHidden: true
      });
    },
    // 输入验证码
    bindInputYZM: function (e) {
      this.codeValue = e.detail.value;
    },
    // 刷新验证码
    refreshCaptcha: function () {},
    // 取消下载
    downloadCancel: function () {
      this.setData({
        downloadHidden: true
      });
      downloadTask.abort();
    }
  }
};
</script>
<style>
/* pages/articleView/articleView.wxss */
/* 验证码 */
.float {
  height: 100%;
  width: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  top: 0;/*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top));/*  #endif  */
  left: 0;
 }
  
 .floatContent {
  padding: 20rpx 0;
  width: 80%;
  background: #fff;
  margin: 40% auto;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: relative;
  height: 400rpx;
 }
  
 .floatText text {
  color: #000;
  font-size: 40rpx;
  display: block;
  text-align: center;
  line-height: 90rpx;
  border-radius: 30rpx;
  margin-right: 10rpx;
 }
  
 @import "./articleView-wxa-auto-dark.css";
</style>