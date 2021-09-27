<template>
<view>
	<view id="success" :class="'success ' + (successShow ? 'success--show' : '') + ' ' + (successTran ? 'success--tran' : '')" :style="'top: ' + topSize + 'rpx;color: ' + color">
		<view class="info">刷新成功</view>
	</view>
	<movable-area class="movable-area">
		<movable-view class="scroll" :style="'height: calc(100vh + 40rpx + ' + refreshSize + 'rpx)'" @change="change" @touchend="touchend" direction="vertical" :disabled="refreshStatus >= 3" :y="move">
			<scroll-view class="scroll__view" :style="'padding-bottom: ' + bottomSize + 'rpx;padding-top: ' + topSize + 'rpx;'" :scroll-y="refreshStatus == 1" @scroll="scroll" :scroll-top="scrollTop" :enable-back-to-top="enableBackToTop" :lower-threshold="80 + 'rpx'" @scrolltolower="more">
				<view id="refresh" :class="'scroll__refresh ' + (successShow ? 'scroll__refresh--hidden' : '')" :style="'height: ' + refreshSize + 'rpx;padding: 20rpx 0;'">
					<view class="scroll__loading">
						<view v-if="refreshStatus == 1 || refreshStatus == 2" :class="(refreshStatus == 2 ? 'rotate' : '') + ' arrow'"></view>
						<view v-if="refreshStatus == 3" class="loading">
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
						</view>
						<view class="text" v-if="refreshStatus == 1">下拉刷新</view>
						<view class="text" v-else-if="refreshStatus == 2">松开更新</view>
						<view class="text" v-else-if="refreshStatus == 3">加载中...</view>
					</view>
				</view>
				<slot></slot>
				<view v-if="listCount === 0 && emptyShow" class="empty">
					<image class="empty__image" :src="emptyUrl"></image>
					<view class="empty__text">{{emptyText}}</view>
				</view>
				<view v-if="listCount !== 0 && overOnePage" class="scroll__bottom">
					<view class="scroll__loading" v-if="end">
						已全部加载
					</view>
					<view class="scroll__loading" v-else>
						<view class="loading">
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
							<view class="loading__item"></view>
						</view>
						<view class="text">加载中...</view>
					</view>
				</view>
			</scroll-view>
		</movable-view>
	</movable-area>
</view>
</template>

<script>

