<template>
<view>
<!-- pages/attendance/edit.wxml -->
<!-- <mp-cells ext-class="my-cells" title="自动打卡操作">
  <view class="check-info">
  <picker mode="time" value="{{autoCheckIn.time}}" start="06:00" end="23:59" bindchange="bindAutoCheckInTime">
    {{autoCheckIn.time}}
  </picker>
  <label>
    <switch checked="{{isAutoCheckIn}}" bindchange="autoCheckInSwitch" disabled="{{!isSubscription}}" />
    自动打卡
  </label>
  <label style="margin-top:10rpx;display: block;" bindtap="bindShowIntro">
    <view wx:if="{{!showIntro}}">查看说明</view>
    <text wx:else style="color:gray;">
      第一次添加后，1分钟之内系统会执行一次打卡操作，没有订阅将无法收到提醒;
    打卡数据为下方填写内容;
    提醒次数取决于订阅次数
    </text>
  </label>
  <label style="display: flex;">
    <button style="width:151px;font-size: small;{{!isSubscription?'color:red;':''}}" type="primary" disabled="{{!isSubscription}}" bindtap="updateAutoCheckIn">
      {{isSubscription?'更新自动打卡':'请先订阅服务'}}
    </button>
    <navigator url="/pages/my/sub/sub">
      <button style="width:126px;font-size: small;" type="primary">订阅管理</button>
    </navigator>
  </label>
  </view>
</mp-cells> -->
<mp-cells ext-class="my-cells" title="打卡时间">
  <mp-cell ext-class="my-cell">
    <view>{{checkInTime}}</view>
  </mp-cell>
</mp-cells>

<!-- 表单开始 -->
<d-form :formData="formData" :showSubmitBtn="true" @DynamicFormSubmit="onFormSubmit"></d-form>

<!-- <mp-cells ext-class="my-cells" title="1.个人健康状况">
  <view wx:for="{{healthStatus}}" wx:key="key">
    <mp-cell ext-class="my-cell">
      <view>({{index + 1}}) {{item.title}}</view>
      <picker slot="footer" bindchange="bindHealthStatusChange" data-index="{{index}}" value="{{item.index}}" range="{{item.select}}">
        <view class="picker">{{item.select[item.index]}}</view>
      </picker>
    </mp-cell>
    <mp-cell ext-class="my-cell" wx:if="{{index == 0 && healthStatus[0].index == 6}}" title="外地详址：">
      <view style="display:flex;">
        <input data-type="province" bindinput="bindHealthStatusOutLand" placeholder="?" value="{{item.outLand.province}}" />
        <view slot="footer">省</view>
        <input data-type="city" bindinput="bindHealthStatusOutLand" placeholder="?" value="{{item.outLand.city}}" />
        <view slot="footer">市</view>
        <input data-type="area" bindinput="bindHealthStatusOutLand" placeholder="?" value="{{item.outLand.area}}" />
        <view slot="footer">区</view>
      </view>
    </mp-cell>
  </view>
  <mp-cell ext-class="my-cell">
    <view>(7)其他需要说明情况：</view>
    <textarea data-type="healthStatusOtherInfo" bindinput="bindInput" auto-height placeholder="请选择性填写" value="{{healthStatusOtherInfo}}" />
  </mp-cell>
</mp-cells>-->
<!-- <mp-cells ext-class="my-cells" title="2.申请进出学校(无需求则不填)">
  <mp-cell title="目的地：">
    <input bindinput="bindInput" data-type="toPlace" class="weui-input" placeholder="请输入目的地" value="{{outIn.toPlace}}" />
  </mp-cell>
  <mp-cell title="事由：">
    <input bindinput="bindInput" data-type="toResult" class="weui-input" placeholder="请输入事由" value="{{outIn.toResult}}" />
  </mp-cell>
  <mp-cell title="计划：">
    <view>
      <picker slot="footer" mode="multiSelector" bindchange="bindOutChange" value="{{outIn.outIndex}}" range="{{outIn.out}}">
        <view class="picker">
          {{outIn.out[0][outIn.outIndex[0]]}}-{{outIn.out[1][outIn.outIndex[1]]}}:00出校
        </view>
      </picker>
    </view>
    <view>
      <picker slot="footer" mode="multiSelector" bindchange="bindInChange" value="{{outIn.inIndex}}" range="{{outIn.in}}">
        <view class="picker">
          {{outIn.in[0][outIn.inIndex[0]]}}-{{outIn.in[1][outIn.inIndex[1]]}}:00回校
        </view>
      </picker>
    </view>
  </mp-cell>
  <mp-cell title="审核情况：">
    <view slot="footer">{{requestRet}}</view>
  </mp-cell>
