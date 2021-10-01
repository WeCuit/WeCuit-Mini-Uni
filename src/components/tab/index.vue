<template>
<view class="tabs-wrap" :style="'height: ' + size + 'rpx;'">
	<scroll-view class="scroll-view" :style="'height: ' + (size + 20) + 'rpx;'" :scroll-x="scrolling" :scroll-with-animation="scrolling" :scroll-left="scrollLeft">
		<view :class="'tabs ' + (scroll ? 'tabs--scroll' : '')" :style="'height: ' + size + 'rpx'">
			<view v-for="(item, index) in tabData" :key="index" :class="'tabs__item ' + (index === tabCur ? 'tabs__item--cur': '')" :style="'height: ' + size + 'rpx;line-height: ' + size + 'rpx'" @tap="toggleTab" :data-index="index">
				<view class="tabs__item-child">{{item}}</view>
			</view>
			<view :class="'tabs__line ' + (needTransition ? 'transition' : '')" :style="'background: ' + color + ';width: ' + lineWidth + 'px;transform: translateX(' + translateX + 'px)'"></view>
		</view>
	</scroll-view>
</view>
</template>

<script>

export default {
  data() {
    return {
      /* 未渲染数据 */
      windowWidth: 0,
      // 屏幕宽度
      tabItems: [],
      // 所有 tab 节点信息

      /* 渲染数据 */
      scrolling: true,
      // 控制 scroll-view 滚动以在异步加载数据的时候能正确获得 dom 信息
      needTransition: false,
      // 下划线是否需要过渡动画
      translateX: 0,
      // 下划 line 的左边距离
      lineWidth: 0,
      // 下划 line 宽度
      scrollLeft: 0, // scroll-view 左边滚动距离
			tabCur: 0
    };
  },

  components: {},
  props: {
    // 数据源
    tabData: {
      type: Array,
      default: () => []
    },
    // 是否可以超出滚动
    tabcur: {
      type: Number,
      default: 0
    },
    // 是否可以超出滚动
    scroll: {
      type: Boolean,
      default: false
    },
    // tab高度
    size: {
      type: Number,
      default: 90
    },
    // 颜色
    color: {
      type: String,
      default: ""
    }
  },
  watch: {
    tabData: {
      handler: "dataChange",
      immediate: true,
      deep: true
    },
    tabcur: {
      handler: "tabCurChange",
      immediate: true
    },
    size: {
      handler: "sizeChange",
      immediate: true
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    /**
     * 切换菜单
     */
    toggleTab(e) {
      this.$emit('change', {
        detail: {
          index: e.currentTarget.dataset.index
        }
      });
      this.scrollByIndex(e.currentTarget.dataset.index);
    },

    /**
     * 滑动到指定位置
     * @param tabCur: 当前激活的tabItem的索引
     * @param needTransition: 下划线是否需要过渡动画, 第一次进来应设置为false
     */
    scrollByIndex(tabCur, needTransition = true) {
      let item = this.tabItems[tabCur];
      if (!item) return;
      let itemWidth = item.width || 0,
          itemLeft = item.left || 0;
      this.needTransition = needTransition;

      if (this.scroll) {
        // 超出滚动的情况
        // 保持滚动后当前 item '尽可能' 在屏幕中间
        let scrollLeft = itemLeft - (this.windowWidth - itemWidth) / 2;
        this.setData({
          tabCur: tabCur,
          scrollLeft: scrollLeft,
          translateX: itemLeft,
          lineWidth: itemWidth
        });
      } else {
        // 不超出滚动的情况
        this.setData({
          tabCur: tabCur,
          translateX: itemLeft,
          lineWidth: itemWidth
        });
      }
    },

    /**
     * 监听数据变化, 如果改变重新初始化参数
     */
    dataChange(newVal, oldVal) {
      this.setData({
        scrolling: false
      });
			
			// 异步加载数据时候, 延迟执行 init 方法, 防止基础库 2.7.1 版本及以下无法正确获取 dom 信息
      setTimeout(() => this.init(), 0);
    },

    /**
     *  监听 tabCur 变化, 做对应处理
     */
    tabCurChange(newVal, oldVal) {
			console.log("tabCurChange", newVal, oldVal)
			this.tabCur = newVal
      this.scrollByIndex(newVal);
    },

    /**
     *  监听 tab 高度变化, 最小值为80rpx
     */
    sizeChange(newVal, oldVal) {
      if (newVal <= 80) {
        this.setData({
          size: 80
        });
      }
    },

    /**
     *  初始化函数
     */
    init() {
      const {
        windowWidth
      } = uni.getSystemInfoSync();
      this.setData({
        windowWidth: windowWidth || 375
      });
      this.createSelectorQuery().selectAll(".tabs__item-child").boundingClientRect(res => {
        this.setData({
          scrolling: true,
          tabItems: res
        });
        this.scrollByIndex(this.tabCur, false);
      }).exec();
    }

  }
};
</script>
<style>
    @import "./index-wxa-auto-dark.css";
.tabs-wrap {
  width: 100%;
  height: 90rpx;
  overflow: hidden; }

.scroll-view {
  width: 100%;
  height: 110rpx; }

.tabs {
  position: relative;
  height: 90rpx;
  color: #999999;
  display: flex;
  padding-bottom: 20rpx; }
  .tabs--scroll {
    width: max-content; }
  .tabs--scroll .tabs__item {
    flex: initial !important;
    text-align: initial !important;
    display: inline-block !important;
    padding: 0 30rpx; }
  .tabs--scroll .tabs__item-child {
    display: block !important; }
  .tabs__item {
    flex: 1;
    text-align: center;
    height: 90rpx;
    line-height: 90rpx;
    padding: 0 10rpx;
    box-sizing: border-box;
    transition: color 0.3s ease-in-out; }
    .tabs__item--cur {
      color: #333333; }
  .tabs__item-child {
    display: inline-block; }
  .tabs__line {
    position: absolute;
    left: 0;
    bottom: 20rpx;
    background-color: #3F82FD;
    height: 4rpx;
    width: 0rpx;
    display: inline-block; }
    .tabs__line.transition {
      transition: width 0.3s, transform 0.3s; }

</style>