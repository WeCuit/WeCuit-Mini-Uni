<template>
<view :class="'wx_loading_view ' + (animated ? 'wx_loading_view__animated' : '') + ' ' + (!show ? 'wx_loading_view__hide' : '') + ' ' + extClass" :style="animated ? 'transition: height ' + duration + 'ms ease;' : ''" id="wx_loading_view">
    <view v-if="type==='dot-white'" class="loading wx_dot_loading wx_dot_loading_white">
    </view>
    <view v-else-if="type==='dot-gray'" class="loading wx_dot_loading"></view>
    <view v-else-if="type==='circle'" class="weui-loadmore">
        <view class="weui-loading"></view>
        <view class="weui-loadmore__tips">{{tips}}</view>
    </view>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    extClass: {
      type: String,
      default: ''
    },
    show: {
      // 默认显示出来
      type: Boolean,
      default: true
    },
    animated: {
      type: Boolean,
      default: false
    },
    duration: {
      // 过渡动画时间
      type: Number,
      default: 350
    },
    type: {
      type: String,
      default: 'dot-gray' // 取值dot-white、dot-gray、circle

    },
    tips: {
      // type是circle的时候才有效
      type: String,
      default: '加载中'
    }
  },
  options: {
    addGlobalClass: true
  },
  methods: {}
};
</script>
<style>
.wx_loading_view{display:flex;justify-content:center;align-items:center;overflow:hidden}.wx_loading_view__hide{height:0 !important;display:none}.wx_loading_view__animated.wx_loading_view__hide{display:flex}.loading{color:rgba(255,255,255,0.9);font-size:17px;text-align:center}.loading_view_translation{transition:height .2s .3s ease}
</style>