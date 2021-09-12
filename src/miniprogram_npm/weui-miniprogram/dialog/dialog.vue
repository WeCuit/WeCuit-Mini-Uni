<template>
<view>
<view @tap="close" :class="'weui-mask ' + (!show ? 'weui-mask_hidden' : '' )" v-if="mask"></view>
<view v-if="show" @tap="close" :class="'weui-dialog__wrp ' + extClass">
    <view class="weui-dialog" @tap.stop="stopEvent">
      <view class="weui-dialog__hd">
        <view class="weui-dialog__title">{{title}}
          <slot name="title"></slot>
        </view>
      </view>
      <view class="weui-dialog__bd">
        <slot></slot>
      </view>
      <view class="weui-dialog__ft">
        <block v-if="buttons && buttons.length">
          <view v-for="(item, index) in buttons" :key="index" :class="'weui-dialog__btn ' + item.className + ' ' + item.extClass" hover-class="weui-active" :data-index="index" @tap="buttonTap">{{item.text}}</view>
        </block>
        <slot name="footer" v-else></slot>
      </view>
    </view>
</view>
</view>
</template>

<script>

export default {
  data() {
    return {
      innerShow: false
    };
  },

  components: {},
  props: {
    title: {
      // 弹窗标题，也可以通过 slot 自定义
      type: String,
      default: ''
    },
    extClass: {
      // 弹窗 class
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

  mounted() {
    const buttons = this.buttons;
    const len = buttons.length;
    buttons.forEach((btn, index) => {
      if (len === 1) {
        btn.className = 'weui-dialog__btn_primary';
      } else if (index === 0) {
        btn.className = 'weui-dialog__btn_default';
      } else {
        btn.className = 'weui-dialog__btn_primary';
      }
    });
    this.setData({
      buttons
    });
  },

  methods: {
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

    close() {
      const data = this;
      if (!data.maskClosable) return;
      this.setData({
        show: false
      });
      this.$emit('close', {
        detail: {}
      }, {});
    },

    stopEvent() {}

  }
};
</script>
<style>
.weui-dialog.weui-dialog_hidden{opacity:0;transform:scale3d(1, 1, 0)}.weui-dialog{opacity:1;-webkit-transform:scale3d(1, 1, 1) translateY(-50%);transform:scale3d(1, 1, 1) translateY(-50%);transition:all .2s ease-in}.weui-mask.weui-mask_hidden{opacity:0;transform:scale3d(1, 1, 0)}.weui-mask{opacity:1;transform:scale3d(1, 1, 1);transition:all .2s ease-in}
</style>