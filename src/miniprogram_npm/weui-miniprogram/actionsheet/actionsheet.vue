<template>
<view>
<view v-if="mask" :class="'weui-mask ' + (show ? '' : 'weui-mask_hidden') + ' ' + maskClass" @tap="closeActionSheet"></view>
<view :class="'weui-actionsheet ' + (show ? 'weui-actionsheet_toggle' : '') + ' ' + extClass">
    <!-- 标题 -->
    <block v-if="title"> 
        <view class="weui-actionsheet__title">
            <view class="weui-actionsheet__title-text">{{title}}</view>
        </view>
    </block>
    <slot name="title" v-else></slot>
    <view v-for="(actionItem, index) in actions" :key="index" :class="!showCancel && index === actions.length-1 ? 'weui-actionsheet__action' : 'weui-actionsheet__menu'">
        <block v-if="utils.isNotSlot(actionItem)">
            <view v-for="(item, actionIndex) in actionItem" :key="actionIndex" :class="'weui-actionsheet__cell ' + (item.type === 'warn' ? 'weui-actionsheet__cell_warn' : '' )" hover-class="weui-active" :data-groupindex="index" :data-index="actionIndex" :data-value="item.value" @tap="buttonTap">
                {{item.text}}
            </view>  
        </block>
        
<!-- #ifdef H5 -->
<slot :name="actionItem" v-else></slot>
<!-- #endif -->

<!-- #ifndef H5 -->
<slot name="{{actionItem}}"></slot>
<!-- #endif -->


    </view>
    <!-- 取消按钮 -->
    <view class="weui-actionsheet__action" v-if="showCancel">
        <view class="weui-actionsheet__cell" hover-class="weui-active" data-type="close" id="iosActionsheetCancel" @tap="closeActionSheet">{{cancelText}}</view>
    </view>
</view>
</view>
</template>

<script module="utils" lang="wxs" src="./utils.wxs"></script>

<script>

export default {
  data() {
    return {
      actionIndex: ""
    };
  },

  components: {},
  props: {
    title: {
      // 标题
      type: String,
      default: ''
    },
    showCancel: {
      // 是否显示取消按钮
      type: Boolean,
      default: true
    },
    cancelText: {
      // 取消按钮文案
      type: String,
      default: '取消'
    },
    maskClass: {
      // 遮罩层class
      type: String,
      default: ''
    },
    extClass: {
      // 弹出窗 class
      type: String,
      default: ''
    },
    maskClosable: {
      // 点击遮罩 关闭 actionsheet
      type: Boolean,
      default: true
    },
    mask: {
      // 是否需要 遮罩层
      type: Boolean,
      default: true
    },
    show: {
      // 是否开启 actionsheet
      type: Boolean,
      default: false
    },
    actions: {
      // actions 列表
      type: Array,
      default: () => []
    }
  },
  watch: {
    actions: {
      handler: '_groupChange',
      immediate: true,
      deep: true
    }
  },
  options: {
    multipleSlots: true,
    // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true
  },
  methods: {
    _groupChange(e) {
      // 支持 一维数组 写法
      if (e.length > 0 && typeof e[0] !== 'string' && !(e[0] instanceof Array)) {
        this.setData({
          actions: [this.actions]
        });
      }
    },

    buttonTap(e) {
      const {
        value,
        groupindex,
        index
      } = e.currentTarget.dataset;
      this.$emit('actiontap', {
        detail: {
          value,
          groupindex,
          index
        }
      });
    },

    closeActionSheet(e) {
      const {
        type
      } = e.currentTarget.dataset;

      if (this.maskClosable || type) {
        // 点击 action 里面的 取消
        this.setData({
          show: false
        }); // 关闭回调事件

        this.$emit('close');
      }
    }

  }
};
</script>
<style>
.weui-mask.weui-mask_hidden{opacity:0;transform:scale3d(1, 1, 0)}.weui-mask{opacity:1;transform:scale3d(1, 1, 1);transition:all .3s}
</style>