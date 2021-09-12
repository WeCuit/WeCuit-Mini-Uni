<template>
<mp-cell :has-footer="!multi" :has-header="multi" @tap="checkedChange" :ext-class="'weui-check__label ' + outerClass + ' ' + extClass + ' ' + (!multi ? '^weui-cell_radio' : '^weui-cell_checkbox')" ext-hover-class="weui-active">

  <view slot="icon" v-if="multi">
    <checkbox :value="value" :checked="checked" :disabled="disabled" :color="color" class="weui-check">
    </checkbox>
    <!-- 未勾选 -->
    <icon class="weui-icon-checked"></icon>
  </view>
  <view>{{label}}</view>
  <view slot="footer" v-if="!multi">
    <radio :value="value" :checked="checked" :disabled="disabled" :color="color" class="weui-check"></radio>
    <!-- 已勾选 -->
    <icon class="weui-icon-checked"></icon>
  </view>
</mp-cell>
</template>

<script>
import mpCell from "../cell/cell";
import mpCheckboxGroup from "../checkbox-group/checkbox-group";

export default {
  data() {
    return {
      color: "",
      disabled: "",
      outerClass: ""
    };
  },

  components: {
    mpCell,
    mpCheckboxGroup
  },
  props: {
    multi: {
      type: Boolean,
      default: true
    },
    checked: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'label'
    },
    extClass: {
      type: String,
      default: ''
    }
  },
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  relations: {
    '../checkbox-group/checkbox-group': {
      type: 'ancestor',

      linked(target) {
        this.group = target;
      },

      unlinked() {
        this.group = null;
      }

    }
  },
  methods: {
    setMulti(multi) {
      this.setData({
        multi
      });
    },

    setOuterClass(className) {
      this.setData({
        outerClass: className
      });
    },

    checkedChange() {
      if (this.multi) {
        const checked = !this.checked;
        this.setData({
          checked
        });

        if (this.group) {
          this.group.checkedChange(checked, this);
        }
      } else {
        const checked = this.checked;
        if (checked) return;
        this.setData({
          checked: true
        });

        if (this.group) {
          this.group.checkedChange(checked, this);
        }
      }

      this.$emit('change', {
        detail: {
          value: this.value,
          checked: this.checked
        }
      });
    }

  }
};
</script>
<style>
.weui-cell_radio .weui-check+.weui-icon-checked{color:transparent}.weui-check[checked]+.weui-icon-checked{color:var(--weui-BRAND);-webkit-mask-image:url(data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M8.657%2018.435L3%2012.778l1.414-1.414%204.95%204.95L20.678%205l1.414%201.414-12.02%2012.021a1%201%200%2001-1.415%200z%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E);mask-image:url(data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M8.657%2018.435L3%2012.778l1.414-1.414%204.95%204.95L20.678%205l1.414%201.414-12.02%2012.021a1%201%200%2001-1.415%200z%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E)}
</style>