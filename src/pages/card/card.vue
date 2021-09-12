<template>
<view>
<!--pages/card/card.wxml-->
<view :style="'display:' + ((showQRCode || showPayRet)?'none':'block') + ';margin-bottom: 5rem;'">
    <view>
        <swiper style="height: 10rem;" :autoplay="true" duration="500">
            <block v-for="(item, index) in wallet" :key="index">
                <swiper-item>
                    <view class="wallet-card">
                        <text class="wallet-card-user">{{userName}}</text>
                        <text class="wallet-card-name">{{item.WalletName}}余额（元）</text>
                        <text class="wallet-card-count">{{item.MonDBCurr}}</text>
                    </view>
                </swiper-item>
            </block>
        </swiper>
    </view>
    <view class="actionList">
        <view v-for="(item, index) in actions" :key="index">
            <view @tap="item.action" :data-data="item.data">
                <view :class="'iconfont ' + item.font" style="font-size: 2rem;"></view>{{item.text}}
            </view>
        </view>
    </view>
    <view v-for="(item, index) in DealRec" :key="index">
        <mp-cells ext-class="my-cells" :title="item.Month">
            <mp-cell v-for="(item, index2) in item.PaymentRows" :key="index2" ext-class="my-cell">
                <view style="display: flex;">
                    <view style="border-right: 1px solid #ccc;padding: 17rpx;align-self: center;font-size: small;">{{item.Date}}</view>
                    <view style="padding: 17rpx;">
                        <view>{{item.FeeName}}</view>
                        <view style="font-size:small;color:gray;">{{item.Source}}</view>
                    </view>
                </view>
                <view slot="footer">
                    <view style="color:orange;">{{item.MonDeal>=0?'+'+item.MonDeal:item.MonDeal}}</view>
                    <view style="font-size:small;">{{item.Time}}</view>
                </view>
            </mp-cell>
        </mp-cells>
    </view>

    <!-- 二维码按钮 -->
    <!-- <view data-type="show" bind:tap="bindShowQRCode" style="display:flex;justify-content:center;">
        <view class="card-qrcode-btn">
            <view class="iconfont icon-qrcode" style="font-size:xx-large;"></view>
        </view>
    </view> -->
</view>

<!-- 二维码 -->
<view class="QRCode" :style="'display:' + (showQRCode?'block':'none') + ';'">
    <view class="QRContent">
        <view class="QRItem">二维码</view>
        <!-- <image src="{{qrCode?qrAPI + qrCode: ''}}" bind:tap="previewQRCode" bind:longpress="refreshQRCode" style="width:{{windowWidth * 0.9}}px;height:{{windowWidth * 0.9}}px"/> -->
        <canvas type="2d" style="width:90vw;height:90vh" id="payQrcode"></canvas>
        <view @tap="refreshQRCode" style="display: flex;"><view :class="'iconfont ' + refresh[refreshStatus].font" style="color:#2347bd;"></view>{{refresh[refreshStatus].text}}</view>
        <view class="QRItem">
            <button style="padding: 0.6rem;" @tap="bindShowQRCode">
                关闭
            </button>
        </view>
    </view>
</view>

<!-- 支付结果 -->
<view :style="'background: #fff;position: relative;height: 100vh;flex-direction: column;justify-content: center;display:' + (showPayRet?'flex':'none')">

    <!-- 成功 -->
    <block v-if="'1'==payRet.Recflag">
        <view style="text-align: center;color: #2347bd;">
            <view class="iconfont icon-success" style="font-size:4rem;"></view>
            <view>付款成功</view>
        </view>
        <view style="font-size: 3rem;text-align: center;">{{payRet.MonDealCur}}</view>
        <mp-cells>
            <mp-cell value="订单金额" :footer="payRet.MonDeal"></mp-cell>
            <mp-cell value="优惠" :footer="payRet.ConcessionsMon"></mp-cell>
            <mp-cell value="管理费" :footer="payRet.ConsumeMgFee"></mp-cell>
            <mp-cell value="商户名" :footer="payRet.DealerName"></mp-cell>
            <mp-cell value="消费时间" :footer="payRet.DealTime"></mp-cell>
        </mp-cells>
    </block>

    <!-- 失败 -->
    <block v-else>
        <view style="text-align: center;color: red;margin-bottom: 8rem;">
            <view class="iconfont icon-shibai" style="font-size:4rem;"></view>
            <view>交易失败</view>
            <view>{{payError}}</view>
        </view>
    </block>

    <view style="margin-top:1rem;">
        <button type="primary" @tap="bindShowPayRet">
            关闭
        </button>
    </view>