</mp-cells> -->
<!--<mp-cells ext-class="my-cells" title="2.最近一个月以来的情况">
  <mp-cell wx:for="{{monthStatus}}" wx:key="type" ext-class="my-cell">
    <label class="radio">
      <switch checked="{{item.isGo}}" data-index="{{index}}" bindchange="monthStatusChange" />
      {{item.title}}
    </label>
    <view>
      <textarea wx:if="{{item.isGo}}" data-index="{{index}}" bindinput="bindMonthStatusInput" auto-height placeholder="若接触过，请写明时间、地点及简要事由" value="{{item.details}}" />
    </view>
  </mp-cell>
</mp-cells>
<mp-cells ext-class="my-cells" title="3.从外地返校(预计，目前已在成都的不填)情况">
  <mp-cell ext-class="my-cell">
    <view>主要交通方式：</view>
    <picker slot="footer" bindchange="bindTransportChange" value="{{transport.methodIndex}}" range="{{transport.method}}">
      <view class="picker">{{transport.method[transport.methodIndex]}}</view>
    </picker>
  </mp-cell>
  <mp-cell ext-class="my-cell">
    <view>公共交通的航班号、车次等：</view>
    <input bindinput="bindInput" data-type="toolId" class="weui-input" placeholder="请输入航班号、车次" value="{{transport.toolId}}" />
  </mp-cell>
  <mp-cell title="返校(预计)时间：" ext-class="my-cell">
    <input bindinput="bindBackMonth" placeholder="?" />
    <view slot="footer">月</view>
    <input bindinput="bindBackDay" placeholder="?" />
    <view slot="footer">日</view>
  </mp-cell>
</mp-cells>
<view class="weui-btn-area">
  <button class="weui-btn" type="primary" bindtap="submitForm">提交打卡</button>
</view> -->

<!-- 回首页按钮悬浮按钮 -->
<view v-if="fromShare">
  <navigator url="/pages/index/index" open-type="reLaunch" class="floatBtn" style="bottom: 5%;font-size: x-large;">
    <view class="iconfont icon-shouye"></view>
  </navigator>
</view>
</view>
</template>

<script>
// pages/attendance/edit.js
const app = getApp();
import { genQuerySign } from '../../utils/tool';
import { getCheckInData, postCheckInData } from './api';
import mpCell from "../../miniprogram_npm/weui-miniprogram/cell/cell";
import mpCells from "../../miniprogram_npm/weui-miniprogram/cells/cells";
import dForm from "../../components/dynamicForm/index";

