<template>
<!-- pages/THEOL/THEOL.wxml -->
	<mp-cells title="课程列表">
		<block v-for="(item, index) in list" :key="index">
			<mp-cell ext-class="my-cell">
				<view :data-courseId="item.courseId" @tap="bindViewCourseDir">{{item.course}}</view>
				<view class="footer" slot="footer" :data-courseId="item.courseId" @tap="bindViewCourseDir">{{item.teacher}}({{item.college}})</view>
			</mp-cell>
		</block>
	</mp-cells>
</template>

<script>
// pages/THEOL/THEOL.js
import { getCourseList, theolLogin } from './api';
const app = getApp();
import mpCell from "../../miniprogram_npm/weui-miniprogram/cell/cell";
import mpCells from "../../miniprogram_npm/weui-miniprogram/cells/cells";
import log from "../../utils/log.js"

export default {
  data() {
    return {
      sessionInfo: null,
      isFirstLoginTry: true,
      list: []
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
    this.sessionInfo = app.globalData.sessionInfo;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.loadCourseList();
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
  onPullDownRefresh: function () {
    this.loadCourseList()
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
		loadCourseList: function(){
			uni.showLoading({
			  title: "加载课程列表~"
			});
			this.getCourseList().then(res => {
				const resp = res.data
			  this.list = resp.list
			  uni.hideLoading();
			}).catch(err => {
				const resp = err.data
			  // 教学平台未登录
			  if ("undefined" !== typeof resp.theolCookie) {
			    // cookie需要更新
			    this.sessionInfo.theolCookie = resp.theolCookie;
			    uni.setStorage({
			      key: "theolCookie",
			      data: resp.theolCookie
			    });
			  }
				
				// 尝试登录教学平台
				log.info("resp", resp)
			  if (21401 == resp.code) {
			    if (this.isFirstLoginTry) {
			      this.isFirstLoginTry = false;
						log.info(1)
			      this.THEOL_Login(this.sessionInfo.theolCookie)
						.then(this.loadCourseList)
						.catch(err => {
							const resp = err.data
			        console.log(resp);
			
			        if (12401 == resp.code) {
			          this.isFirstLoginTry = true;
			          setTimeout(() => {
			            uni.navigateTo({
			              url: "../my/sso/sso"
			            });
			          }, 1000);
			        }
			      });
			    }
			  } else {
			    if (err.msg) {
			      uni.showToast({
			        icon: "none",
			        title: err.msg
			      });
			    } else {
			      uni.showToast({
			        icon: "none",
			        title: "未知异常"
			      });
			    }
			  }
			});
		},
    // 获取课程列表
    getCourseList: function () {
      return getCourseList(this.sessionInfo.theolCookie);
    },
    // 登录
    THEOL_Login: function (theolCookie) {
      return theolLogin({
        SSO_TGC: this.sessionInfo.SSO_TGC,
        theolCookie: theolCookie
      });
    },
    bindViewCourseDir: function (e) {
			log.info(e)
      var data = e.currentTarget.dataset;
      uni.navigateTo({
        url: "tree/tree?courseId=" + data.courseid
      });
    }
  }
};
</script>
<style>
@import "../common.css";
/* pages/THEOL/THEOL.wxss */
/* Page{
	
} */
</style>