</view>
</view>
</template>

<script>
// pages/card/card.js
const app = getApp();
import Card from "../../utils/card";
import { yktLogin, getAccWallet, getDealRec } from './api';
const card = new Card.Card(app.globalData.API_DOMAIN);
import { drawById } from "../../utils/qrcode";
var qrCodeInfoInterval = null;
var _this = null;
import mpCell from "../../miniprogram_npm/weui-miniprogram/cell/cell";
import mpCells from "../../miniprogram_npm/weui-miniprogram/cells/cells";

export default {
  data() {
    return {
      userName: "姓名",
      CARD_AccNum: 0,
      wallet: [{
        WalletNum: "1",
        WalletName: "主钱包",
        MonDBCurr: "0.00",
        IsOpen: "0"
      }, {
        WalletNum: "9",
        WalletName: "库钱包1",
        MonDBCurr: "0.00",
        IsOpen: "0"
      }],
      actions: [{
        text: "充值",
        font: "icon-charge",
        action: "bindChargeAct",
        data: ""
      }],
      DealRec: [],
      showQRCode: false,
      qrAPI: app.globalData.API_DOMAIN + "/UTILS/genQRCode/?str=",
      qrCode: null,
      showPayRet: false,
      payRet: {},
      refresh: [{
        text: "点击刷新二维码",
        font: "icon-shuaxin"
      }, {
        text: "正在刷新二维码",
        font: "icon-shuaxin refresh"
      }, {
        text: "已刷新",
        font: "icon-success"
      }],
      refreshStatus: 0,
      screenBrightness: 0,
      windowWidth: app.globalData.windowWidth,
      firstSSOLogin: true,
      QRCode: {
        // 查询支付状态
        getInfo: function () {
          card.queryPayStatus(_this.QRCode).then(res => {
            if (2000 == res.data.status) {
              if ("1" == res.data.Recflag) {
                uni.showToast({
                  title: "支付成功"
                });
              } else if ("2" == res.data.Recflag) {
                uni.showToast({
                  icon: "none",
                  title: "交易失败"
                });
              } else if ("undefined" == typeof res.data.Recflag || "0" !== res.data.Recflag) {
                uni.showToast({
                  icon: "none",
                  title: "未知错误"
                });
                clearInterval(qrCodeInfoInterval);
                uni.setNavigationBarColor({
                  frontColor: "#000000",
                  backgroundColor: "#fff"
                });
                uni.setScreenBrightness({
                  value: _this.screenBrightness
                });
                uni.setNavigationBarTitle({
                  title: "支付结果"
                });

                _this.setData({
                  showQRCode: !_this.showQRCode,
                  showPayRet: true,
                  payError: JSON.stringify(res.data)
                });

                return;
              }

              if ("1" == res.data.Recflag) {
                clearInterval(qrCodeInfoInterval);
                qrCodeInfoInterval = null;
                res.data.MonDeal = res.data.MonDeal.toFixed(2);
                res.data.MonDealCur = res.data.MonDealCur.toFixed(2);
                res.data.ConcessionsMon = res.data.ConcessionsMon.toFixed(2);
                res.data.ConsumeMgFee = res.data.ConsumeMgFee.toFixed(2);
                uni.setNavigationBarColor({
                  frontColor: "#000000",
                  backgroundColor: "#fff"
                });
                uni.setScreenBrightness({
                  value: _this.screenBrightness
                });
                uni.setNavigationBarTitle({
                  title: "支付结果"
                });

                _this.setData({
                  showQRCode: !_this.showQRCode,
                  showPayRet: true,
                  payRet: res.data
                });
              }
            } else {
              uni.showToast({
                icon: "none",
                title: "未知错误"
              });
              clearInterval(qrCodeInfoInterval);
              uni.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "#fff"
              });
              uni.setScreenBrightness({
                value: _this.screenBrightness
              });
              uni.setNavigationBarTitle({
                title: "支付结果"
              });

              _this.setData({
                showQRCode: !_this.showQRCode,
                showPayRet: true,
                payError: "可以的话，请截图给开发者" + JSON.stringify(res.data)
              });

              return;
            }
          }).catch(err => {
            clearInterval(qrCodeInfoInterval);
            uni.showToast({
              icon: "none",
              title: "请求失败"
            });
            uni.setNavigationBarColor({
              frontColor: "#000000",
              backgroundColor: "#fff"
            });
            uni.setScreenBrightness({
              value: _this.screenBrightness
            });
            uni.setNavigationBarTitle({
              title: "支付结果"
            });

            _this.setData({
              showQRCode: !_this.showQRCode,
              showPayRet: true,
              payError: err.errMsg
            });
          });
        }
      },
      payError: ""
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
  onLoad: function (options) {
    _this = this;
    uni.getStorage({
      key: "CARD_AccNum",
      success: res => {
        if (res.data) {
          this.CARD_AccNum = res.data;
          this.getWalletDetail();
          this.getDealRec(0, "", 0, 0);
        }
      },
      fail: err => {
        this.loginYKT(res => {
          if (res) {
            this.getWalletDetail();
            this.getDealRec(0, "", 0, 0);
          }
        });
      }
    });
    uni.getScreenBrightness({
      success: res => {
        this.screenBrightness = res.value;
      }
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
  onUnload: function () {
    if (qrCodeInfoInterval) {
      clearInterval(qrCodeInfoInterval);
      qrCodeInfoInterval = null;
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loginYKT(res => {
      if (res) {
        this.getWalletDetail();
        this.getDealRec(0, "", 0, 0);
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    // 一卡通登录
    loginYKT: function (r) {
      uni.showLoading({
        title: "登录中~"
      });
      yktLogin(app.globalData.sessionInfo.SSO_TGC).then(res => {
        const resp = res.data;
        uni.stopPullDownRefresh();
        uni.hideLoading();
        this.CARD_AccNum = resp.data.AccNum;
        uni.setStorage({
          data: resp.data.AccNum,
          key: "CARD_AccNum"
        });
        r(true);
      }).catch(err => {});
    },
    // 获取钱包金额
    getWalletDetail: function () {
      getAccWallet(this.CARD_AccNum).then(res => {
        const data = res.data.data;
        this.setData({
          wallet: data.Rows[0].WalletRows,
          userName: data.Rows[0].AccName
        });
      });
    },

    /**
     * 获取详细流水信息
     * @param {*} begin 开始时间 年月日
     * @param {*} end 截止时间 年月日
     * @param {*} type  类型 全部0|充值1|转账2|消费3|其它4
     * @param {*} walletNum  0所有钱包|指定钱包编号
     */
    getDealRec: function (begin, end, type, walletNum) {
      const data = {
        AccNum: this.CARD_AccNum,
        // 年月日
        BeginDate: '' + begin,
        // 年月日
        EndDate: '' + end,
        // 类型 全部0|充值1|转账2|消费3|其它4
        Type: '' + type,
        ViceAccNum: '' + -1,
        // 0所有钱包|指定钱包编号
        WalletNum: '' + walletNum,
        RecNum: '' + 1,
        Count: '' + 10
      };
      getDealRec(data).then(res => {
        const data = res.data.data;
        this.setData({
          DealRec: data.Rows
        });
      });
    },
    // 用户尝试点击充值按钮
    bindChargeAct: function (e) {
      if ("undefined" !== typeof qq) {
        uni.showModal({
          title: "需要使用“易校园”小程序",
          content: "QQ没有“易校园”小程序，故暂不支持该功能，如需充值请使用微信小程序",
          showCancel: false
        });
        return;
      }

      uni.showModal({
        title: "需要使用易校园",
        content: "当前操作需使用易校园小程序，确定将尝试打开“易校园”小程序",

        success(res) {
          if (res.confirm) {
            uni.navigateToMiniProgram({
              appId: "wxe825270ae451b798",
              path: "pages/card/pages/rechargeCard/rechargeCard"
            });
          } else if (res.cancel) {
            uni.showToast({
              icon: "none",
              title: "阁下取消了本次操作"
            });
          }
        }

      });
    },
    // 全屏预览二维码
    previewQRCode: function () {
      uni.previewImage({
        urls: [this.qrAPI + this.qrCode]
      });
    },
    // 刷新二维码
    refreshQRCode: function () {
      clearInterval(qrCodeInfoInterval);
      qrCodeInfoInterval = null;
      this.setData({
        refreshStatus: 1
      });
      card.getPayQRCode(_this.CARD_AccNum).then(res => {
        _this.QRCode = res.data.QRCode;
        drawById.call(wx, "payQrcode", {
          text: res.data.QRCode,
          // 二维码内容
          width: _this.windowWidth * 0.9,
          // 宽度 px内容自动转换像素比
          height: _this.windowWidth * 0.9 // 高度

        });
        this.setData({
          refreshStatus: 2
        });
        qrCodeInfoInterval = setInterval(this.QRCode.getInfo, 5000);
        setTimeout(() => {
          this.setData({
            refreshStatus: 0
          });
        }, 1000);
      }).catch(err => {
        uni.showToast({
          title: err.errMsg,
          icon: "none"
        });
      });
    },
    // 切换显示二维码
    bindShowQRCode: function (e) {
      if (e.currentTarget.dataset.type) {
        // 显示二维码
        uni.setNavigationBarTitle({
          title: "付款码"
        });
        uni.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: "#ff5c15"
        });
        uni.setScreenBrightness({
          value: 1
        });
        card.getPayQRCode(_this.CARD_AccNum).then(res => {
          _this.QRCode = res.data.QRCode;
          drawById.call(wx, "payQrcode", {
            text: res.data.QRCode,
            // 二维码内容
            width: _this.windowWidth * 0.9,
            // 宽度 px内容自动转换像素比
            height: _this.windowWidth * 0.9 // 高度

          });
          qrCodeInfoInterval = setInterval(this.QRCode.getInfo, 2000);
        }).catch(err => {
          uni.showToast({
            title: err.errMsg,
            icon: "none"
          });
        });
      } else {
        // 关闭二维码
        console.log("调整屏幕亮度至-->" + this.screenBrightness);
        uni.setNavigationBarTitle({
          title: "我的一卡通"
        });
        uni.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#fff"
        });
        uni.setScreenBrightness({
          value: this.screenBrightness
        });
        clearInterval(qrCodeInfoInterval);
        qrCodeInfoInterval = null;
      }

      this.setData({
        showQRCode: !this.showQRCode
      });
    },
    // 付款结果
    bindShowPayRet: function () {
      uni.setNavigationBarTitle({
        title: "我的一卡通"
      });
      this.setData({
        showPayRet: !this.showPayRet
      });
      this.getWalletDetail();
      this.getDealRec(0, "", 0, 0);
    },

    item() {
      console.log("占位：函数 item 未声明");
    }

  }
};
</script>
<style>
/* pages/card/card.wxss */
@import "../common.css";

.wallet-card {
    height: 90%;
    background-color: #607d8b;
    margin: 30rpx;
    border-radius: 35rpx;
    box-shadow: 0px 1px 5px #b4b4b4;
}

.wallet-card-user {
    padding: 0.6rem;
    display: block;
}
.wallet-card-name {
    padding: 0.8rem;
    font-size: small;
    color: #311919db;
}
.wallet-card-count {
    display: block;
    padding: 1rem;
    font-size: x-large;
}
.actionList{
    text-align: center;
    color: red;
}

.my-cells {
    padding: 0.1rem;
}

.card-qrcode-btn {
    color: #fff;
    position: fixed;
    bottom: 0.5rem;
    background: #2347bd;
    border-radius: 41%;
    width: 3rem;
    text-align: center;
    box-shadow: 0 0.03rem 1.12rem rgba(0,33,130,.6);
}

/* 二维码 */
.QRCode {
    background-image: linear-gradient(#ff5c15, #ff005a);
    position: fixed;
    height: 100%;
    width: 100%;
}

.QRContent {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.QRItem{
    margin-bottom:1.8rem;
    margin-top: 2rem;
}
.refresh{
    animation:refresh 1s linear infinite;
  }
  /* 
    turn : 定义的动画名称
    1s : 动画时间
    linear : 动画以何种运行轨迹完成一个周期
    infinite :规定动画应该无限次播放
   */
  @keyframes refresh{
    0%{-webkit-transform:rotate(0deg);}
    25%{-webkit-transform:rotate(90deg);}
    50%{-webkit-transform:rotate(180deg);}
    75%{-webkit-transform:rotate(270deg);}
    100%{-webkit-transform:rotate(360deg);}
  }
/* 二维码 End */

@media (prefers-color-scheme: dark) {
    /* DarkMode 下的样式 start */
    page {
        background-color: #1b1b1b;
    }
    .my-cells > .weui-cells__title, .my-cell > .weui-cell__ft{
        color:gray
    }
    /* DarkMode 下的样式 end */
  }
</style>