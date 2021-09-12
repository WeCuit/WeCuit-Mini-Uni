<template>
<view :class="'weui-grids ' + extClass">
  <block v-for="(item, index) in innerGrids" :key="index">
    <navigator class="weui-grid" :target="item.target" :url="item.url" :open-type="item.openType" :app-id="item.appId" :path="item.path" :extra-data="item.extraData" :version="item.version" :hover-class="item.hoverClass" :hover-stop-propagation="item.hoverStopPropagation" :hover-start-time="item.hoverStartTime" :hover-stay-time="item.hoverStayTime" @success="item.bindsuccess" @fail="item.bindfail" @complete="item.bindcomplete">
      <view class="weui-grid__icon">
        <image class="weui-grid__icon_img" :src="item.imgUrl" alt></image>
      </view>
      <view class="weui-grid__label">{{item.text}}</view>
    </navigator>
  </block>
</view>
</template>

<script>
const defaultGridProps = {
  target: 'self',
  url: '',
  openType: 'navigate',
  delta: 1,
  appId: '',
  path: '',
  extraData: '',
  version: 'release',
  hoverClass: 'navigator-hover',
  hoverStopPropagation: false,
  hoverStartTime: 50,
  hoverStayTime: 600,
  bindsuccess: () => {},
  bindfail: () => {},
  bindcomplete: () => {}
};

export default {
  data() {
    return {
      innerGrids: []
    };
  },

  components: {},
  props: {
    extClass: {
      type: String,
      default: ''
    },
    grids: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    grids: {
      handler: '_onGridsChange',
      immediate: true,
      deep: true
    }
  },
  options: {
    addGlobalClass: true,
    pureDataPattern: /^_/
  },

  mounted() {},

  methods: {
    _onGridsChange(grids) {
      if (grids) {
        this.setData({
          innerGrids: grids.map(grid => Object.assign({}, defaultGridProps, grid))
        });
      }
    },

    item() {
      console.log("占位：函数 item 未声明");
    },

    item() {
      console.log("占位：函数 item 未声明");
    },

    item() {
      console.log("占位：函数 item 未声明");
    }

  }
};
</script>
<style>
.weui-grid .weui-grid__icon_img{width:100%;height:100%}
</style>