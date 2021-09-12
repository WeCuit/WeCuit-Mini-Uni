<template>
<view :class="extClass + ' weui-cells__group ' + outerClass + ' ' + childClass">
    <view v-if="title" class="weui-cells__title">{{title}}</view>
    <view :class="'weui-cells weui-cells_after-title ' + (checkboxCount > 0 && checkboxIsMulti ? 'weui-cells_checkbox' : '')">
        <slot></slot>
    </view>
    <view v-if="footer" class="weui-cells__tips">{{footer}}</view>
    <slot name="footer" v-else></slot>
</view>
</template>

<script>

export default {
  data() {
    return {
      firstItem: null,
      checkboxCount: 0,
      checkboxIsMulti: false,
      outerClass: '',
      childClass: ''
    };
  },

  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    extClass: {
      type: String,
      default: ''
    },
    footer: {
      type: String,
      default: ''
    }
  },
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  relations: {
    '../cell/cell': {
      type: 'descendant',

      linked(target) {
        if (!this.firstItem) {
          this.firstItem = target;
        }

        if (target !== this.firstItem) {
          target.setOuterClass('weui-cell_wxss');
        }
      }

    },
    '../form-page/form-page': {
      type: 'ancestor'
    },
    '../checkbox-group/checkbox-group': {
      type: 'descendant',

      linked(target) {
        this.setData({
          checkboxCount: this.checkboxCount + 1,
          checkboxIsMulti: target.data.multi
        });
      },

      unlinked(target) {
        this.setData({
          checkboxCount: this.checkboxCount - 1,
          checkboxIsMulti: target.data.multi
        });
      }

    }
  },
  methods: {
    setCellMulti(multi) {
      this.setData({
        checkboxIsMulti: multi
      });
    },

    setCellsClass(className) {
      this.setData({
        childClass: className
      });
    },

    setOuterClass(className) {
      this.setData({
        outerClass: className
      });
    }

  }
};
</script>
<style>
.weui-cells__group_wxss.weui-cells__group_wxss .weui-cells__title{margin-top:24px}.weui-cells__group_form .weui-cells__tips{margin-top:8px;padding:0 32px;color:var(--weui-FG-1)}
</style>