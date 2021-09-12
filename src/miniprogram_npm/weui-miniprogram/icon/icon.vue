<template>
<view :class="extClass + ' weui-icon'" :style="'background:' + color + ';width:' + size + 'px;height:' + ( utils.ifSpecialIcon(icon) ? utils.double(size) : size) + 'px;mask-image:url(' + src + ');-webkit-mask-image:url(' + src + ');-moz-mask-image:url(' + src + ')'"></view>
</template>

<script module="utils" lang="wxs" src="./utils.wxs"></script>

<script>
import Base64 from './base64';
import iconData from './icondata';
const getFixedIconType = function (type) {
  // 兼容旧版本 typo
  return type === 'field' ? 'filled' : type;
};

export default {
  data() {
    return {
      src: '',
      height: 20,
      width: 20
    };
  },

  components: {},
  props: {
    extClass: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'outline'
    },
    icon: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 20
    },
    color: {
      type: String,
      default: '#000000'
    }
  },
  watch: {
    type: {
      handler: '_genSrcByType',
      immediate: true
    },
    icon: {
      handler: '_genSrcByIcon',
      immediate: true
    }
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    _genSrcByIcon(v) {
      this._genSrc(iconData[v][getFixedIconType(this.type)]);
    },

    _genSrcByType(v) {
      const iconDataItem = iconData[this.icon];
      if (iconDataItem) this._genSrc(iconDataItem[getFixedIconType(v)]);
    },

    _genSrc(rawData) {
      if (!rawData) return; // type 不存在

      const base64 = Base64.encode(rawData);
      this.setData({
        src: 'data:image/svg+xml;base64,' + base64
      });
    }

  }
};
</script>
<style>
.weui-icon{vertical-align:middle;display:inline-block;background:black;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat;-moz-mask-repeat:no-repeat;mask-size:cover;-webkit-mask-size:cover;-moz-mask-size:cover}
</style>