export default {
  data() {
    return {
      link: '',
      checkInTime: '',
      requestRet: '',
      formData: {},
      autoCheckIn: {
        time: new Date().getHours() + ':' + new Date().getMinutes()
      },
      isAutoCheckIn: false,
      isSubscription: false,
      showIntro: false,
      sessionInfo: {},
      tempForm: null,
      fromShare: false
    };
  },

  components: {
    mpCell,
    mpCells,
    dForm
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.link = decodeURIComponent(options.link);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if ("undefined" !== typeof qq && 1 === getCurrentPages().length) {
      this.setData({
        fromShare: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.sessionInfo = app.globalData.sessionInfo;
    app.globalData.autoLoginProcess.then(() => {
      this.onPullDownRefresh();
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
  onPullDownRefresh: function () {
    // this.getCheckInInfo()
    this.getEditDetail().then(res => {
      const {
        data
      } = res.data;
      uni.stopPullDownRefresh();
      uni.hideLoading();
      this.setData({
        formData: data.form.data,
        checkInTime: data.form.checkTime
      });
      uni.setNavigationBarTitle({
        title: data.form.title
      });
      return Promise.reject();
    }).catch(err => {
      if (err && 20401 == err.errorCode) {
        // 计算中心未登录
        if (app.globalData.isUser) app.globalData.loginClass.ccDoLogin().then(this.onPullDownRefresh);else {
          uni.navigateTo({
            url: '../my/sso/sso'
          });
        }
      } else if (err && err.errMsg) {
        uni.showToast({
          icon: 'none',
          title: err.errMsg
        });
      }

      return Promise.reject();
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
    onFormSubmit: function (e) {
      console.log('submit', e);
      var data = e.detail;
      var form = {};

      for (var key in data) {
        let type = data[key].original.type;

        switch (type) {
          case 'picker':
            let idx = data[key].idx;
            form[key] = data[key].original.range[idx].id;
            break;

          case 'input':
          case 'textarea':
            form[key] = data[key].value;
            break;
        }
      }

      this.tempForm = form;
      postCheckInData(this.link, this.sessionInfo.JSZX_cookie, form).then(res => {
        const resp = res.data;
        const {
          data
        } = resp;
        uni.showToast({
          icon: 'none',
          title: data.msg
        });
        this.setData({
          formData: data.form.data,
          checkInTime: data.form.checkTime
        });
      }).catch(err => {
        console.log(err);
        const msg = err && err.data && err.data.msg ? err.data.msg : '未知异常';
        uni.showToast({
          icon: 'none',
          title: msg
        });
      });
    },
    // 获取打卡详细信息
    getEditDetail: function () {
      uni.showLoading({
        title: '获取打卡信息'
      });
      return getCheckInData(this.sessionInfo.JSZX_cookie, this.link);
    },
    getCheckInInfo: function () {
      app.globalData.httpPost({
        url: '/Task/checkInStatusV2',
        data: {
          openid: app.globalData.openid,
          sign: genQuerySign('/Task/checkInStatusV2/', app.globalData.openid)
        }
      }).then(data => {
        uni.stopPullDownRefresh();
        this.setData({
          isSubscription: data.isSubscription
        });

        if (false !== data.autoCheckIn) {
          this.setData({
            autoCheckIn: data.autoCheckIn,
            isAutoCheckIn: true
          });
        }
      }).catch(err => {
        uni.stopPullDownRefresh();
        if (err.errMsg) uni.showToast({
          icon: 'none',
          title: err.errMsg
        });
      });
    },
    // 监测自动打卡开关
    autoCheckInSwitch: function (e) {
      this.isAutoCheckIn = e.detail.value;
    },
    bindShowIntro: function () {
      this.setData({
        showIntro: !this.showIntro
      });
    },
    // 更新自动打卡状态
    updateAutoCheckIn: function () {
      if (this.tempForm == null) {
        uni.showToast({
          icon: 'none',
          title: '请至少提交一次！'
        });
        return;
      }

      new Promise((resolve, reject) => {
        if (this.isAutoCheckIn) {
          this.setData({
            isAutoCheckIn: true
          });
          resolve(false);
        } else {
          this.setData({
            isAutoCheckIn: false
          }); // 删除

          resolve(true);
        }
      }).then(del => {
        //发起网络请求
        if (!del) {
          // 添加
          this.addCheckInTask(this.autoCheckIn.time, app.globalData.openid, 0);
        } else {
          // 删除
          this.addCheckInTask('06:00', app.globalData.openid, 1);
          let a = this.autoCheckIn;
          this.setData({
            autoCheckIn: a
          });
        }
      }).catch(err => {
        console.log(err);
        uni.showToast({
          icon: 'none',
          title: err.errMsg
        });
      });
    },
    bindAutoCheckInTime: function (e) {
      let a = this.autoCheckIn;
      a.time = e.detail.value;
      this.setData({
        autoCheckIn: a
      });
    },
    addCheckInTask: function (time, openid, action) {
      uni.showLoading({
        title: '修改中~'
      });
      var data = {
        time: time,
        openid: openid,
        action: action,
        form: this.tempForm,
        link: this.link
      };
      let encrypted = app.globalData.RSAEncrypt(JSON.stringify(data));
      app.globalData.httpPost({
        url: '/Task/checkInInfoV2/',
        data: {
          data: encrypted
        }
      }).then(data => {
        uni.hideLoading();
        uni.showToast({
          icon: 'none',
          title: data.errMsg
        });
      }).catch(err => {
        uni.hideLoading();
        if (err.errMsg) uni.showToast({
          icon: 'none',
          title: err.errMsg
        });
      });
    }
  }
};
</script>
<style>
/* pages/attendance/edit.wxss */
@import "../common.css";

@media (prefers-color-scheme: dark) {
    /* DarkMode 下的样式 start */
    page, .check-info {
        background-color: #1b1b1b;
    }
    .my-cells > .weui-cells__title, .my-cell > .weui-cell__ft{
        color:gray
    }
    /* DarkMode 下的样式 end */
  }

@import "./edit-wxa-auto-dark.css";
</style>