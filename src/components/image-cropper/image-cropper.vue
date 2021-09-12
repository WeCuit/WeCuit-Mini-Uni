<template>
<view class="image-cropper" catchtouchmove="_preventTouchMove">
    <view class="main" @touchend="_cutTouchEnd" @touchstart="_cutTouchStart" @touchmove="_cutTouchMove" @tap="_click">
      <view class="content">
        <view :class="'content_top bg_gray ' + (_flag_bright?'':'bg_black')" :style="'height:' + cut_top + 'px;transition-property:' + (_cut_animation?'':'background')"></view>
        <view class="content_middle" :style="'height:' + height + 'px;'">
          <view :class="'content_middle_left bg_gray ' + (_flag_bright?'':'bg_black')" :style="'width:' + cut_left + 'px;transition-property:' + (_cut_animation?'':'background')"></view>
          <view class="content_middle_middle" :style="'width:' + width + 'px;height:' + height + 'px;transition-duration: .3s;transition-property:' + (_cut_animation?'':'background') + ';'">
            <view class="border border-top-left"></view>
            <view class="border border-top-right"></view>
            <view class="border border-right-top"></view>
            <view class="border border-right-bottom"></view>
            <view class="border border-bottom-right"></view>
            <view class="border border-bottom-left"></view>
            <view class="border border-left-bottom"></view>
            <view class="border border-left-top"></view>
          </view>
          <view :class="'content_middle_right bg_gray ' + (_flag_bright?'':'bg_black')" :style="'transition-property:' + (_cut_animation?'':'background')"></view>
        </view>
        <view :class="'content_bottom bg_gray ' + (_flag_bright?'':'bg_black')" :style="'transition-property:' + (_cut_animation?'':'background')"></view>
      </view>
      <image @load="imageLoad" @touchstart="_start" @touchmove="_move" @touchend="_end" :style="'width:' + (img_width ? img_width + 'px' : 'auto') + ';height:' + (img_height ? img_height + 'px' : 'auto') + ';transform:translate3d(' + (_img_left-img_width/2) + 'px,' + (_img_top-img_height/2) + 'px,0) scale(' + scale + ') rotate(' + angle + 'deg);transition-duration:' + (_cut_animation?.4:0) + 's;'" class="img" :src="imgSrc"></image>
    </view>
    <canvas canvas-id="image-cropper" disable-scroll="true" :style="'width:' + (_canvas_width * export_scale) + 'px;height:' + (_canvas_height * export_scale) + 'px;left:' + canvas_left + 'px;top:' + canvas_top + 'px'" class="image-cropper-canvas"></canvas>
  </view>
</template>

<script>

