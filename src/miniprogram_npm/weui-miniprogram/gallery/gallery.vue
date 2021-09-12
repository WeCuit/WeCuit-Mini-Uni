<template>
<view :class="'weui-gallery ' + (show ? 'weui-gallery_show' : '') + ' ' + extClass">
  <view class="weui-gallery__info">{{current+1}}/{{currentImgs.length}}</view>
  <swiper class="weui-gallery__img__wrp" @tap="hideGallery" :indicator-dots="false" @change="change" :current="current" :autoplay="false" :duration="500">
    <block v-for="(item, index) in currentImgs" :key="index">
      <swiper-item>
        <image mode="aspectFit" class="weui-gallery__img" :src="item"></image>
      </swiper-item>
    </block>
  </swiper>
  <view class="weui-gallery__opr" v-if="showDelete">
    <navigator @tap="deleteImg" class="weui-gallery__del">删除</navigator>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      currentImgs: []
    };
  },

  components: {},
  props: {
    imgUrls: {
      type: Array,
      default: () => []
    },
    showDelete: {
      // 是否显示delete按钮
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: true
    },
    current: {
      type: Number,
      default: 0
    },
    hideOnClick: {
      type: Boolean,
      default: true
    },
    extClass: {
      type: String,
      default: ''
    }
  },
  watch: {
    imgUrls: {
      handler: function (newVal) {
        this.setData({
          currentImgs: newVal
        });
      },
      immediate: true,
      deep: true
    }
  },
  options: {
    addGlobalClass: true
  },

  mounted() {
    const data = this;
    this.setData({
      currentImgs: data.imgUrls
    });
  },

  methods: {
    change(e) {
      this.setData({
        current: e.detail.current
      });
      this.$emit('change', {
        detail: {
          current: e.detail.current
        }
      }, {});
    },

    deleteImg() {
      const data = this;
      const imgs = data.currentImgs;
      const url = imgs.splice(data.current, 1);
      this.$emit('delete', {
        detail: {
          url: url[0],
          index: data.current
        }
      }, {});

      if (imgs.length === 0) {
        // @ts-ignore
        this.hideGallery();
        return;
      }

      this.setData({
        current: 0,
        currentImgs: imgs
      });
    },

    hideGallery() {
      const data = this;

      if (data.hideOnClick) {
        this.setData({
          show: false
        });
        this.$emit('hide', {
          detail: {}
        }, {});
      }
    }

  }
};
</script>
<style>
.weui-gallery{display:none}.weui-gallery_show.weui-gallery{display:flex}
</style>