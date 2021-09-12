<template>
<view>
<view :class="'weui-search-bar ' + (searchState ? 'weui-search-bar_focusing' : '') + ' ' + extClass">
    <view class="weui-search-bar__form">
        <view class="weui-search-bar__box">
            <icon class="weui-icon-search" type="search" size="12"></icon>
            <input type="text" class="weui-search-bar__input" :placeholder="placeholder" :value="value" :focus="focus" @blur="inputBlur" @focus="inputFocus" @input="inputChange">
            <text class="weui-icon-clear" hover-class="weui-active" v-if="value.length > 0" @tap="clearInput"></text>
        </view>
        <label class="weui-search-bar__label" @tap="showInput">
            <icon class="weui-icon-search" type="search" size="12"></icon>
            <text class="weui-search-bar__text">搜索</text>
        </label>
    </view>
    <view v-if="cancel && searchState" class="weui-search-bar__cancel-btn" @tap="hideInput">{{cancelText}}</view>
</view>
<mp-cells :ext-class="' ' + ('searchbar-result ' + extClass)" v-if="searchState && result.length > 0">
    <mp-cell v-for="(item, index) in result" :key="index" class="result" @tap="selectResult" body-class="weui-cell_primary" :data-index="index" hover>
        <view>{{item.text}}</view>
    </mp-cell>
</mp-cells>
</view>
</template>

<script>
import mpCells from "../cells/cells";
import mpCell from "../cell/cell";

export default {
  data() {
    return {
      result: [] // 搜索结果
      ,
      searchState: false
    };
  },

  components: {
    mpCells,
    mpCell
  },
  props: {
    extClass: {
      type: String,
      default: ''
    },
    focus: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '搜索'
    },
    value: {
      type: String,
      default: ''
    },
    search: {
      // 返回Promise的函数
      // @ts-ignore
      type: Function,
      default: null
    },
    throttle: {
      // 500ms内只会调用一次search函数
      type: Number,
      default: 500
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    cancel: {
      type: Boolean,
      default: true
    }
  },
  options: {
    addGlobalClass: true
  },

  /* @ts-ignore */
  lastSearch: Date.now(),

  // @ts-ignore
  beforeMount() {
    // @ts-ignore
    if (this.focus) {
      this.setData({
        searchState: true
      });
    }
  },

  methods: {
    clearInput() {
      // @ts-ignore
      this.setData({
        value: '',
        focus: true,
        result: []
      }); // @ts-ignore

      this.$emit('clear');
    },

    // @ts-ignore
    inputFocus(e) {
      // this.setData({
      //     searchState: true
      // })
      // @ts-ignore
      this.$emit('focus', {
        detail: e.detail
      });
    },

    // @ts-ignore
    inputBlur(e) {
      this.setData({
        focus: false
      });
      this.$emit('blur', {
        detail: e.detail
      });
    },

    showInput() {
      this.setData({
        focus: true,
        searchState: true
      });
    },

    hideInput() {
      this.setData({
        searchState: false
      });
      this.$emit('cancel');
    },

    // @ts-ignore
    inputChange(e) {
      this.setData({
        value: e.detail.value
      });
      this.$emit('input', {
        detail: e.detail
      });

      if (Date.now() - this.lastSearch < this.throttle) {
        return;
      }

      if (typeof this.search !== 'function') {
        return;
      }

      this.lastSearch = Date.now();
      this.timerId = setTimeout(() => {
        this.search(this.value).then(json => {
          this.setData({
            result: json
          });
        }).catch(err => {
          console.error('search error', err);
        });
      }, this.throttle);
    },

    // @ts-ignore
    selectResult(e) {
      const {
        index
      } = e.currentTarget.dataset;
      const item = this.result[index];
      this.$emit('selectresult', {
        detail: {
          index,
          item
        }
      });
    }

  }
};
</script>
<style>
.weui-search-bar__label text{display:inline-block;font-size:14px;vertical-align:middle}
</style>