export default {
  data() {
    return {
      el: 'image-cropper',
      //暂时无用
      info: uni.getSystemInfoSync(),
      MOVE_THROTTLE: null,
      //触摸移动节流settimeout
      MOVE_THROTTLE_FLAG: true,
      //节流标识
      INIT_IMGWIDTH: 0,
      //图片设置尺寸,此值不变（记录最初设定的尺寸）
      INIT_IMGHEIGHT: 0,
      //图片设置尺寸,此值不变（记录最初设定的尺寸）
      TIME_BG: null,
      //背景变暗延时函数
      TIME_CUT_CENTER: null,
      _touch_img_relative: [{
        x: 0,
        y: 0
      }],
      //鼠标和图片中心的相对位置
      _flag_cut_touch: false,
      //是否是拖动裁剪框
      _hypotenuse_length: 0,
      //双指触摸时斜边长度
      _flag_img_endtouch: false,
      //是否结束触摸
      _flag_bright: true,
      //背景是否亮
      _canvas_overflow: true,
      //canvas缩略图是否在屏幕外面
      _canvas_width: 200,
      _canvas_height: 200,
      origin_x: 0.5,
      //图片旋转中心
      origin_y: 0.5,
      //图片旋转中心
      _cut_animation: false,
      //是否开启图片和裁剪框过渡
      _img_top: uni.getSystemInfoSync().windowHeight / 2,
      //图片上边距
      _img_left: uni.getSystemInfoSync().windowWidth / 2,
      //图片左边距
      watch: {
        //监听截取框宽高变化
        width(value, that) {
          if (value < that.min_width) {
            that.setData({
              width: that.min_width
            });
          }

          that._computeCutSize();
        },

        height(value, that) {
          if (value < that.min_height) {
            that.setData({
              height: that.min_height
            });
          }

          that._computeCutSize();
        },

        angle(value, that) {
          //停止居中裁剪框，继续修改图片位置
          that._moveStop();

          if (that.limit_move) {
            if (that.angle % 90) {
              that.setData({
                angle: Math.round(that.angle / 90) * 90
              });
              return;
            }
          }
        },

        _cut_animation(value, that) {
          //开启过渡300毫秒之后自动关闭
          clearTimeout(that._cut_animation_time);

          if (value) {
            that._cut_animation_time = setTimeout(() => {
              that.setData({
                _cut_animation: false
              });
            }, 300);
          }
        },

        limit_move(value, that) {
          if (value) {
            if (that.angle % 90) {
              that.setData({
                angle: Math.round(that.angle / 90) * 90
              });
            }

            that._imgMarginDetectionScale();

            !that._canvas_overflow && that._draw();
          }
        },

        canvas_top(value, that) {
          that._canvasDetectionPosition();
        },

        canvas_left(value, that) {
          that._canvasDetectionPosition();
        },

        imgSrc(value, that) {
          that.pushImg();
        },

        cut_top(value, that) {
          that._cutDetectionPosition();

          if (that.limit_move) {
            !that._canvas_overflow && that._draw();
          }
        },

        cut_left(value, that) {
          that._cutDetectionPosition();

          if (that.limit_move) {
            !that._canvas_overflow && that._draw();
          }
        }

      }
    };
  },

  components: {},
  props: {
    /**     
     * 图片路径
     */
    'imgSrc': {
      type: String
    },

    /**
     * 裁剪框高度
     */
    'height': {
      type: Number,
      default: 200
    },

    /**
     * 裁剪框宽度
     */
    'width': {
      type: Number,
      default: 200
    },

    /**
     * 裁剪框最小尺寸
     */
    'min_width': {
      type: Number,
      default: 100
    },
    'min_height': {
      type: Number,
      default: 100
    },

    /**
     * 裁剪框最大尺寸
     */
    'max_width': {
      type: Number,
      default: 300
    },
    'max_height': {
      type: Number,
      default: 300
    },

    /**
     * 裁剪框禁止拖动
     */
    'disable_width': {
      type: Boolean,
      default: false
    },
    'disable_height': {
      type: Boolean,
      default: false
    },

    /**
     * 锁定裁剪框比例
     */
    'disable_ratio': {
      type: Boolean,
      default: false
    },

    /**
     * 生成的图片尺寸相对剪裁框的比例
     */
    'export_scale': {
      type: Number,
      default: 3
    },

    /**
     * 生成的图片质量0-1
     */
    'quality': {
      type: Number,
      default: 1
    },
    'cut_top': {
      type: Number,
      default: null
    },
    'cut_left': {
      type: Number,
      default: null
    },

    /**
     * canvas上边距（不设置默认不显示）
     */
    'canvas_top': {
      type: Number,
      default: null
    },

    /**
     * canvas左边距（不设置默认不显示）
     */
    'canvas_left': {
      type: Number,
      default: null
    },

    /**
     * 图片宽度
     */
    'img_width': {
      type: null,
      default: null
    },

    /**
     * 图片高度
     */
    'img_height': {
      type: null,
      default: null
    },

    /**
     * 图片缩放比
     */
    'scale': {
      type: Number,
      default: 1
    },

    /**
     * 图片旋转角度
     */
    'angle': {
      type: Number,
      default: 0
    },

    /**
     * 最小缩放比
     */
    'min_scale': {
      type: Number,
      default: 0.5
    },

    /**
     * 最大缩放比
     */
    'max_scale': {
      type: Number,
      default: 2
    },

    /**
     * 是否禁用旋转
     */
    'disable_rotate': {
      type: Boolean,
      default: false
    },

    /**
     * 是否限制移动范围(剪裁框只能在图片内)
     */
    'limit_move': {
      type: Boolean,
      default: false
    }
  },

  beforeMount() {
    this.info = uni.getSystemInfoSync(); //启用数据监听

    this._watcher();

    this.INIT_IMGWIDTH = this.img_width;
    this.INIT_IMGHEIGHT = this.img_height;
    this.setData({
      _canvas_height: this.height,
      _canvas_width: this.width
    });

    this._initCanvas();

    this.imgSrc && (this.imgSrc = this.imgSrc); //根据开发者设置的图片目标尺寸计算实际尺寸

    this._initImageSize(); //设置裁剪框大小>设置图片尺寸>绘制canvas


    this._computeCutSize(); //检查裁剪框是否在范围内


    this._cutDetectionPosition(); //检查canvas是否在范围内


    this._canvasDetectionPosition(); //初始化完成


    this.$emit('load', {
      detail: {
        cropper: this
      }
    });
  },

  methods: {
    /**
     * 上传图片
     */
    upload() {
      let that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],

        success(res) {
          const tempFilePaths = res.tempFilePaths[0];
          that.pushImg(tempFilePaths);
          uni.showLoading({
            title: '请求中~'
          });
        }

      });
    },

    /**
     * 返回图片信息
     */
    getImg(getCallback) {
      this._draw(() => {
        uni.canvasToTempFilePath({
          width: this.width * this.export_scale,
          height: Math.round(this.height * this.export_scale),
          destWidth: this.width * this.export_scale,
          destHeight: Math.round(this.height) * this.export_scale,
          fileType: 'png',
          quality: this.quality,
          canvasId: this.el,
          success: res => {
            getCallback({
              url: res.tempFilePath,
              width: this.width * this.export_scale,
              height: this.height * this.export_scale
            });
          }
        }, this);
      });
    },

    /**
     * 设置图片动画
     * {
     *    x:10,//图片在原有基础上向下移动10px
     *    y:10,//图片在原有基础上向右移动10px
     *    angle:10,//图片在原有基础上旋转10deg
     *    scale:0.5,//图片在原有基础上增加0.5倍
     * }
     */
    setTransform(transform) {
      if (!transform) return;

      if (!this.disable_rotate) {
        this.setData({
          angle: transform.angle ? this.angle + transform.angle : this.angle
        });
      }

      var scale = this.scale;

      if (transform.scale) {
        scale = this.scale + transform.scale;
        scale = scale <= this.min_scale ? this.min_scale : scale;
        scale = scale >= this.max_scale ? this.max_scale : scale;
      }

      this.scale = scale;
      let cutX = this.cut_left;
      let cutY = this.cut_top;

      if (transform.cutX) {
        this.setData({
          cut_left: cutX + transform.cutX
        });
        this.watch.cut_left(null, this);
      }

      if (transform.cutY) {
        this.setData({
          cut_top: cutY + transform.cutY
        });
        this.watch.cut_top(null, this);
      }

      this._img_top = transform.y ? this._img_top + transform.y : this._img_top;
      this._img_left = transform.x ? this._img_left + transform.x : this._img_left; //图像边缘检测,防止截取到空白

      this._imgMarginDetectionScale(); //停止居中裁剪框，继续修改图片位置


      this._moveDuring();

      this.setData({
        scale: this.scale,
        _img_top: this._img_top,
        _img_left: this._img_left
      });
      !this._canvas_overflow && this._draw(); //可以居中裁剪框了

      this._moveStop(); //结束操作

    },

    /**
     * 设置剪裁框位置
     */
    setCutXY(x, y) {
      this.setData({
        cut_top: y,
        cut_left: x
      });
    },

    /**
     * 设置剪裁框尺寸
     */
    setCutSize(w, h) {
      this.setData({
        width: w,
        height: h
      });

      this._computeCutSize();
    },

    /**
     * 设置剪裁框和图片居中
     */
    setCutCenter() {
      let cut_top = (this.info.windowHeight - this.height) * 0.5;
      let cut_left = (this.info.windowWidth - this.width) * 0.5; //顺序不能变

      this.setData({
        _img_top: this._img_top - this.cut_top + cut_top,
        cut_top: cut_top,
        //截取的框上边距
        _img_left: this._img_left - this.cut_left + cut_left,
        cut_left: cut_left //截取的框左边距

      });
    },

    _setCutCenter() {
      let cut_top = (this.info.windowHeight - this.height) * 0.5;
      let cut_left = (this.info.windowWidth - this.width) * 0.5;
      this.setData({
        cut_top: cut_top,
        //截取的框上边距
        cut_left: cut_left //截取的框左边距

      });
    },

    /**
     * 设置剪裁框宽度-即将废弃
     */
    setWidth(width) {
      this.setData({
        width: width
      });

      this._computeCutSize();
    },

    /**
     * 设置剪裁框高度-即将废弃
     */
    setHeight(height) {
      this.setData({
        height: height
      });

      this._computeCutSize();
    },

    /**
     * 是否锁定旋转
     */
    setDisableRotate(value) {
      this.disable_rotate = value;
    },

    /**
     * 是否限制移动
     */
    setLimitMove(value) {
      this.setData({
        _cut_animation: true,
        limit_move: !!value
      });
    },

    /**
     * 初始化图片，包括位置、大小、旋转角度
     */
    imgReset() {
      this.setData({
        scale: 1,
        angle: 0,
        _img_top: uni.getSystemInfoSync().windowHeight / 2,
        _img_left: uni.getSystemInfoSync().windowWidth / 2
      });
    },

    /**
     * 加载（更换）图片
     */
    pushImg(src) {
      if (src) {
        this.setData({
          imgSrc: src
        }); //发现是手动赋值直接返回，交给watch处理

        return;
      } // getImageInfo接口传入 src: '' 会导致内存泄漏


      if (!this.imgSrc) return;
      uni.getImageInfo({
        src: this.imgSrc,
        success: res => {
          this.imageObject = res; //图片非本地路径需要换成本地路径

          if (this.imgSrc.search(/tmp/) == -1) {
            this.setData({
              imgSrc: res.path
            });
          } //计算最后图片尺寸


          this._imgComputeSize();

          if (this.limit_move) {
            //限制移动，不留空白处理
            this._imgMarginDetectionScale();
          }

          this._draw();
        },
        fail: err => {
          this.setData({
            imgSrc: ''
          });
        }
      });
    },

    imageLoad(e) {
      setTimeout(() => {
        this.$emit('imageload', {
          detail: this.imageObject
        });
      }, 1000);
    },

    /**
     * 设置图片放大缩小
     */
    setScale(scale) {
      if (!scale) return;
      this.setData({
        scale: scale
      });
      !this._canvas_overflow && this._draw();
    },

    /**
     * 设置图片旋转角度
     */
    setAngle(angle) {
      if (!angle) return;
      this.setData({
        _cut_animation: true,
        angle: angle
      });

      this._imgMarginDetectionScale();

      !this._canvas_overflow && this._draw();
    },

    _initCanvas() {
      //初始化canvas
      if (!this.ctx) {
        this.ctx = uni.createCanvasContext("image-cropper", this);
      }
    },

    /**
     * 根据开发者设置的图片目标尺寸计算实际尺寸
     */
    _initImageSize() {
      //处理宽高特殊单位 %>px
      if (this.INIT_IMGWIDTH && typeof this.INIT_IMGWIDTH == "string" && this.INIT_IMGWIDTH.indexOf("%") != -1) {
        let width = this.INIT_IMGWIDTH.replace("%", "");
        this.INIT_IMGWIDTH = this.img_width = this.info.windowWidth / 100 * width;
      }

      if (this.INIT_IMGHEIGHT && typeof this.INIT_IMGHEIGHT == "string" && this.INIT_IMGHEIGHT.indexOf("%") != -1) {
        let height = this.img_height.replace("%", "");
        this.INIT_IMGHEIGHT = this.img_height = this.info.windowHeight / 100 * height;
      }
    },

    /**
     * 检测剪裁框位置是否在允许的范围内(屏幕内)
     */
    _cutDetectionPosition() {
      let _cutDetectionPositionTop = () => {
        //检测上边距是否在范围内
        if (this.cut_top < 0) {
          this.setData({
            cut_top: 0
          });
        }

        if (this.cut_top > this.info.windowHeight - this.height) {
          this.setData({
            cut_top: this.info.windowHeight - this.height
          });
        }
      },
          _cutDetectionPositionLeft = () => {
        //检测左边距是否在范围内
        if (this.cut_left < 0) {
          this.setData({
            cut_left: 0
          });
        }

        if (this.cut_left > this.info.windowWidth - this.width) {
          this.setData({
            cut_left: this.info.windowWidth - this.width
          });
        }
      }; //裁剪框坐标处理（如果只写一个参数则另一个默认为0，都不写默认居中）


      if (this.cut_top == null && this.cut_left == null) {
        this._setCutCenter();
      } else if (this.cut_top != null && this.cut_left != null) {
        _cutDetectionPositionTop();

        _cutDetectionPositionLeft();
      } else if (this.cut_top != null && this.cut_left == null) {
        _cutDetectionPositionTop();

        this.setData({
          cut_left: (this.info.windowWidth - this.width) / 2
        });
      } else if (this.cut_top == null && this.cut_left != null) {
        _cutDetectionPositionLeft();

        this.setData({
          cut_top: (this.info.windowHeight - this.height) / 2
        });
      }
    },

    /**
     * 检测canvas位置是否在允许的范围内(屏幕内)如果在屏幕外则不开启实时渲染
     * 如果只写一个参数则另一个默认为0，都不写默认超出屏幕外
     */
    _canvasDetectionPosition() {
      if (this.canvas_top == null && this.canvas_left == null) {
        this._canvas_overflow = false;
        this.setData({
          canvas_top: -5000,
          canvas_left: -5000
        });
      } else if (this.canvas_top != null && this.canvas_left != null) {
        if (this.canvas_top < -this.height || this.canvas_top > this.info.windowHeight) {
          this._canvas_overflow = true;
        } else {
          this._canvas_overflow = false;
        }
      } else if (this.canvas_top != null && this.canvas_left == null) {
        this.setData({
          canvas_left: 0
        });
      } else if (this.canvas_top == null && this.canvas_left != null) {
        this.setData({
          canvas_top: 0
        });

        if (this.canvas_left < -this.width || this.canvas_left > this.info.windowWidth) {
          this._canvas_overflow = true;
        } else {
          this._canvas_overflow = false;
        }
      }
    },

    /**
     * 图片边缘检测-位置
     */
    _imgMarginDetectionPosition(scale) {
      if (!this.limit_move) return;
      let left = this._img_left;
      let top = this._img_top;
      var scale = scale || this.scale;
      let img_width = this.img_width;
      let img_height = this.img_height;

      if (this.angle / 90 % 2) {
        img_width = this.img_height;
        img_height = this.img_width;
      }

      left = this.cut_left + img_width * scale / 2 >= left ? left : this.cut_left + img_width * scale / 2;
      left = this.cut_left + this.width - img_width * scale / 2 <= left ? left : this.cut_left + this.width - img_width * scale / 2;
      top = this.cut_top + img_height * scale / 2 >= top ? top : this.cut_top + img_height * scale / 2;
      top = this.cut_top + this.height - img_height * scale / 2 <= top ? top : this.cut_top + this.height - img_height * scale / 2;
      this.setData({
        _img_left: left,
        _img_top: top,
        scale: scale
      });
    },

    /**
     * 图片边缘检测-缩放
     */
    _imgMarginDetectionScale() {
      if (!this.limit_move) return;
      let scale = this.scale;
      let img_width = this.img_width;
      let img_height = this.img_height;

      if (this.angle / 90 % 2) {
        img_width = this.img_height;
        img_height = this.img_width;
      }

      if (img_width * scale < this.width) {
        scale = this.width / img_width;
      }

      if (img_height * scale < this.height) {
        scale = Math.max(scale, this.height / img_height);
      }

      this._imgMarginDetectionPosition(scale);
    },

    _setData(obj) {
      let data = {};

      for (var key in obj) {
        if (this[key] != obj[key]) {
          data[key] = obj[key];
        }
      }

      this.setData(data);
      return data;
    },

    /**
     * 计算图片尺寸
     */
    _imgComputeSize() {
      let img_width = this.img_width,
          img_height = this.img_height;

      if (!this.INIT_IMGHEIGHT && !this.INIT_IMGWIDTH) {
        //默认按图片最小边 = 对应裁剪框尺寸
        img_width = this.imageObject.width;
        img_height = this.imageObject.height;

        if (img_width / img_height > this.width / this.height) {
          img_height = this.height;
          img_width = this.imageObject.width / this.imageObject.height * img_height;
        } else {
          img_width = this.width;
          img_height = this.imageObject.height / this.imageObject.width * img_width;
        }
      } else if (this.INIT_IMGHEIGHT && !this.INIT_IMGWIDTH) {
        img_width = this.imageObject.width / this.imageObject.height * this.INIT_IMGHEIGHT;
      } else if (!this.INIT_IMGHEIGHT && this.INIT_IMGWIDTH) {
        img_height = this.imageObject.height / this.imageObject.width * this.INIT_IMGWIDTH;
      }

      this.setData({
        img_width: img_width,
        img_height: img_height
      });
    },

    //改变截取框大小
    _computeCutSize() {
      if (this.width > this.info.windowWidth) {
        this.setData({
          width: this.info.windowWidth
        });
      } else if (this.width + this.cut_left > this.info.windowWidth) {
        this.setData({
          cut_left: this.info.windowWidth - this.cut_left
        });
      }

      ;

      if (this.height > this.info.windowHeight) {
        this.setData({
          height: this.info.windowHeight
        });
      } else if (this.height + this.cut_top > this.info.windowHeight) {
        this.setData({
          cut_top: this.info.windowHeight - this.cut_top
        });
      }

      !this._canvas_overflow && this._draw();
    },

    //开始触摸
    _start(event) {
      this._flag_img_endtouch = false;

      if (event.touches.length == 1) {
        //单指拖动
        this._touch_img_relative[0] = {
          x: event.touches[0].clientX - this._img_left,
          y: event.touches[0].clientY - this._img_top
        };
      } else {
        //双指放大
        let width = Math.abs(event.touches[0].clientX - event.touches[1].clientX);
        let height = Math.abs(event.touches[0].clientY - event.touches[1].clientY);
        this._touch_img_relative = [{
          x: event.touches[0].clientX - this._img_left,
          y: event.touches[0].clientY - this._img_top
        }, {
          x: event.touches[1].clientX - this._img_left,
          y: event.touches[1].clientY - this._img_top
        }];
        this._hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
      }

      !this._canvas_overflow && this._draw();
    },

    _move_throttle() {
      //安卓需要节流
      if (this.info.platform == 'android') {
        clearTimeout(this.MOVE_THROTTLE);
        this.MOVE_THROTTLE = setTimeout(() => {
          this.MOVE_THROTTLE_FLAG = true;
        }, 1000 / 40);
        return this.MOVE_THROTTLE_FLAG;
      } else {
        this.MOVE_THROTTLE_FLAG = true;
      }
    },

    _move(event) {
      if (this._flag_img_endtouch || !this.MOVE_THROTTLE_FLAG) return;
      this.MOVE_THROTTLE_FLAG = false;

      this._move_throttle();

      this._moveDuring();

      if (event.touches.length == 1) {
        //单指拖动
        let left = event.touches[0].clientX - this._touch_img_relative[0].x,
            top = event.touches[0].clientY - this._touch_img_relative[0].y; //图像边缘检测,防止截取到空白

        this._img_left = left;
        this._img_top = top;

        this._imgMarginDetectionPosition();

        this.setData({
          _img_left: this._img_left,
          _img_top: this._img_top
        });
      } else {
        //双指放大
        let width = Math.abs(event.touches[0].clientX - event.touches[1].clientX),
            height = Math.abs(event.touches[0].clientY - event.touches[1].clientY),
            hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)),
            scale = this.scale * (hypotenuse / this._hypotenuse_length),
            current_deg = 0;
        scale = scale <= this.min_scale ? this.min_scale : scale;
        scale = scale >= this.max_scale ? this.max_scale : scale; //图像边缘检测,防止截取到空白

        this.scale = scale;

        this._imgMarginDetectionScale(); //双指旋转(如果没禁用旋转)


        let _touch_img_relative = [{
          x: event.touches[0].clientX - this._img_left,
          y: event.touches[0].clientY - this._img_top
        }, {
          x: event.touches[1].clientX - this._img_left,
          y: event.touches[1].clientY - this._img_top
        }];

        if (!this.disable_rotate) {
          let first_atan = 180 / Math.PI * Math.atan2(_touch_img_relative[0].y, _touch_img_relative[0].x);
          let first_atan_old = 180 / Math.PI * Math.atan2(this._touch_img_relative[0].y, this._touch_img_relative[0].x);
          let second_atan = 180 / Math.PI * Math.atan2(_touch_img_relative[1].y, _touch_img_relative[1].x);
          let second_atan_old = 180 / Math.PI * Math.atan2(this._touch_img_relative[1].y, this._touch_img_relative[1].x); //当前旋转的角度

          let first_deg = first_atan - first_atan_old,
              second_deg = second_atan - second_atan_old;

          if (first_deg != 0) {
            current_deg = first_deg;
          } else if (second_deg != 0) {
            current_deg = second_deg;
          }
        }

        this._touch_img_relative = _touch_img_relative;
        this._hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)); //更新视图

        this.setData({
          angle: this.angle + current_deg,
          scale: this.scale
        });
      }

      !this._canvas_overflow && this._draw();
    },

    //结束操作
    _end(event) {
      this._flag_img_endtouch = true;

      this._moveStop();
    },

    //点击中间剪裁框处理
    _click(event) {
      if (!this.imgSrc) {
        //调起上传
        this.upload();
        return;
      }

      this._draw(() => {
        let x = event.detail ? event.detail.x : event.touches[0].clientX;
        let y = event.detail ? event.detail.y : event.touches[0].clientY;

        if (x >= this.cut_left && x <= this.cut_left + this.width && y >= this.cut_top && y <= this.cut_top + this.height) {
          //生成图片并回调
          uni.canvasToTempFilePath({
            width: this.width * this.export_scale,
            height: Math.round(this.height * this.export_scale),
            destWidth: this.width * this.export_scale,
            destHeight: Math.round(this.height) * this.export_scale,
            fileType: 'png',
            quality: this.quality,
            canvasId: this.el,
            success: res => {
              this.$emit('tapcut', {
                detail: {
                  url: res.tempFilePath,
                  width: this.width * this.export_scale,
                  height: this.height * this.export_scale
                }
              });
            }
          }, this);
        }
      });
    },

    //渲染
    _draw(callback) {
      if (!this.imgSrc) return;

      let draw = () => {
        //图片实际大小
        let img_width = this.img_width * this.scale * this.export_scale;
        let img_height = this.img_height * this.scale * this.export_scale; //canvas和图片的相对距离

        var xpos = this._img_left - this.cut_left;
        var ypos = this._img_top - this.cut_top; //旋转画布

        this.ctx.translate(xpos * this.export_scale, ypos * this.export_scale);
        this.ctx.rotate(this.angle * Math.PI / 180);
        this.ctx.drawImage(this.imgSrc, -img_width / 2, -img_height / 2, img_width, img_height);
        this.ctx.draw(false, () => {
          callback && callback();
        });
      };

      if (this.ctx.width != this.width || this.ctx.height != this.height) {
        //优化拖动裁剪框，所以必须把宽高设置放在离用户触发渲染最近的地方
        this.setData({
          _canvas_height: this.height,
          _canvas_width: this.width
        }, () => {
          //延迟40毫秒防止点击过快出现拉伸或裁剪过多
          setTimeout(() => {
            draw();
          }, 40);
        });
      } else {
        draw();
      }
    },

    //裁剪框处理
    _cutTouchMove(e) {
      if (this._flag_cut_touch && this.MOVE_THROTTLE_FLAG) {
        if (this.disable_ratio && (this.disable_width || this.disable_height)) return; //节流

        this.MOVE_THROTTLE_FLAG = false;

        this._move_throttle();

        let width = this.width,
            height = this.height,
            cut_top = this.cut_top,
            cut_left = this.cut_left,
            size_correct = () => {
          width = width <= this.max_width ? width >= this.min_width ? width : this.min_width : this.max_width;
          height = height <= this.max_height ? height >= this.min_height ? height : this.min_height : this.max_height;
        },
            size_inspect = () => {
          if ((width > this.max_width || width < this.min_width || height > this.max_height || height < this.min_height) && this.disable_ratio) {
            size_correct();
            return false;
          } else {
            size_correct();
            return true;
          }
        };

        height = this.CUT_START.height + (this.CUT_START.corner > 1 && this.CUT_START.corner < 4 ? 1 : -1) * (this.CUT_START.y - e.touches[0].clientY);

        switch (this.CUT_START.corner) {
          case 1:
            width = this.CUT_START.width + this.CUT_START.x - e.touches[0].clientX;

            if (this.disable_ratio) {
              height = width / (this.width / this.height);
            }

            if (!size_inspect()) return;
            cut_left = this.CUT_START.cut_left - (width - this.CUT_START.width);
            break;

          case 2:
            width = this.CUT_START.width + this.CUT_START.x - e.touches[0].clientX;

            if (this.disable_ratio) {
              height = width / (this.width / this.height);
            }

            if (!size_inspect()) return;
            cut_top = this.CUT_START.cut_top - (height - this.CUT_START.height);
            cut_left = this.CUT_START.cut_left - (width - this.CUT_START.width);
            break;

          case 3:
            width = this.CUT_START.width - this.CUT_START.x + e.touches[0].clientX;

            if (this.disable_ratio) {
              height = width / (this.width / this.height);
            }

            if (!size_inspect()) return;
            cut_top = this.CUT_START.cut_top - (height - this.CUT_START.height);
            break;

          case 4:
            width = this.CUT_START.width - this.CUT_START.x + e.touches[0].clientX;

            if (this.disable_ratio) {
              height = width / (this.width / this.height);
            }

            if (!size_inspect()) return;
            break;
        }

        if (!this.disable_width && !this.disable_height) {
          this.setData({
            width: width,
            cut_left: cut_left,
            height: height,
            cut_top: cut_top
          });
        } else if (!this.disable_width) {
          this.setData({
            width: width,
            cut_left: cut_left
          });
        } else if (!this.disable_height) {
          this.setData({
            height: height,
            cut_top: cut_top
          });
        }

        this._imgMarginDetectionScale();
      }
    },

    _cutTouchStart(e) {
      let currentX = e.touches[0].clientX;
      let currentY = e.touches[0].clientY;
      let cutbox_top4 = this.cut_top + this.height - 30;
      let cutbox_bottom4 = this.cut_top + this.height + 20;
      let cutbox_left4 = this.cut_left + this.width - 30;
      let cutbox_right4 = this.cut_left + this.width + 30;
      let cutbox_top3 = this.cut_top - 30;
      let cutbox_bottom3 = this.cut_top + 30;
      let cutbox_left3 = this.cut_left + this.width - 30;
      let cutbox_right3 = this.cut_left + this.width + 30;
      let cutbox_top2 = this.cut_top - 30;
      let cutbox_bottom2 = this.cut_top + 30;
      let cutbox_left2 = this.cut_left - 30;
      let cutbox_right2 = this.cut_left + 30;
      let cutbox_top1 = this.cut_top + this.height - 30;
      let cutbox_bottom1 = this.cut_top + this.height + 30;
      let cutbox_left1 = this.cut_left - 30;
      let cutbox_right1 = this.cut_left + 30;

      if (currentX > cutbox_left4 && currentX < cutbox_right4 && currentY > cutbox_top4 && currentY < cutbox_bottom4) {
        this._moveDuring();

        this._flag_cut_touch = true;
        this._flag_img_endtouch = true;
        this.CUT_START = {
          width: this.width,
          height: this.height,
          x: currentX,
          y: currentY,
          corner: 4
        };
      } else if (currentX > cutbox_left3 && currentX < cutbox_right3 && currentY > cutbox_top3 && currentY < cutbox_bottom3) {
        this._moveDuring();

        this._flag_cut_touch = true;
        this._flag_img_endtouch = true;
        this.CUT_START = {
          width: this.width,
          height: this.height,
          x: currentX,
          y: currentY,
          cut_top: this.cut_top,
          cut_left: this.cut_left,
          corner: 3
        };
      } else if (currentX > cutbox_left2 && currentX < cutbox_right2 && currentY > cutbox_top2 && currentY < cutbox_bottom2) {
        this._moveDuring();

        this._flag_cut_touch = true;
        this._flag_img_endtouch = true;
        this.CUT_START = {
          width: this.width,
          height: this.height,
          cut_top: this.cut_top,
          cut_left: this.cut_left,
          x: currentX,
          y: currentY,
          corner: 2
        };
      } else if (currentX > cutbox_left1 && currentX < cutbox_right1 && currentY > cutbox_top1 && currentY < cutbox_bottom1) {
        this._moveDuring();

        this._flag_cut_touch = true;
        this._flag_img_endtouch = true;
        this.CUT_START = {
          width: this.width,
          height: this.height,
          cut_top: this.cut_top,
          cut_left: this.cut_left,
          x: currentX,
          y: currentY,
          corner: 1
        };
      }
    },

    _cutTouchEnd(e) {
      this._moveStop();

      this._flag_cut_touch = false;
    },

    //停止移动时需要做的操作
    _moveStop() {
      //清空之前的自动居中延迟函数并添加最新的
      clearTimeout(this.TIME_CUT_CENTER);
      this.TIME_CUT_CENTER = setTimeout(() => {
        //动画启动
        if (!this._cut_animation) {
          this.setData({
            _cut_animation: true
          });
        }

        this.setCutCenter();
      }, 1000); //清空之前的背景变化延迟函数并添加最新的

      clearTimeout(this.TIME_BG);
      this.TIME_BG = setTimeout(() => {
        if (this._flag_bright) {
          this.setData({
            _flag_bright: false
          });
        }
      }, 2000);
    },

    //移动中
    _moveDuring() {
      //清空之前的自动居中延迟函数
      clearTimeout(this.TIME_CUT_CENTER); //清空之前的背景变化延迟函数

      clearTimeout(this.TIME_BG); //高亮背景

      if (!this._flag_bright) {
        this.setData({
          _flag_bright: true
        });
      }
    },

    //监听器
    _watcher() {
      Object.keys(this).forEach(v => {
        this._observe(this, v, this.watch[v]);
      });
    },

    _observe(obj, key, watchFun) {
      var val = obj[key];
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        set: value => {
          val = value;
          watchFun && watchFun(val, this);
        },

        get() {
          if (val && '_img_top|img_left||width|height|min_width|max_width|min_height|max_height|export_scale|cut_top|cut_left|canvas_top|canvas_left|img_width|img_height|scale|angle|min_scale|max_scale'.indexOf(key) != -1) {
            let ret = parseFloat(parseFloat(val).toFixed(3));

            if (typeof val == "string" && val.indexOf("%") != -1) {
              ret += '%';
            }

            return ret;
          }

          return val;
        }

      });
    },

    _preventTouchMove() {}

  }
};
</script>
<style>
.image-cropper{
  background:rgba(14, 13, 13,.8);
  position: fixed;
  top:0;/*  #ifdef  H5  */
  top:calc(88rpx + constant(safe-area-inset-top));
  top:calc(88rpx + env(safe-area-inset-top));/*  #endif  */
  left:0;
  width:100vw;
  height:100vh;
  z-index: 1;
}
.main{
  position: absolute;
  width:100vw;
  height:100vh;
  overflow: hidden;
}
.content{
  z-index: 9;
  position: absolute;
  width:100vw;
  height:100vh;
  display: flex;
  flex-direction:column;
  pointer-events:none;
}
.bg_black{
  background: rgba(0, 0, 0, 0.8)!important;
}
.bg_gray{
  background: rgba(0, 0, 0, 0.45);
  transition-duration: .35s;
}
.content>.content_top{
  pointer-events:none;
}
.content>.content_middle{
  display: flex;
  height: 200px;
  width:100%;
}
.content_middle_middle{
  width:200px;
  box-sizing:border-box;
  position: relative;
  transition-duration: .3s;
}
.content_middle_right{
  flex: auto;
}
.content>.content_bottom{
  flex: auto;
}
.image-cropper .img{
  z-index: 2;
  top:0;
  left:0;
  position: absolute;
  border:none;
  width:100%;
  backface-visibility: hidden;
  transform-origin:center;
}
.image-cropper-canvas{
  position: fixed;
  background: white;
  width:150px;
  height:150px;
  z-index: 10;
  top:-200%;
  pointer-events:none;
}
.border{
  background: white;
  pointer-events:auto;
  position:absolute;
}
.border-top-left{
  left:-2.5px;
  top:-2.5px;
  height:2.5px;
  width:33rpx;
}
.border-top-right{
  right:-2.5px;
  top:-2.5px;
  height:2.5px;
  width:33rpx;
}
.border-right-top{
  top:-1px;
  width:2.5px;
  height:30rpx;
  right:-2.5px;
}
.border-right-bottom{
  width:2.5px;
  height:30rpx;
  right:-2.5px;
  bottom:-1px;
}
.border-bottom-left{
  height:2.5px;
  width:33rpx;
  bottom:-2.5px;
  left:-2.5px;
}
.border-bottom-right{
  height:2.5px;
  width:33rpx;
  bottom:-2.5px;
  right:-2.5px;
}
.border-left-top{
  top:-1px;
  width:2.5px;
  height:30rpx;
  left:-2.5px;
}
.border-left-bottom{
  width:2.5px;
  height:30rpx;
  left:-2.5px;
  bottom:-1px;
}
</style>