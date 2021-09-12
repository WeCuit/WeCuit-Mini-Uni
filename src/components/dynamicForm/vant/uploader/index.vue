<template>
<!-- <wxs src="../wxs/utils.wxs" module="utils" /> -->

<view class="van-uploader">
  <view class="van-uploader__wrapper">
    <!-- 预览样式 -->
    <view v-for="(item, index) in lists" :key="index" v-if="previewImage" class="van-uploader__preview">
      <image v-if="item.isImage" :mode="imageFit" :src="item.url || item.path" :alt="item.name || ('图片' + index)" class="van-uploader__preview-image" :style="'width: ' + previewSize + '; height: ' + previewSize + ';'" :data-url="item.url || item.path" @tap="doPreviewImage"></image>
      <view v-else-if="item.isVideo" class="van-uploader__preview" style="width:280rpx; height:280rpx;">
        <video class="van-uploader__preview-video" :data-url="item.url || item.path" style="width:280rpx; height:280rpx;" :src="item.url || item.tempFilePath" controls></video>
      </view>
      <view v-else class="van-uploader__file" :style="'width: ' + previewSize + '; height: ' + previewSize + ';'">
        <van-icon name="description" class="van-uploader__file-icon"></van-icon>
        <view class="van-uploader__file-name van-ellipsis">{{ item.name || item.url || item.path }}</view>
      </view>
      <van-icon v-if="deletable && !disabled" name="clear" size="40" class="van-uploader__preview-delete" :data-index="index" @tap="deleteItem"></van-icon>
    </view>

    <!-- 上传样式 -->
    <block v-if="isInCount && !disabled">
      <view class="van-uploader__slot" @tap="startUpload">
        <slot></slot>
      </view>

      <!-- 默认上传样式 -->
      <view class="van-uploader__upload" :style="'width: ' + previewSize + '; height: ' + previewSize + ';'" @tap="startUpload">
        <van-icon name="plus" size="40" class="van-uploader__upload-icon"></van-icon>
        <text v-if="uploadText" class="van-uploader__upload-text">{{ uploadText }}</text>
      </view>
    </block>
  </view>
</view>
</template>

<script>
import { VantComponent } from '../common/component';
import { isImageFile } from './utils';
import vanIcon from "../icon/index";

