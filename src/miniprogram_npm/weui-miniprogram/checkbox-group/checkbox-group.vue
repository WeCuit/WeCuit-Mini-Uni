<template>
<view>
<checkbox-group :class="extClass" v-if="multi" @change="checkedChange">
    <slot></slot>
</checkbox-group>
<radio-group :class="extClass" v-else @change="checkedChange">
    <slot></slot>
</radio-group>
</view>
</template>

<script>
import mpCells from "../cells/cells";

export default {
  data() {
    return {
      targetList: [],
      parentCell: null,
      checked: false
    };
  },

  components: {
    mpCells
  },
  props: {
    multi: {
      type: Boolean,
      default: true
    },
    extClass: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    }
  },
  watch: {
    multi: {
      handler: '_multiChange',
      immediate: true
    }
  },
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  relations: {
    '../checkbox/checkbox': {
      type: 'descendant',

      linked(target) {
        this.targetList.push(target);
        target.setMulti(this.multi);

        if (!this.firstItem) {
          this.firstItem = target;
        }

        if (target !== this.firstItem) {
          target.setOuterClass('weui-cell_wxss');
        }
      },

      unlinked(target) {
        let index = -1;
        this.targetList.forEach((item, idx) => {
          if (item === target) {
            index = idx;
          }
        });
        this.targetList.splice(index, 1);

        if (!this.targetList) {
          this.firstItem = null;
        }
      }

    },
    '../form/form': {
      type: 'ancestor'
    },
    '../cells/cells': {
      type: 'ancestor',

      linked(target) {
        if (!this.parentCell) {
          this.parentCell = target;
        }

        this.setParentCellsClass();
      },

      unlinked() {
        this.parentCell = null; // 方便内存回收
      }

    }
  },
  methods: {
    checkedChange(checked, target) {
      if (this.multi) {
        const vals = [];
        this.targetList.forEach(item => {
          if (item.data.checked) {
            vals.push(item.data.value);
          }
        });
        this.$emit('change', {
          detail: {
            value: vals
          }
        });
      } else {
        let val = '';
        this.targetList.forEach(item => {
          if (item === target) {
            val = item.data.value;
          } else {
            item.setData({
              checked: false
            });
          }
        });
        this.$emit('change', {
          detail: {
            value: val
          }
        }, {});
      }
    },

    setParentCellsClass() {
      const className = this.multi ? 'weui-cells_checkbox' : '';

      if (this.parentCell) {
        this.parentCell.setCellsClass(className);
      }
    },

    _multiChange(multi) {
      this.targetList.forEach(target => {
        target.setMulti(multi);
      });

      if (this.parentCell) {
        this.parentCell.setCellMulti(multi);
      }

      return multi;
    }

  }
};
</script>
