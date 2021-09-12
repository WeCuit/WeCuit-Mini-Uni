<template>
<view :class="'weui-toptips ' + className + ' ' + extClass + ' ' + (show ? 'weui-toptips_show' :  '')">
    <block v-if="msg">{{msg}}</block>
    <block v-else>
        <slot></slot>
    </block>
</view>
</template>

<script>

export default {
  data() {
    return {
      typeClassMap: {
        warn: 'weui-toptips_warn',
        info: 'weui-toptips_info',
        success: 'weui-toptips_success',
        error: 'weui-toptips_error'
      },
      className: ""
    };
  },

  components: {},
  props: {
    type: {
      type: String,
      default: 'error'
    },
    show: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: ''
    },
    delay: {
      type: Number,
      default: 2000
    },
    extClass: {
      type: String,
      default: ''
    }
  },
  watch: {
    type: {
      handler: '_typeChange',
      immediate: true
    },
    show: {
      handler: '_showChange',
      immediate: true
    }
  },
  options: {
    addGlobalClass: true
  },

  beforeMount() {
    const data = this;
    this.setData({
      className: data.typeClassMap[data.type] || ''
    });
  },

  methods: {
    _typeChange(newVal) {
      this.setData({
        className: this.typeClassMap[newVal] || ''
      });
      return newVal;
    },

    _showChange(newVal) {
      this._showToptips(newVal);
    },

    _showToptips(newVal) {
      if (newVal && this.delay) {
        setTimeout(() => {
          this.setData({
            show: false
          }, () => {
            // tooltips 隐藏了，触发 hide 事件
            this.$emit('hide', {
              detail: {}
            }, {});
          });
        }, this.delay);
      }

      this.setData({
        show: newVal
      });
    }

  }
};
</script>
<style>
.weui-toptips_show.weui-toptips{display:block}.weui-toptips_show{-webkit-transform:translateZ(0) translateY(0);transform:translateZ(0) translateY(0);opacity:1}.weui-toptips_success{background-color:var(--weui-BRAND)}.weui-toptips_error{background-color:var(--weui-RED)}.weui-toptips_info{background-color:var(--weui-BLUE)}
</style>