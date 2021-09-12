<template>
<view :class="'weui-msg ' + extClass">
  <view class="weui-msg__icon-area">
    <icon :type="type" :size="size" v-if="type"></icon>
    <image class="weui-msg__icon-img" :src="icon" mode="aspectFit" v-else-if="icon"></image>
  </view>
  <view class="weui-msg__text-area">
    <view class="weui-msg__title">{{title}}</view>
    <view class="weui-msg__desc">
      {{desc}}
      <slot name="desc" v-if="!desc"></slot>
    </view>
    <slot name="extend"></slot>
  </view>
  <view class="weui-msg__opr-area">
    <view class="weui-btn-area">
      <slot name="handle"></slot>
    </view>
  </view>
  <view class="weui-msg__tips-area">
    <view class="weui-msg__tips">
      <slot name="tips"></slot>
    </view>
  </view>
  <view class="weui-msg__extra-area">
    <view class="weui-footer">
      <slot name="footer"></slot>
    </view>
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
    title: {
      // Msg 标题
      type: String,
      default: ''
    },
    type: {
      // icon 的 type
      type: String,
      default: ''
    },
    icon: {
      // 可以自行设置 icon, 设置icon 之后，type 失效
      type: String,
      default: ''
    },
    desc: {
      // 描述
      type: String,
      default: ''
    },
    extClass: {
      type: String,
      default: ''
    },
    size: {
      // 可以自行设置 icon, 设置icon 之后，type 失效
      type: Number,
      default: 64
    }
  },
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  methods: {}
};
</script>
<style>
.weui-msg__icon-img{width:190rpx;height:190rpx}
</style>