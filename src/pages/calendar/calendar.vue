<template>
<view>
<!--pages/calendar/calendar.wxml-->
<view>
	<text>点击可查看大图</text>
</view>
<view>
	<image mode="aspectFill" :src="calendarImg" :data-src="[calendarImg]" @tap="bindPreview"></image>
</view>
<view>
	<view class="list">
		<label class="type">教学时间</label>
		<label class="time">
				<view>开始时间:2021年09月06日</view>
				<view>结束时间:2022年01月19日</view>
		</label>
	</view>
	<view class="list">
		<label class="type">寒假</label>
		<label class="time">
				<view>开始时间:2022年01月20日</view>
				<view>结束时间:2022年02月17日</view>
		</label>
	</view>
</view>
<view>
	<image mode="aspectFit" :src="hkgImg[0]" :data-src="hkgImg" @tap="bindPreview"></image>
</view>
<view>
	<image mode="aspectFit" :src="lqImg" :data-src="[lqImg]" @tap="bindPreview"></image>
</view>
<!-- 回首页按钮悬浮按钮 -->
<view v-if="fromShare">
  <navigator url="/pages/index/index" open-type="reLaunch" class="floatBtn" style="bottom: 5%;font-size: x-large;"><view class="iconfont icon-shouye"></view></navigator>
</view>
</view>
</template>

<script>
// pages/calendar/calendar.js
const app = getApp();

export default {
  data() {
    return {
      calendarImg: 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==',
      lqImg: 'https://cuit.api.jysafe.cn/public/images/map/lq.jpg',
      hkgImg: ['https://cuit.api.jysafe.cn/public/images/map/hkg1.jpg', 'https://cuit.api.jysafe.cn/public/images/map/hkg.jpg'],
      listData: [{
        "code": "教学时间",
        "text": "开始时间",
        "type": "结束时间"
      }, {
        "code": "寒假",
        "text": "开始时间",
        "type": "结束时间"
      }],
      fromShare: false
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
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if ("undefined" !== typeof qq && 1 === getCurrentPages().length) {
      this.setData({
        fromShare: true
      });
    }

    this.getCalendar();
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
   * 分享至微信朋友圈
   */
  onShareTimeline: function (e) {
    // console.log(e)
    return {
      title: '成信大校历'
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '成信大校历',
      // for wechat
      path: '/pages/calendar/calendar',
      // for qq
      query: ''
    };
  },
  methods: {
    /**
     * 获取校历
     */
    getCalendar: function () {
      // https://jwc.cuit.edu.cn/xl2020-2021.jpg
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      let xl = month > 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
      this.setData({
        calendarImg: `https://jwc.cuit.edu.cn/xl${xl}.jpg`
      });
    },

    /**
     * 点击图片触发事件
     */
    bindPreview: function (e) {
      var url = e.target.dataset.src;
      uni.previewImage({
        current: url,
        // 当前显示图片的http链接
        urls: url // 需要预览的图片http链接列表

      });
    }
  }
};
</script>
<style>
/* pages/calendar/calendar.wxss */
.list{
  display: flex;
  background-color: #1cbbb4;
  margin-top: 20px;
  margin: 6px;
  border-radius: 7px;
  height: 60px;
  box-shadow: 0px 1px 5px #b4b4b4;
}
.time{
  font-size: small;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.time, .type{
  color: rgb(255, 255, 255);
}
.type{
  display: flex;
  align-items: center;
  justify-content:center;
  font-size: 20px;
  width: 40%;
}
</style>