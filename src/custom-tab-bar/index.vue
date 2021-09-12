<template>
<!--miniprogram/custom-tab-bar/index.wxml-->
<view :style="'display:' + (isShow?'block':'none')">
  <view class="tab-bar">
    <!-- <view class="tab-bar-border"></view> -->
    <view v-for="(item, index) in list" :key="index" class="tab-bar-item" :data-path="item.pagePath" :data-index="index" @tap="switchTab">
      <!-- <cover-image src="{{selected === index ? item.selectedIconPath : item.iconPath}}"></cover-image> -->
      <view :class="'tab-bar-icon iconfont ' + item.iconfont" :style="'color: ' + (selected === index ? selectedColor : color)"></view>
      <view :style="'color: ' + (selected === index ? selectedColor : color)">{{item.text}}</view>
    </view>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      selected: 0,
      isShow: true,
      color: "#7A7E83",
      selectedColor: "#3cc51f",
      list: [{
        pagePath: "/pages/index/index",
        iconfont: "icon-index",
        text: "首页"
      }, {
        pagePath: "/pages/homeNews/homeNews",
        iconfont: "icon-zixun",
        text: "资讯"
      }, {
        pagePath: "/pages/my/my",
        iconfont: "icon-user",
        text: "个人中心"
      }]
    };
  },

  components: {},
  props: {},

  beforeMount() {},

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      uni.switchTab({
        url
      });
      this.setData({
        selected: data.index
      });
    }

  }
};
</script>
<style>
.tab-bar {
  bottom: 0;
  left: 0;
  right: 0;
  height: 10vh;
  background: white;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 9999999999;
  position: fixed;
}

.tab-bar-border {
  background-color: rgba(0, 0, 0, 0.33);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  transform: scaleY(0.5);
}

.tab-bar-icon{
  font-size: 50rpx!important;
}

.tab-bar-item {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

/* .tab-bar-item cover-image {
  width: 27px;
  height: 27px;
} */

.tab-bar-item {
  font-size: 34rpx;
}


/* iconfont */
@font-face {font-family: "iconfont";
  src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAQ0AAsAAAAACIQAAAPoAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDDAqEWIQQATYCJAMQCwoABCAFhG0HPhtoBxHVm6nJfhbYMW3A5Ttqj1orzqMfPZL2fZH/fF7+uXlJf/pSQzNTYyV+WmtIK3hVEC9/u/e3RSkECQQBZhCAxi3OeWCjItRIzp48+kJK4zSDB8DF4bQJHs4HymmOjVEXYDSBAhpr0JjCJYwN00sYyM/bgQCcHR90puWUQCZy+hGAnraWOsglObEnlciIVsvUBr0Y8log3MIKy+Lf048iMiCQCs7QgubURiS8o3eMTZ+c7g4RYKynBcBmAQzgAxCBrlZ9EVjq98Fwwy9yg3O1I3jHJiffUUg/7V8eQAQMaIPD14HYkACDd+TzEAsEyAMUMIiCEDdiigzggAtAA0dogy8qEoi7jqm2j46RuaFh3ZMv6qdfNY8/qx59Gnr0qOTxY9XTj5onH1Slq01qvTNXm63daF6xbp15w7o9GzbU7r48/cqiazOuDtOTJ+pjT0PqeM30x75wJFbTD+w7RPT0qebC40VPoxeRYk1Nat48gGpTy8c9ejS80Ky5cfXetZvMW9YtMm1as2F148K1ZsQxfXWcTTRjnbmyZg0MnMIXrtUoCguiF60xFVav1rGFhDgKajJ99XjzLcnQQLrj5hgY3ZVuS0ZGeRMjA52P60+J4xMianZyfOyEdEpiY9JJ9EmaqL+5u7h8Vd6Ootp7B/pcMneqTAYSC7buDv7pbH3yekpUaqQqqgQRhwZorz1bGn3GWuUv9G/e1isAyaZtqSXARr2rZdm6sx1z9UPuBeuvEEo1a7P9ctV21Rq73CRCvUYoW6HXuoSz3vrrJdTZLWgEdWdPCakoPILUpOnsRsTXp907tXhacV/AW9a3rKHXqCm4bh/7ETuNv+bn551XXpu9Vu7z19svbH/N7yuvj53n38y+8W0Z/I3pG+06/npqt1ypK2kztvGRq6EHAExuqK+sBZg8UrPZiBn8X/uZ8g90xKyDHs9q9GP+yYqIyl5+HOOxbXJDY3wCZAIwxhtnjCwQTZajEFuzfbplEGUX+kMAcBwwCcds5M0aQtPRyQCRmeYgmMIWGJkLUsT6gEQRAlpk8cB5S5+tMNYFhlobgJc5AIiBYyDQcw0YA7eRIvY1SMx8Ay0GYcCpyXhJhVtcf7kSCkYN8g9eda3xVHxJUl9ox1pQkRXjf0jRuyBPsmroiS3SGiPiZAtmA4a6Bh5gN6zrDnrqAipOHHNfpqlpu1OiumZ1wZVQMGqQf/Cqa01Ymi+177/QjrWgnrwG5Q8p+sYhT7IRyCe/HZX3LK3jZAtmg3sZ6hp4QC3Wrr+Dvr1TQMWJm+HtyxQVM2P5yf7C5grXAXA454m0UumM/ZBfxnY3RqS9bzUuqxU=') format('woff2');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-zixun:before {
  content: "\e001";
}

.icon-user:before {
  content: "\e002";
}

.icon-index:before {
  content: "\e003";
}

@media (prefers-color-scheme: dark) {
  /* DarkMode 下的样式 start */
  .tab-bar {
      background: #1b1b1b;
  }
  /* DarkMode 下的样式 end */
}
</style>