<template>
<view>
<view :class="'weui-uploader ' + extClass">
    <view class="weui-uploader__hd">
      <view class="weui-uploader__overview">
          <view class="weui-uploader__title">{{title}}</view>
          <view class="weui-uploader__info" v-if="maxCount > 1">{{currentFiles.length}}/{{maxCount}}</view>

      </view>
        <view v-if="tips" class="weui-uploader__tips">{{tips}}</view>
        <view v-else><slot name="tips"></slot></view>
    </view>
    <view class="weui-uploader__bd">
        <view class="weui-uploader__files">
            <block v-for="(item, index) in currentFiles" :key="index">
                <view v-if="item.error" :data-index="index" @tap="previewImage" class="weui-uploader__file weui-uploader__file_status">
                    <image class="weui-uploader__img" :src="item.url" mode="aspectFill"></image>
                    <view class="weui-uploader__file-content">
                        <icon type="warn" size="23" color="#F43530"></icon>
                    </view>
                </view>
                <view v-else-if="item.loading" :data-index="index" @tap="previewImage" class="weui-uploader__file weui-uploader__file_status">
                    <image class="weui-uploader__img" :src="item.url" mode="aspectFill"></image>
                    <view class="weui-uploader__file-content">
                    <view class="weui-loading"></view>
                    </view>
                </view>
                <view v-else class="weui-uploader__file" :data-index="index" @tap="previewImage">
                    <image class="weui-uploader__img" :src="item.url" mode="aspectFill"></image>
                </view>
            </block>
        </view>
        <view v-if="currentFiles.length < maxCount" class="weui-uploader__input-box" hover-class="weui-active">
            <view class="weui-uploader__input" @tap="chooseImage"></view>
        </view>
    </view>
</view>
<mp-gallery class="gallery" :hide-on-click="true" :show-delete="showDelete" :show="showPreview" @delete="deletePic" :img-urls="previewImageUrls" :current="previewCurrent"></mp-gallery>
</view>
</template>

<script>
import mpGallery from "../gallery/gallery";

export default {
  data() {
    return {
      currentFiles: [],
      showPreview: false,
      previewImageUrls: [],
      previewCurrent: ""
    };
  },

  components: {
    mpGallery
  },
  props: {
    title: {
      type: String,
      default: '图片上传'
    },
    sizeType: {
      type: Array,
      default: () => ['original', 'compressed']
    },
    sourceType: {
      type: Array,
      default: () => ['album', 'camera']
    },
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024
    },
    maxCount: {
      // 最多上传多少个文件
      type: Number,
      default: 1
    },
    files: {
      // 当前的图片列表, {url, error, loading}
      type: Array,
      default: () => []
    },
    select: {
      // 过滤某个文件
      type: null,
      default: () => {}
    },
    upload: {
      // 返回Promise的一个文件上传的函数
      type: null,
      default: null
    },
    tips: {
      type: String,
      default: ''
    },
    extClass: {
      type: String,
      default: ''
    },
    showDelete: {
      // 是否显示delete按钮
      type: Boolean,
      default: true
    }
  },
  watch: {
    files: {
      handler: function (newVal) {
        this.setData({
          currentFiles: newVal
        });
      },
      immediate: true,
      deep: true
    }
  },
  options: {
    addGlobalClass: true
  },

  mounted() {},

  methods: {
    previewImage(e) {
      const {
        index
      } = e.currentTarget.dataset;
      const previewImageUrls = [];
      this.files.forEach(item => {
        previewImageUrls.push(item.url);
      });
      this.setData({
        previewImageUrls,
        previewCurrent: index,
        showPreview: true
      });
    },

    chooseImage() {
      if (this.uploading) return;
      uni.chooseImage({
        count: this.maxCount - this.files.length,
        sizeType: this.sizeType,
        sourceType: this.sourceType,
        success: res => {
          // console.log('chooseImage resp', res)
          // 首先检查文件大小
          let invalidIndex = -1; // @ts-ignore

          res.tempFiles.forEach((item, index) => {
            if (item.size > this.maxSize) {
              invalidIndex = index;
            }
          });

          if (typeof this.select === 'function') {
            const ret = this.select(res);

            if (ret === false) {
              return;
            }
          }

          if (invalidIndex >= 0) {
            this.$emit('fail', {
              detail: {
                type: 1,
                errMsg: `chooseImage:fail size exceed ${this.maxSize}`,
                total: res.tempFilePaths.length,
                index: invalidIndex
              }
            }, {});
            return;
          } // 获取文件内容


          const mgr = uni.getFileSystemManager();
          const contents = res.tempFilePaths.map(item => {
            // @ts-ignore
            const fileContent = mgr.readFileSync(item);
            return fileContent;
          });
          const obj = {
            tempFilePaths: res.tempFilePaths,
            tempFiles: res.tempFiles,
            contents
          }; // 触发选中的事件，开发者根据内容来上传文件，上传了把上传的结果反馈到files属性里面

          this.$emit('select', {
            detail: obj
          }, {});
          const files = res.tempFilePaths.map((item, i) => ({
            loading: true,
            // @ts-ignore
            url: res.tempFilePaths[i] || `data:image/jpg;base64,${uni.arrayBufferToBase64(contents[i])}`
          }));
          if (!files || !files.length) return;

          if (typeof this.upload === 'function') {
            const len = this.files.length;
            const newFiles = this.files.concat(files);
            this.setData({
              files: newFiles,
              currentFiles: newFiles
            });
            this.loading = true;
            this.upload(obj).then(json => {
              this.loading = false;

              if (json.urls) {
                const oldFiles = this.files;
                json.urls.forEach((url, index) => {
                  oldFiles[len + index].url = url;
                  oldFiles[len + index].loading = false;
                });
                this.setData({
                  files: oldFiles,
                  currentFiles: newFiles
                });
                this.$emit('success', {
                  detail: json
                }, {});
              } else {
                this.$emit('fail', {
                  detail: {
                    type: 3,
                    errMsg: 'upload file fail, urls not found'
                  }
                }, {});
              }
            }).catch(err => {
              this.loading = false;
              const oldFiles = this.files;
              res.tempFilePaths.forEach((item, index) => {
                oldFiles[len + index].error = true;
                oldFiles[len + index].loading = false;
              });
              this.setData({
                files: oldFiles,
                currentFiles: newFiles
              });
              this.$emit('fail', {
                detail: {
                  type: 3,
                  errMsg: 'upload file fail',
                  error: err
                }
              }, {});
            });
          }
        },
        fail: fail => {
          if (fail.errMsg.indexOf('chooseImage:fail cancel') >= 0) {
            this.$emit('cancel', {
              detail: {}
            }, {});
            return;
          }

          fail.type = 2;
          this.$emit('fail', {
            detail: fail
          }, {});
        }
      });
    },

    deletePic(e) {
      const index = e.detail.index;
      const files = this.files;
      const file = files.splice(index, 1);
      this.setData({
        files,
        currentFiles: files
      });
      this.$emit('delete', {
        detail: {
          index,
          item: file[0]
        }
      });
    }

  }
};
</script>
