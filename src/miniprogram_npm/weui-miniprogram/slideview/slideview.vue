<template>
<!-- slide-view/slide-view.wxml -->

<view :class="'weui-slideview weui-movable-view ' + (icon ? 'weui-slideview_icon' : '') + ' ' + extClass" style="width: 100%;height: 100%;">
    <view @transitionend="handler.transitionEnd" :show="show" :change:show="handler.showChange" :rebounce="rebounce" :change:rebounce="handler.rebounceChange" :duration="duration" :change:duration="handler.durationChange" :change:disable="handler.disableChange" :disable="disable" :change:prop="handler.sizeReady" :prop="size" @touchstart="handler.touchstart" @touchmove="handler.touchmove" @touchend="handler.touchend" class="weui-slideview__left left" style="width:100%;">
      <slot></slot>
    </view>
    <view class="weui-slideview__right right">
      <view class="weui-slideview__buttons" style="height:100%;width:100%;" v-if="buttons && buttons.length">
        <view v-for="(item, index) in buttons" :key="index" :class="'btn weui-slideview__btn__wrp ' + item.className + ' ' + item.extClass">
          <view @tap="handler.hideButton" :data-data="item.data" :data-index="index" class="weui-slideview__btn">
            <text v-if="!icon">{{item.text}}</text>
            <image class="weui-slideview__btn__icon" v-else :src="item.src"></image>
          </view>
        </view>
      </view>
    </view>
</view>
</template>

<script module="handler" lang="wxs" src="./slideview.wxs"></script>

<script>

export default {
  data() {
    return {
      size: null
    };
  },

  components: {},
  props: {
    extClass: {
      type: String,
      default: ''
    },
    buttons: {
      type: Array,
      default: () => []
    },
    disable: {
      type: Boolean,
      default: false
    },
    icon: {
      // 是否是icon
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 350 // 动画市场，单位ms

    },
    throttle: {
      type: Number,
      default: 40
    },
    rebounce: {
      type: Number,
      default: 0 // 回弹距离

    }
  },
  watch: {
    buttons: {
      handler: function () {
        this.addClassNameForButton();
      },
      immediate: true,
      deep: true
    }
  },

  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  /**
   * 组件的方法列表
   */
  mounted() {
    // @ts-ignore
    this.updateRight();
    this.addClassNameForButton();
  },

  methods: {
    updateRight() {
      // 获取右侧滑动显示区域的宽度
      const data = this;
      const query = uni.createSelectorQuery().in(this);
      query.select('.left').boundingClientRect(res => {
        const btnQuery = uni.createSelectorQuery().in(this);
        btnQuery.selectAll('.btn').boundingClientRect(rects => {
          this.setData({
            size: {
              buttons: rects,
              button: res,
              show: data.show,
              disable: data.disable,
              throttle: data.throttle,
              rebounce: data.rebounce
            }
          });
        }).exec();
      }).exec();
    },

    addClassNameForButton() {
      // @ts-ignore
      const {
        buttons,
        icon
      } = this;
      buttons.forEach(btn => {
        if (icon) {
          btn.className = '';
        } else if (btn.type === 'warn') {
          btn.className = 'weui-slideview__btn-group_warn';
        } else {
          btn.className = 'weui-slideview__btn-group_default';
        }
      });
      this.setData({
        buttons
      });
    },

    buttonTapByWxs(data) {
      this.$emit('buttontap', {
        detail: data
      }, {});
    },

    hide() {
      this.$emit('hide', {
        detail: {}
      }, {});
    },

    show() {
      this.$emit('show', {
        detail: {}
      }, {});
    },

    transitionEnd() {},

    handler() {
      console.log("占位：函数 handler 未声明");
    },

    handler() {
      console.log("占位：函数 handler 未声明");
    },

    handler() {
      console.log("占位：函数 handler 未声明");
    },

    handler() {
      console.log("占位：函数 handler 未声明");
    },

    handler() {
      console.log("占位：函数 handler 未声明");
    }

  }
};
</script>