export default {
  data() {
    return {
      lists: [],
      computedPreviewSize: '',
      isInCount: true
    };
  },

  components: {
    vanIcon
  },
  props: {
    disabled: Boolean,
    multiple: Boolean,
    uploadText: String,
    useBeforeRead: Boolean,
    previewSize: {
      type: null,
      default: 90
    },
    name: {
      type: [Number, String],
      default: ''
    },
    accept: {
      type: String,
      default: 'image'
    },
    sizeType: {
      type: Array,
      default: () => ['original', 'compressed']
    },
    capture: {
      type: Array,
      default: () => ['album', 'camera']
    },
    fileList: {
      type: Array,
      default: () => []
    },
    maxSize: {
      type: Number,
      default: Number.MAX_VALUE
    },
    maxCount: {
      type: Number,
      default: 100
    },
    deletable: {
      type: Boolean,
      default: true
    },
    previewImage: {
      type: Boolean,
      default: true
    },
    previewFullImage: {
      type: Boolean,
      default: true
    },
    imageFit: {
      type: String,
      default: 'scaleToFill'
    }
  },
  watch: {
    fileList: {
      handler: 'formatFileList',
      immediate: true,
      deep: true
    }
  },
  methods: {
    formatFileList() {
      const {
        fileList = [],
        maxCount
      } = this;
      const lists = fileList.map(item => Object.assign(Object.assign({}, item), {
        isImage: typeof item.isImage === 'undefined' ? isImageFile(item) : item.isImage
      }));
      this.setData({
        lists,
        isInCount: lists.length < maxCount
      });
    },

    startUpload() {
      if (this.disabled) return;
      const {
        name = '',
        capture,
        maxCount,
        multiple,
        maxSize,
        accept,
        sizeType,
        videoCfg = {},
        lists,
        useBeforeRead = false // 是否定义了 beforeRead

      } = this;
      let chooseFile = null;
      const newMaxCount = maxCount - lists.length; // 设置为只选择图片的时候使用 chooseImage 来实现

      if (accept === 'image') {
        chooseFile = new Promise((resolve, reject) => {
          uni.chooseImage({
            count: multiple ? newMaxCount > 9 ? 9 : newMaxCount : 1,
            sourceType: capture,
            sizeType,
            success: resolve,
            fail: reject
          });
        });
      } else if (accept === 'video') {
        chooseFile = new Promise((resolve, reject) => {
          uni.chooseMedia({
            count: videoCfg.count || 9,
            mediaType: ['video'],
            sourceType: videoCfg.sourceType || ['album', 'camera'],
            maxDuration: videoCfg.maxDuration || 10,
            camera: videoCfg.camera || 'back',
            success: res => {
              res.isVideo = true;
              resolve(res);
            },
            fail: reject
          });
        });
      } else {
        chooseFile = new Promise((resolve, reject) => {
          uni.chooseMessageFile({
            count: multiple ? newMaxCount : 1,
            type: 'file',
            success: resolve,
            fail: reject
          });
        });
      }

      chooseFile.then(res => {
        const file = multiple ? res.tempFiles : res.tempFiles[0]; // 检查文件大小

        if (file instanceof Array) {
          const sizeEnable = file.every(item => item.size <= maxSize);

          if (!sizeEnable) {
            this.$emit('oversize', {
              name
            });
            return;
          }
        } else if (file.size > maxSize) {
          this.$emit('oversize', {
            name
          });
          return;
        }

        let upData = {
          file,
          name
        };

        if (res.isVideo) {
          file.map(val => {
            val.isVideo = true;
            return val;
          });
        } // 触发上传之前的钩子函数


        if (useBeforeRead) {
          this.$emit('before-read', {
            file,
            name,
            callback: result => {
              if (result) {
                // 开始上传
                this.$emit('after-read', upData);
              }
            }
          });
        } else {
          this.$emit('after-read', upData);
        }
      }).catch(error => {
        this.$emit('error', error);
      });
    },

    deleteItem(event) {
      const {
        index
      } = event.currentTarget.dataset;
      this.$emit('delete', {
        index,
        name: this.name
      });
    },

    doPreviewImage(event) {
      if (!this.previewFullImage) return;
      const curUrl = event.currentTarget.dataset.url;
      const images = this.lists.filter(item => item.isImage).map(item => item.url || item.path);
      this.$emit('click-preview', {
        url: curUrl,
        name: this.name
      });
      uni.previewImage({
        urls: images,
        current: curUrl,

        fail() {
          uni.showToast({
            title: '预览图片失败',
            icon: 'none'
          });
        }

      });
    }

  }
};
</script>
<style>
@import "../common/index.css";.van-uploader{position:relative;display:inline-block}.van-uploader__wrapper{display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap}.van-uploader__slot:empty{display:none}.van-uploader__slot:not(:empty)+.van-uploader__upload{display:none!important}.van-uploader__upload{position:relative;display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;box-sizing:border-box;width:80px;height:80px;margin:0 20rpx 20rpx 0;background-color:#fff;border:2px dashed #e0e0f0;border-radius:8px}.van-uploader__upload-icon{display:inline-block;width:48rpx;height:48rpx;color:#969799;font-size:24px}.van-uploader__upload-text{margin-top:8px;color:#969799;font-size:12px}.van-uploader__preview{position:relative;margin:0 20rpx 20rpx 0}.van-uploader__preview-image{display:block;width:80px;height:80px;border-radius:8px}
.van-uploader__preview-video{display:block;width:80px;height:80px;border-radius:8px;overflow: hidden}
.van-uploader__preview-delete{position:absolute;top:-8px;right:-8px;color:#969799;font-size:18px;background-color:#fff;border-radius:100%}.van-uploader__file{display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;width:80px;height:80px;background-color:#f7f8fa;border-radius:8px}.van-uploader__file-icon{display:inline-block;width:20px;height:20px;color:#646566;font-size:20px}.van-uploader__file-name{box-sizing:border-box;width:100%;margin-top:8px;padding:0 5px;color:#646566;font-size:12px;text-align:center}@import "./index-wxa-auto-dark.css";
</style>