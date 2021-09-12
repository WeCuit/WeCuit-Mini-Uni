<template>
<view class="ul">
  <view class="li-item">
    <text class="li-text" :data-itemid="model.id" @tap="tapItem">{{model.text}}</text>
    <!-- <image src="https://open.oss.taozhi.cn/audiobook/asset/read/{{open?'shangla':'xiala'}}.png" class="menu-img" wx:if='{{ isBranch }}' ></image> -->
    <view v-if="isBranch" @tap="toggle" :class="'iconfont ' + (open?'icon-shangla':'icon-xiala')"></view>
  </view>
  <view style="padding-left: 50rpx;" v-if="isBranch" :hidden="!open">
    <mytree v-for="(item, index) in model.childMenus" :key="index" :model="item"></mytree>
  </view>
</view>
</template>

<script>
import mytree from "./mytree";

export default {
  data() {
    return {
      open: false,
      // 是否展开
      isBranch: false // 是否有子级

    };
  },

  components: {
    mytree
  },
  props: {
    model: {
      type: Object
    }
  },
  watch: {
    model: {
      handler: function (newVal, oldVal) {
        var that = this;
        that.setData({
          model: newVal,
          isBranch: Boolean(this.model.childMenus && this.model.childMenus.length)
        });

        if ("undefined" !== typeof this.model.open) {
          this.setData({
            open: this.model.open
          });
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted: function (e) {
    this.setData({
      isBranch: Boolean(this.model.childMenus && this.model.childMenus.length)
    });

    if ("undefined" !== typeof this.model.open) {
      this.setData({
        open: this.model.open
      });
    }
  },
  methods: {
    // 有子级
    toggle: function (e) {
      if (this.isBranch) {
        this.setData({
          open: !this.open
        });
      }
    },
    // 无子级
    tapItem: function (e) {
      var itemid = e.currentTarget.dataset.itemid;
      console.log("组件里点击的id: " + itemid);
      this.$emit("tapitem", {
        detail: {
          itemid: itemid
        }
      }, {
        bubbles: true,
        composed: true
      });
    }
  }
};
</script>
<style>
.ul .li-item {
  width: 100%;
  height: 100rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx 0 30rpx;
  font-size: 30rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  /* color: rgba(90, 90, 90, 1); */
  border-bottom: 0.5rpx solid rgba(213, 213, 214, 0.5);
}
.ul .li-item-child{
  padding-left:60rpx;
}
.ul > .li-item > .li-text {
  font-size: 30rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  /* color: rgba(169, 169, 169, 1); */
  width: 100%;
}
.menu-img{
  width: 23rpx;
  height: 23rpx;
}


@font-face {font-family: "iconfont";
  src:url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAALEAAsAAAAABrQAAAJ4AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCfgqBIIEaATYCJAMMCwgABCAFhG0HORvbBcguMYVrB1KixTmNXY0bNujlM8+jC37Ew/8ftfv+f7OuNtGyUiffjw8NxVGWUFQggYxIJIGtGM7lXOWAjdnxZXnq7oHVsyxt0pTSSfdpPI0/MPKVaYV79j/sFLDzQEqoLAzwioalJVI7NwEp6nPzPT///ZeSpMTf57mcXmNqFs0PlNNa24Yf9QKMJlCgYw2KrIQyTmF41UHuxHECXXsMnfuDs0s2luxxgXiSImDjQkJKsdwWmg1LU7xpaJeX0mBeo+/HFy/GFI3Knrp+3I/Z4u9UOx4CQpJAVzdQcY5JYtNYWOsJkdfTLfTtY/vKBn+4OH8HLrFXfiH+OlbZB8dUX+5I6RncmpKuUEAFzWLpGHPBGPNrQ8zLtjfbngzX9emcx6v+NaFWB19d+nWb9g+GYjveSn9v39ya+tXH1lZ+3J851qa4teVua7mq4X5w+uxUfS+30W9uWAfB/1MZmMezBJ8d/BFHwk3tcwSD/6UE69JQ286amsJTWKFqDvgKVCaF7diRqa/xpgVcS2hbjAi1rDJUbfuUZJyjoecSTW1X6DpzuLpnRuuJ7ODUM0EYe0cx9IFqrKUk4xMNS/9oGkcPXZsgW/YchpxajQFhDOETyEiV3HXTNK4+R3GXBzqvjgTXqGuZBtdyyuVDLFHPMaO+Fx4RB65VAQfkNMxzBZVWKUZkJUTV3LZ505usSBVs6o6GAgTFQOgJkCJKiQfNybTy+XNIuJML6A5SXfoa0mqyf+CyOADl0FBCpHt5pXZP8BDCAU5TCuCADEK5nAKq5kEpFCGWZESuMmc7jThqsNY3Fd+3B7rsrWqUqJFaz0lQijwYFBkEdsYA') format('woff2'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-shangla:before {
  content: "\effe";
}

.icon-xiala:before {
  content: "\efff";
}


</style>