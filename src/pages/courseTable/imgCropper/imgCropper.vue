<template>
<view>
<image-cropper id="image-cropper" :limit_move="true" :disable_rotate="true" :width="width" :height="height" :imgSrc="src" :quality="1" @load="cropperLoad" @imageload="loadImage" @tapcut="clickCut"></image-cropper>
<view class="confirmBtn" @tap="confirmCut">确定</view>
</view>
</template>

<script>
// pages/imgCropper/imgCropper.js
const app = getApp();
import imageCropper from "../../../components/image-cropper/image-cropper";

export default {
  data() {
    return {
      src: '',
      width: app.globalData.windowWidth,
      //宽度
      height: app.globalData.windowHeight //高度

    };
  },

  components: {
    imageCropper
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取到image-cropper实例
    this.cropper = this.selectComponent("#image-cropper"); //开始裁剪

    this.setData({
      src: options.src
    });
    uni.showLoading({
      title: '请求中~'
    });
  },
  methods: {
    cropperLoad(e) {},

    loadImage(e) {
      uni.hideLoading(); //重置图片角度、缩放、位置

      this.cropper.imgReset();
    },

    clickCut(e) {
      //点击裁剪框阅览图片
      uni.previewImage({
        current: e.detail.url,
        // 当前显示图片的http链接
        urls: [e.detail.url] // 需要预览的图片http链接列表

      });
    },

    confirmCut: function () {
      this.cropper.getImg(res => {
        console.log(res);
        app.globalData.tempBackImg = res.url;
        uni.navigateBack({
          delta: 1
        });
      });
    }
  }
};
</script>
<style>
/* pages/imgCropper/imgCropper.wxss */
.confirmBtn {
    position: fixed;
    right: 8%;
    z-index: 888;
    background: #ff9900;
    width: 50px;
    height: 50px;
    border-radius: 30px;
    box-shadow: 2px 2px 2px #888888;
    opacity: 0.7;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 5%;
}

</style>