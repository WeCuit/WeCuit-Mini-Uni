<template>
<view :class="show ? 'weui-show' :'weui-hidden'">
  <view class="weui-mask init" v-if="mask" @tap="close" catch:touchmove="onMaskMouseMove" data-type="tap"></view>
  <view :class="'weui-half-screen-dialog ' + extClass">
    <view class="weui-half-screen-dialog__hd">
      <view v-if="closabled" class="weui-half-screen-dialog__hd__side" @tap="close" data-type="close">
        <view class="weui-icon-btn weui-icon-btn_close" hover-class="weui-active">关闭</view>
      </view>
      <view class="weui-half-screen-dialog__hd__main">
        <block v-if="title">
          <text class="weui-half-screen-dialog__title">{{title}}</text>
          <text class="weui-half-screen-dialog__subtitle">{{subTitle}}</text>
        </block>
        <block v-else>
          <view class="weui-half-screen-dialog__title"><slot name="title"></slot></view>
        </block>
      </view>
      <view class="weui-half-screen-dialog__hd__side">
        <view class="weui-icon-btn weui-icon-btn_more" hover-class="weui-active">更多</view>
      </view>
    </view>
    <view class="weui-half-screen-dialog__bd">
      <block v-if="desc">
        <view class="weui-half-screen-dialog__desc">{{desc}}</view>
        <view class="weui-half-screen-dialog__tips">{{tips}}</view>
      </block>
      <slot name="desc" v-else></slot>
    </view>
    <view class="weui-half-screen-dialog__ft">
      <block v-if="buttons && buttons.length">
        <button v-for="(item, index) in buttons" :key="index" :type="item.type" :class="'weui-btn ' + item.className" :data-index="index" @tap="buttonTap">{{item.text}}</button>
      </block>
      <slot name="footer" v-else></slot>
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
    closabled: {
      // 是否具有关闭标签
      type: Boolean,
      default: true
    },
    title: {
      // 标题，也可以通过 slot 自定义
      type: String,
      default: ''
    },
    subTitle: {
      // 副标题，也可以通过 slot 自定义
      type: String,
      default: ''
    },
    extClass: {
      // 弹窗 class
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    tips: {
      type: String,
      default: ''
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    mask: {
      // 是否需要 遮罩层
      type: Boolean,
      default: true
    },
    show: {
      // 是否开启弹窗
      type: Boolean,
      default: false
    },
    buttons: {
      type: Array,
      default: () => [] // {text, extClass}

    }
  },
  watch: {
    show: {
      handler: '_showChange',
      immediate: true
    }
  },
  options: {
    multipleSlots: true,
    // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true
  },
  methods: {
    close(e) {
      const {
        type
      } = e.currentTarget.dataset;

      if (this.maskClosable || type === 'close') {
        this.setData({
          show: false
        }); // 关闭弹窗回调事件

        this.$emit('close');
      }
    },

    buttonTap(e) {
      const {
        index
      } = e.currentTarget.dataset;
      this.$emit('buttontap', {
        detail: {
          index,
          item: this.buttons[index]
        }
      }, {});
    },

    onMaskMouseMove() {// do nothing
    }

  }
};
</script>
<style>
.weui-mask,.weui-half-screen-dialog{transition:all .3s}.weui-hidden .weui-mask{visibility:hidden;opacity:0}.weui-hidden .weui-half-screen-dialog{transform:translateY(100%)}.weui-show .weui-mask{opacity:1;visibility:visible}.weui-show .weui-half-screen-dialog{transform:translateY(0%)}
</style>