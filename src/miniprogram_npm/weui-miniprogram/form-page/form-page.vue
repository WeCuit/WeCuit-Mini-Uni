<template>
<view class="weui-form">
    <block v-if="title || subtitle">
      <view class="weui-form__text-area">
          <view class="weui-form__title">{{title}}</view>
          <view class="weui-form__desc">{{subtitle}}</view>
      </view>
    </block>
    <block v-else>
      <view class="weui-form__text-area">
        <slot name="title"></slot>
      </view>
    </block>
  <view class="weui-form__control-area">
    <slot></slot>
  </view>
  <view class="weui-form__tips-area">
    <slot name="tips"></slot>
  </view>
  <view class="weui-form__opr-area">
    <slot name="button"></slot>
  </view>
  <view class="weui-form__tips-area">
    <slot name="suffixtips"></slot>
  </view>
  <view class="weui-form__extra-area">
    <view class="weui-footer">
      <slot name="footer"></slot>
    </view>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      firstItem: null
    };
  },

  components: {},
  props: {
    title: {
      // Msg 标题
      type: String,
      default: ''
    },
    subtitle: {
      // icon 的 type
      type: String,
      default: ''
    }
  },
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  relations: {
    '../cells/cells': {
      type: 'descendant',

      linked(target) {
        if (!this.firstItem) {
          this.firstItem = target;
        }

        target.setOuterClass('weui-cells__group weui-cells__group_form weui-cells_form');

        if (target !== this.firstItem) {
          target.setOuterClass('weui-cells__group_wxss weui-cells__group weui-cells__group_form weui-cells_form');
        }
      }

    }
  },
  methods: {}
};
</script>
