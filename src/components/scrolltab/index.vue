<template>
<view>
<!--components/scrolltab/index.wxml-->
<!--分类导航-->
<view :class="scrollTop>scrollH?'nofixed':''"></view>
<view :class="'kind_contain ' + (scrollTop>310?'fixed':'')">

  <scroll-view enable-flex scroll-x class="nav" scroll-with-animation :scroll-left="(advance?scrollLeft:0) + 'rpx'">
    <view v-for="(item, index) in college" :key="index" class="nav-item" :data-id="index" @tap="collegeSelect">
      <view :class="'nav-text ' + (index==collegeCur?'tab-on':'')">{{item.text}}</view>
    </view>
  </scroll-view>

</view>
</view>
</template>

<script>

export default {
  data() {
    return {
      college: [],
      collegeCur: 0,
      scrollTop: 0,
      scrollH: 0 //滚动的高度
      ,
      scrollLeft: "",
      showList: false
    };
  },

  components: {},
  props: {
    tabdata: {
      // tab数据
      type: null
    },
    scrollTop: {
      //滚动的高度
      type: null
    },
    scrollH: {
      //距离顶部的高度
      type: null
    },
    currentTab: {
      //当前标签
      type: null
    }
  },
  watch: {
    tabdata: {
      handler: function (newVal, oldVal) {
        var that = this;
        that.setData({
          college: newVal
        });
      },
      immediate: true
    },
    scrollTop: {
      handler: function (newVal, oldVal) {
        var that = this;
        that.setData({
          scrollTop: newVal
        });
      },
      immediate: true
    },
    scrollH: {
      handler: function (newVal, oldVal) {
        var that = this;
        that.setData({
          scrollH: newVal
        });
      },
      immediate: true
    },
    currentTab: {
      handler: function (newVal, oldVal) {
        var that = this;
        that.setData({
          collegeCur: newVal
        });
      },
      immediate: true
    }
  },
  methods: {
    //选择分类
    collegeSelect(e) {
      this.setData({
        collegeCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 2) * 150,
        showList: false
      });
      this.getList();
    },

    //操作获取数据
    getList() {
      var that = this;
      that.$emit('tabtap', {
        detail: that.collegeCur
      });
    }

  }
};
</script>
<style>
/* components/scrolltab/index.wxss */

/*滚动Tab*/
/* ::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
} */

.space {
  width: 100%;
  height: 20rpx;
  background: #eee;
}

.kind_contain {
  width: 100%;
  height: 90rpx;
  display: flex;
  border-bottom: 1rpx solid #eee;
  background: #fff;
  align-items: center;
  position: relative;
}

.nav {
  height: 100%;
  white-space: nowrap;
  display: flex;
  box-sizing: border-box;
}

.nav-item {
  margin: 0 0.3rem 0 0.3rem;
  height: 100%;
  display: inline-block;
  font-size: 32rpx;  
}

.nav-text {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 4rpx;
  box-sizing: border-box;
}

.tab-on {
  color: #fbbd08;
  font-size: 32rpx !important;
  font-weight: 600;
  border-bottom: 4rpx solid #fbbd08 !important;
}

.kindlist_box {
  position: absolute;
  width: 100%;
  top: 90rpx;
  left: 0rpx;
  border-bottom: 1rpx solid #eee;
}

.kindlist_card {
  padding: 20rpx 20rpx 0 20rpx;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  background: #fff;
}

.list_grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.list-on {
  background: #fbbd08;
  color: #fff;
  border: none !important;
}

.fixed {
  position: fixed;
  left: 0rpx;
  top: 0rpx;/*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top));/*  #endif  */
}

.nofixed {
  height: 91rpx;
  width: 100%;
  background: #fff;
}


@media (prefers-color-scheme: dark) {
  /* DarkMode 下的样式 start */
  .kind_contain {
      background: #1b1b1b;
  }
  /* DarkMode 下的样式 end */
}
</style>