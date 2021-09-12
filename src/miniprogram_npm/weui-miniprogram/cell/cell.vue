<template>
<view>
<block v-if="link">
    <view @tap="navigateTo" :class="'weui-cell weui-cell_access ' + extClass + ' ' + outerClass + '' + (inForm ? ' weui-cell-inform' : '') + '' + (inline ? '' : ' .weui-cell_label-block')" :hover-class="hover ? 'weui-cell_active weui-active' : extHoverClass">
        <view v-if="hasHeader" :class="'weui-cell__hd ' + iconClass">
            <block v-if="icon">
                <image :src="icon" class="weui-cell__icon" mode="aspectFit"></image>
            </block>
            <block v-else>
                <slot name="icon"></slot>
            </block>
            <block v-if="inForm">
                <block v-if="title"><view class="weui-label">{{title}}</view></block>
                <block v-else>
                    <slot name="title"></slot>
                </block>
            </block>
            <block v-else>
                <block v-if="title">{{title}}</block>
                <block v-else>
                    <slot name="title"></slot>
                </block>
            </block>
        </view>
        <view v-if="hasBody" class="weui-cell__bd">
            <block v-if="value">{{value}}</block>
            <block v-else>
                <slot></slot>
            </block>
        </view>
        <view v-if="hasFooter" :class="'weui-cell__ft weui-cell__ft_in-access ' + footerClass">
            <block v-if="footer">{{footer}}</block>
            <block v-else>
                <slot name="footer"></slot>
            </block>
        </view>
    </view>
</block>
<block v-else>
    <view @tap="navigateTo" :class="'weui-cell ' + (showError && error ? 'weui-cell_warn' : '') + ' ' + (inForm ? 'weui-cell-inform' : '') + ' ' + extClass + ' ' + outerClass" :hover-class="hover ? 'weui-cell_active weui-active' : extHoverClass">
        <view v-if="hasHeader" :class="'weui-cell__hd ' + iconClass">
            <block v-if="icon">
                <image :src="icon" class="weui-cell__icon" mode="aspectFit"></image>
            </block>
            <block v-else>
                <slot name="icon"></slot>
            </block>
            <block v-if="inForm">
                <block v-if="title"><view class="weui-label">{{title}}</view></block>
                <block v-else>
                    <slot name="title"></slot>
                </block>
            </block>
            <block v-else>
                <block v-if="title">{{title}}</block>
                <block v-else>
                    <slot name="title"></slot>
                </block>
            </block>
        </view>
        <view v-if="hasBody" :class="'weui-cell__bd ' + bodyClass">
            <block v-if="value">{{value}}</block>
            <block v-else>
                <slot></slot>
            </block>
        </view>
        <view v-if="hasFooter" :class="'weui-cell__ft ' + footerClass">
            <block v-if="footer">{{footer}}</block>
            <block v-else>
                <slot name="footer"></slot>
            </block>
            <icon v-if="showError && error" type="warn" size="23" color="#E64340"></icon>
        </view>
    </view>
</block>
</view>
</template>

<script>
import mpCells from "../cells/cells";

export default {
  data() {
    return {
      inForm: false,
      outerClass: "",
      error: ""
    };
  },

  components: {
    mpCells
  },
  props: {
    hover: {
      type: Boolean,
      default: false
    },
    link: {
      type: Boolean,
      default: false
    },
    extClass: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: ''
    },
    bodyClass: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    title: {
      // 和icon二选一，都是放在cell_hd里面
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    showError: {
      type: Boolean,
      default: false
    },
    prop: {
      // 校验的属性，给父元素form使用
      type: String,
      default: ''
    },
    url: {
      // 在link为true的时候有效，表示navigator的跳转url
      type: String,
      default: ''
    },
    footerClass: {
      type: String,
      default: ''
    },
    footer: {
      type: String,
      default: ''
    },
    inline: {
      // 左右布局样式还是上下布局
      type: Boolean,
      default: true
    },
    hasHeader: {
      type: Boolean,
      default: true
    },
    hasFooter: {
      type: Boolean,
      default: true
    },
    hasBody: {
      type: Boolean,
      default: true
    },
    extHoverClass: {
      // 提供给需要定制 hover-class 的场景，要求 hover 为 false
      type: String,
      default: ''
    }
  },
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  relations: {
    '../form/form': {
      type: 'ancestor'
    },
    '../cells/cells': {
      type: 'ancestor'
    }
  },
  methods: {
    setError(error) {
      this.setData({
        error: error || false
      });
    },

    setInForm() {
      this.setData({
        inForm: true
      });
    },

    setOuterClass(className) {
      this.setData({
        outerClass: className
      });
    },

    navigateTo() {
      const data = this;

      if (data.url && data.link) {
        uni.navigateTo({
          url: data.url,
          success: res => {
            this.$emit('navigatesuccess', {
              detail: res
            }, {});
          },
          fail: fail => {
            this.$emit('navigateerror', {
              detail: fail
            }, {});
          }
        });
      }
    }

  }
};
</script>
<style>
.weui-cell_wxss.weui-cell_wxss:before{display:block}
</style>