export default {
  data() {
    return {
      /* 未渲染数据 */
      mode: 'refresh',
      // refresh 和 more 两种模式
      successShow: false,
      // 显示success
      successTran: false,
      // 过度success
      refreshStatus: 1,
      // 1: 下拉刷新, 2: 松开更新, 3: 加载中, 4: 加载完成
      move: -65,
      // movable-view 偏移量
      scrollHeight1: 0,
      // refresh view 高度负值
      scrollHeight2: 0,
      // refresh view - success view 高度负值
      timer: null,

      /* 渲染数据 */
      scrollTop: 0,
      overOnePage: false
    };
  },

  components: {},
  props: {
    // 加载中
    requesting: {
      type: Boolean,
      default: false
    },
    // 加载完毕
    end: {
      type: Boolean,
      default: false
    },
    // 控制空状态的显示
    emptyShow: {
      type: Boolean,
      default: false
    },
    // 当前列表长度
    listCount: {
      type: Number,
      default: 0
    },
    // 空状态的图片
    emptyUrl: {
      type: String,
      default: "/static/assets/image/empty/empty.png"
    },
    // 空状态的文字提示
    emptyText: {
      type: String,
      default: "未找到数据"
    },
    // 下拉刷新的高度
    refreshSize: {
      type: Number,
      default: 90
    },
    // 顶部高度
    topSize: {
      type: Number,
      default: 0
    },
    // 底部高度
    bottomSize: {
      type: Number,
      default: 0
    },
    // 颜色
    color: {
      type: String,
      default: ""
    },
    // iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向
    enableBackToTop: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    requesting: {
      handler: 'requestingEnd',
      immediate: true
    },
    refreshSize: {
      handler: 'refreshChange',
      immediate: true
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    /**
     * 处理 bindscrolltolower 失效情况
     */
    scroll(e) {
      // 可以触发滚动表示超过一屏
      this.setData({
        overOnePage: true
      });
      clearTimeout(this.timer);
      this.setData({
        timer: setTimeout(() => {
          this.setData({
            scrollTop: e.detail.scrollTop
          });
        }, 100)
      });
    },

    /**
     * movable-view 滚动监听
     */
    change(e) {
      let refreshStatus = this.refreshStatus,
          diff = e.detail.y;
      if (refreshStatus >= 3) return;

      if (diff > -10) {
        this.setData({
          refreshStatus: 2
        });
      } else {
        this.setData({
          refreshStatus: 1
        });
      }
    },

    /**
     * movable-view 触摸结束事件
     */
    touchend() {
      let refreshStatus = this.refreshStatus;
      if (refreshStatus >= 3) return;

      if (refreshStatus === 2) {
        uni.vibrateShort();
        this.setData({
          refreshStatus: 3,
          move: 0,
          mode: 'refresh'
        });
        this.$emit('refresh');
      } else if (refreshStatus === 1) {
        this.setData({
          move: this.scrollHeight1
        });
      }
    },

    /**
     * 加载更多
     */
    more() {
      if (!this.end) {
        this.setData({
          mode: 'more'
        });
        this.$emit('more');
      }
    },

    /**
     * 监听 requesting 字段变化, 来处理下拉刷新对应的状态变化
     */
    requestingEnd(newVal, oldVal) {
      if (this.mode === 'more') return;

      if (oldVal === true && newVal === false) {
        setTimeout(() => {
          this.setData({
            successShow: true,
            refreshStatus: 4,
            move: this.scrollHeight2
          });
          setTimeout(() => {
            this.setData({
              successTran: true,
              move: this.scrollHeight1
            });
            setTimeout(() => {
              this.setData({
                refreshStatus: 1,
                successShow: false,
                successTran: false,
                move: this.scrollHeight1
              });
            }, 350);
          }, 1500);
        }, 600);
      } else {
        if (this.refreshStatus !== 3) {
          this.setData({
            refreshStatus: 3,
            move: 0
          });
        }
      }
    },

    /**
     * 监听下拉刷新高度变化, 如果改变重新初始化参数, 最小高度80rpx
     */
    refreshChange(newVal, oldVal) {
      if (newVal <= 80) {
        this.setData({
          refreshSize: 80
        });
      } // 异步加载数据时候, 延迟执行 init 方法, 防止基础库 2.7.1 版本及以下无法正确获取 dom 信息


      setTimeout(() => this.init(), 10);
    },

    /**
     * 初始化scroll组件参数, 动态获取 下拉刷新区域 和 success 的高度
     */
    init() {
      let {
        windowWidth
      } = uni.getSystemInfoSync();
      let successHeight = (windowWidth || 375) / 750 * 70;
      this.createSelectorQuery().select("#refresh").boundingClientRect(res => {
        this.setData({
          scrollHeight1: -res.height,
          scrollHeight2: successHeight - res.height
        });
      }).exec();
    }

  }
};
</script>
<style>
@import "./index-wxa-auto-dark.css";
.movable-area {
  width: 100%;
  height: 100vh; }

.scroll {
  width: 100%;
  height: calc(100vh + 90rpx); }
  .scroll__view {
    height: 100%;
    position: relative;
    box-sizing: border-box; }
  .scroll__refresh {
    height: 90rpx;
    position: relative; }
    .scroll__refresh--hidden {
      visibility: hidden; }
  .scroll__bottom {
    position: relative;
    height: 40rpx;
    padding: 40rpx 0; }
  .scroll__loading {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    text-align: center;
    color: #999999; }
    .scroll__loading .text {
      display: inline-block;
      vertical-align: middle;
      margin-left: 40rpx; }

.success {
  position: absolute;
  z-index: 9;
  top: 20rpx;
  left: 0;
  width: 100%;
  height: 70rpx;
  line-height: 70rpx;
  font-size: 24rpx;
  text-align: center;
  opacity: 0;
  transform: scale(0);
  color: #3F82FD; }
  .success:after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: currentColor;
    opacity: 0.7;
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
    z-index: 0; }
  .success > .info {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    color: #ffffff; }
  .success--show {
    opacity: 1;
    transform: scale(1); }
    .success--show:after {
      transform: scaleX(1); }
  .success--tran {
    opacity: 0;
    transform: translateY(-100%);
    transition: opacity 0.35s linear, transform 0.35s linear; }

.empty {
  padding: 30rpx;
  text-align: center; }
  .empty__image {
    width: 200rpx;
    height: 200rpx;
    margin: 160rpx auto 60rpx; }
  .empty__text {
    color: #999999; }

.arrow {
  position: relative;
  border-radius: 4rpx;
  width: 4rpx;
  height: 30rpx;
  background: #a5a5a5;
  transition: transform 0.15s ease-in-out;
  display: inline-block;
  vertical-align: middle; }
  .arrow:before {
    position: absolute;
    content: "";
    bottom: -4rpx;
    right: 50%;
    width: 4rpx;
    height: 16rpx;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
    background: #a5a5a5;
    border-radius: 4rpx; }
  .arrow:after {
    position: absolute;
    content: "";
    bottom: -4rpx;
    left: 50%;
    width: 4rpx;
    height: 16rpx;
    transform: rotate(-45deg);
    transform-origin: 0% 100%;
    background: #a5a5a5;
    border-radius: 4rpx; }
  .arrow.rotate {
    transform: rotate(-180deg); }

.loading {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 36rpx;
  height: 36rpx;
  margin-right: -14rpx; }
  .loading__item {
    position: absolute;
    top: 0;
    left: 0;
    width: 36rpx;
    height: 36rpx; }
    .loading__item:before {
      content: "";
      display: block;
      margin: 0 auto;
      width: 4rpx;
      height: 8rpx;
      background-color: #a5a5a5;
      border-radius: 4rpx;
      animation: fadeDelay 1.2s infinite ease-in-out both; }
    .loading__item:nth-child(2) {
      transform: rotate(30deg); }
      .loading__item:nth-child(2):before {
        animation-delay: -1.1s; }
    .loading__item:nth-child(3) {
      transform: rotate(60deg); }
      .loading__item:nth-child(3):before {
        animation-delay: -1s; }
    .loading__item:nth-child(4) {
      transform: rotate(90deg); }
      .loading__item:nth-child(4):before {
        animation-delay: -0.9s; }
    .loading__item:nth-child(5) {
      transform: rotate(120deg); }
      .loading__item:nth-child(5):before {
        animation-delay: -0.8s; }
    .loading__item:nth-child(6) {
      transform: rotate(150deg); }
      .loading__item:nth-child(6):before {
        animation-delay: -0.7s; }
    .loading__item:nth-child(7) {
      transform: rotate(180deg); }
      .loading__item:nth-child(7):before {
        animation-delay: -0.6s; }
    .loading__item:nth-child(8) {
      transform: rotate(210deg); }
      .loading__item:nth-child(8):before {
        animation-delay: -0.5s; }
    .loading__item:nth-child(9) {
      transform: rotate(240deg); }
      .loading__item:nth-child(9):before {
        animation-delay: -0.4s; }
    .loading__item:nth-child(10) {
      transform: rotate(270deg); }
      .loading__item:nth-child(10):before {
        animation-delay: -0.3s; }
    .loading__item:nth-child(11) {
      transform: rotate(300deg); }
      .loading__item:nth-child(11):before {
        animation-delay: -0.2s; }
    .loading__item:nth-child(12) {
      transform: rotate(330deg); }
      .loading__item:nth-child(12):before {
        animation-delay: -0.1s; }
@keyframes fadeDelay {
  0%, 39%, 100% {
    opacity: 0.2; }
  40% {
    opacity: 1; } }
@-webkit-keyframes fadeDelay {
  0%, 39%, 100% {
    opacity: 0.2; }
  40% {
    opacity: 1; } }

</style>