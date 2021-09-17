<template>
  <view>
    <!--pages/grade/grade.wxml-->

    <!-- <view style="display: flex;align-items: center;margin-bottom: 2rem;">
  <switch checked="{{isGradeSub}}" bindchange="changeSubStatus" disabled="{{!isSysSub}}"/><label style="{{!isSysSub?'color:red':''}}">{{isSysSub?'订阅成绩更新提醒':'如需提醒请先订阅'}}</label>
  <navigator url="/pages/my/sub/sub" ><button style="width: auto;font-size: small;left: 1rem;" type="primary">订阅管理</button></navigator>
    </view>-->
    <view class="total_card" style="margin-bottom: 2rem;">
      <view>全部成绩</view>
      <view class="total_card_sub">
        <view class="total_item">全部学时：{{total.learnTime}}</view>
        <view class="total_item total_text_right">全部学分：{{total.creditTotal}}</view>
        <view class="total_item">实获学分：{{total.creditGet}}</view>
        <view class="total_item total_text_right">学分绩点：{{total.point}}</view>
      </view>
    </view>
    <view v-for="(item, index) in grade" :key="index" style="margin-bottom: 2rem;">
      <!-- 标题 -->
      <view class="total_card">
        <view>{{item.name}}</view>
        <view class="total_card_sub">
          <view class="total_item">全部学时：{{item.total.learnTime}}</view>
          <view class="total_item total_text_right">全部学分：{{item.total.creditTotal}}</view>
          <view class="total_item">实获学分：{{item.total.creditGet}}</view>
          <view class="total_item total_text_right">学分绩点：{{item.total.point}}</view>
        </view>
      </view>
      <!-- 成绩 -->
      <view class="grade_table">
        <view
          v-for="(d, n) in item.data"
          :key="n"
          class="grade_table_item"
          :style="!check.isPass(d.learnGrade)?'background-color:red':''"
        >
          <!-- 科目名称 -->
          <view>课程：{{n}}</view>
          <!-- 成绩详情 -->
          <view class="detail">
            <view>课程学时：{{d.learnTime}}</view>
            <view>课程学分：{{d.learnCredit}}</view>
            <view>平时成绩：{{d.lessonGrade}}</view>
            <view>期末成绩：{{d.examGrade}}</view>
            <view>总评成绩：{{d.learnGrade}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script module="check" lang="wxs" src="./check.wxs"></script>

<script>
// pages/grade/grade.js
import { getGradeTable } from "./api";
const app = getApp();
import { genQuerySign } from "../../utils/tool";

export default {
  data() {
    return {
      grade: [],
      total: {
				learnTime:0,
				creditTotal: 0,
				creditGet: 0,
				point: 0
			},
      isGradeSub: false,
      isSysSub: false,
      sessionInfo: {},
      isFirstOpenSSO: true,
      n: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.sessionInfo = app.globalData.sessionInfo;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
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
  onShow: function() {
    app.globalData.autoLoginProcess.then(() => {
      // this.getExamSubStatus();
      this.gradeQueryV2();
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.gradeQueryV2();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 分享至微信朋友圈
   */
  onShareTimeline: function(e) {
    return {
      title: "个人课表",
      query: ""
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: "个人课表",
      // for wechat
      path: "/pages/grade/grade",
      // for qq
      query: ""
    };
  },
  methods: {
    gradeQueryV2: function() {
      getGradeTable(
        `${this.sessionInfo.JWGL_cookie}; TWFID=${this.sessionInfo.TWFID}`
      )
        .then(res => {
          const resp = res.data;
          uni.stopPullDownRefresh();
          this.setData({
            grade: resp.data.grade,
            total: resp.data.total
          });
        })
        .catch(err => {
          uni.stopPullDownRefresh();
        });
    },
    // 获取成绩提醒订阅状态
    getExamSubStatus: function() {
      app.globalData
        .httpPost({
          url: "/Task/gradeStatusV2",
          data: {
            openid: app.globalData.openid,
            sign: genQuerySign("/Task/gradeStatusV2/", app.globalData.openid)
          }
        })
        .then(data => {
          this.setData({
            isGradeSub: data.data.gradeSub,
            isSysSub: data.data.sysSub
          });
        })
        .catch(err => {});
    },
    // 改变订阅状态
    changeSubStatus: function(e) {
      app.globalData
        .httpPost({
          url: "/Task/gradeInfoV2",
          data: {
            openid: app.globalData.openid,
            value: e.detail.value ? "1" : "0",
            sign: genQuerySign(
              "/Task/gradeInfoV2/",
              app.globalData.openid,
              e.detail.value ? "1" : "0"
            )
          }
        })
        .then(data => {
          uni.showToast({
            title: "修改成功"
          });
        })
        .catch(err => {
          this.setData({
            isGradeSub: !e.detail.value
          });
          if (err.errMsg)
            uni.showToast({
              icon: "none",
              title: err.errMsg
            });
        });
    }
  }
};
</script>
<style>
/* pages/grade/grade.wxss */

/* 新版 */
.total_card {
  background-color: hotpink;
  padding: 0.5rem;
  border-radius: 0.1rem;
  font-size: 40rpx;
}
.total_card_sub {
  display: flex;
  flex-wrap: wrap;
  margin: 0.6rem 0;
  font-size: 35rpx;
}
.total_item {
  width: 50%;
}
.total_text_right {
  text-align: right;
}
.grade_table {
  display: flex;
  flex-direction: column;
  box-shadow: 0px 1px 5px #b4b4b4;
}
.grade_table_item {
  display: inherit;
  flex-direction: column;
  background-color: #328ae4;
  margin: 0.2rem 0.4rem;
  border-radius: 10px;
}
.grade_table_item > view {
  margin-top: 0.5rem;
  padding-left: 0.5rem;
}
.grade_table_item > view:nth-child(1) {
  border-bottom: solid 1px #7817b5;
  font-size: 40rpx;
}
.grade_table_item > view:nth-child(2) {
  font-size: 35rpx;
}
.grade_table_item .detail {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}
.grade_table_item .detail > view {
  width: 50%;
}
@import "./grade-wxa-auto-dark.css";
</style>