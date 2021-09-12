<template>
<view>
<scroll-view class="page page-select-city" :style="'height: ' + windowHeight + 'px;'" enable-back-to-top :scroll-into-view="intoView" scroll-y @scroll="onScroll">
  <view>
    <slot></slot>
  </view>
  <view v-for="(item, index) in list" :key="index" class="city_list_item" :id="item.alpha">
    <view class="city-group__title font-size-26 tips-color">{{item.alpha}}</view>
    <view class="city-group__content">
      <view class="city-group__list">
        <block v-for="(subItem, index2) in item.subItems" :key="index2">
          <view class="city-group__item thin-border-bottom" hover-class="bg-highlight" :data-item="subItem" @tap="choose">
              {{subItem.name}}
          </view>
        </block>
      </view>
    </view>
  </view>
</scroll-view>
<view class="anchor-bar__wrp wx-flex" catchtouchstart="scrollTo" catchtouchmove="scrollTo" catchtouchend="removeTouching">
  <view class="anchor-bar wx-flex__item">
    <view class="anchor-list">
      <block v-for="(alpha, index) in alphabet" :key="index">
        <view :class="'anchor-item ' + (current == alpha ? ( touching ? 'selected tapped' : 'selected' ): '')" :data-alpha="alpha">
          <view class="anchor-item__inner">{{alpha}}</view>
          <view class="anchor-item__pop">{{alpha}}</view>
        </view>
      </block>
    </view>
  </view>
</view>
</view>
</template>

<script>
module.exports =
/******/
(function (modules) {
  // webpackBootstrap

  /******/
  // The module cache

  /******/
  var installedModules = {};
  /******/

  /******/
  // The require function

  /******/

  function __webpack_require__(moduleId) {
    /******/

    /******/
    // Check if module is in cache

    /******/
    if (installedModules[moduleId]) {
      /******/
      return installedModules[moduleId].exports;
      /******/
    }
    /******/
    // Create a new module (and put it into the cache)

    /******/


    var module = installedModules[moduleId] = {
      /******/
      i: moduleId,

      /******/
      l: false,

      /******/
      exports: {}
      /******/

    };
    /******/

    /******/
    // Execute the module function

    /******/

    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/

    /******/
    // Flag the module as loaded

    /******/

    module.l = true;
    /******/

    /******/
    // Return the exports of the module

    /******/

    return module.exports;
    /******/
  }
  /******/

  /******/

  /******/
  // expose the modules object (__webpack_modules__)

  /******/


  __webpack_require__.m = modules;
  /******/

  /******/
  // expose the module cache

  /******/

  __webpack_require__.c = installedModules;
  /******/

  /******/
  // define getter function for harmony exports

  /******/

  __webpack_require__.d = function (exports, name, getter) {
    /******/
    if (!__webpack_require__.o(exports, name)) {
      /******/
      Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      });
      /******/
    }
    /******/

  };
  /******/

  /******/
  // define __esModule on exports

  /******/


  __webpack_require__.r = function (exports) {
    /******/
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/
      Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module'
      });
      /******/
    }
    /******/


    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    /******/
  };
  /******/

  /******/
  // create a fake namespace object

  /******/
  // mode & 1: value is a module id, require it

  /******/
  // mode & 2: merge all properties of value into the ns

  /******/
  // mode & 4: return value when already ns object

  /******/
  // mode & 8|1: behave like require

  /******/


  __webpack_require__.t = function (value, mode) {
    /******/
    if (mode & 1) value = __webpack_require__(value);
    /******/

    if (mode & 8) return value;
    /******/

    if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
    /******/

    var ns = Object.create(null);
    /******/

    __webpack_require__.r(ns);
    /******/


    Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value
    });
    /******/

    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) {
      return value[key];
    }.bind(null, key));
    /******/

    return ns;
    /******/
  };
  /******/

  /******/
  // getDefaultExport function for compatibility with non-harmony modules

  /******/


  __webpack_require__.n = function (module) {
    /******/
    var getter = module && module.__esModule ?
    /******/
    function getDefault() {
      return module['default'];
    } :
    /******/
    function getModuleExports() {
      return module;
    };
    /******/

    __webpack_require__.d(getter, 'a', getter);
    /******/


    return getter;
    /******/
  };
  /******/

  /******/
  // Object.prototype.hasOwnProperty.call

  /******/


  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/

  /******/
  // __webpack_public_path__

  /******/


  __webpack_require__.p = "";
  /******/

  /******/

  /******/
  // Load entry module and return exports

  /******/

  return __webpack_require__(__webpack_require__.s = 4);
  /******/
})(
/************************************************************************/

/******/
{
  /***/
  4: (
  /***/
  function (module, exports, __webpack_require__) {
    "use strict";

    var throttle = function throttle(func, wait, options) {
      var context = void 0;
      var args = void 0;
      var result = void 0;
      var timeout = null;
      var previous = 0;
      if (!options) options = {};

      var later = function later() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      };

      return function () {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;

        if (remaining <= 0 || remaining > wait) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }

        return result;
      };
    };

    Component({
      options: {
        addGlobalClass: true,
        pureDataPattern: /^_/
      },
      properties: {
        list: {
          type: Array,
          value: [],
          observer: function observer(newVal) {
            var _this = this;

            if (newVal.length === 0) return;
            var data = this;
            var alphabet = data.list.map(function (item) {
              return item.alpha;
            });
            this.setData({
              alphabet: alphabet,
              current: alphabet[0]
            }, function () {
              _this.computedSize();
            });
          }
        },
        vibrated: {
          type: Boolean,
          value: true
        }
      },
      data: {
        windowHeight: 612,
        current: 'A',
        intoView: '',
        touching: false,
        alphabet: [],
        _tops: [],
        _anchorItemH: 0,
        _anchorItemW: 0,
        _anchorTop: 0,
        _listUpperBound: 0
      },
      lifetimes: {
        created: function created() {},
        attached: function attached() {
          this.__scrollTo = throttle(this._scrollTo, 100, {});
          this.__onScroll = throttle(this._onScroll, 100, {});

          var _wx$getSystemInfoSync = uni.getSystemInfoSync(),
              windowHeight = _wx$getSystemInfoSync.windowHeight;

          this.setData({
            windowHeight: windowHeight
          });
        }
      },
      methods: {
        choose: function choose(e) {
          var item = e.target.dataset.item;
          this.$emit('choose', {
            detail: {
              item: item
            }
          });
        },
        scrollTo: function scrollTo(e) {
          this.__scrollTo(e);
        },
        _scrollTo: function _scrollTo(e) {
          var data = this;
          var clientY = e.changedTouches[0].clientY;
          var index = Math.floor((clientY - data._anchorTop) / data._anchorItemH);
          var current = data.alphabet[index];
          this.setData({
            current: current,
            intoView: current,
            touching: true
          });
          if (data.vibrated) uni.vibrateShort();
        },
        computedSize: function computedSize() {
          var data = this;
          var query = this.createSelectorQuery();
          query.selectAll('.city_list_item').boundingClientRect(function (rects) {
            var result = rects;
            data._tops = result.map(function (item) {
              return item.top;
            });
          }).exec();
          query.select('.anchor-list').boundingClientRect(function (rect) {
            data._anchorItemH = rect.height / data.alphabet.length;
            data._anchorItemW = rect.width;
            data._anchorTop = rect.top;
          }).exec();
          query.select('.page-select-city').boundingClientRect(function (rect) {
            data._listUpperBound = rect.top;
          });
        },
        removeTouching: function removeTouching() {
          var _this2 = this;

          setTimeout(function () {
            _this2.setData({
              touching: false
            });
          }, 150);
        },
        onScroll: function onScroll(e) {
          this.__onScroll(e);
        },
        _onScroll: function _onScroll(e) {
          var data = this;
          var _tops = data._tops,
              alphabet = data.alphabet;
          var scrollTop = e.detail.scrollTop;
          var current = '';

          if (scrollTop < _tops[0]) {
            current = alphabet[0];
          } else {
            for (var i = 0, len = _tops.length; i < len - 1; i++) {
              if (scrollTop >= _tops[i] && scrollTop < _tops[i + 1]) {
                current = alphabet[i];
              }
            }
          }

          if (!current) current = alphabet[alphabet.length - 1];
          this.setData({
            current: current
          });
        }
      }
    });
    /***/
  })
  /******/

});

export default {
  data() {
    return {
      list: [],
      intoView: "",
      alphabet: "",
      current: "",
      windowHeight: "",
      touching: false
    };
  },

  components: {},
  props: {},

  /******/
  i: moduleId,

  /******/
  l: false,

  /******/
  exports: {}
  /******/
  ,
  enumerable: true,
  get: getter,
  value: 'Module',
  value: true,
  enumerable: true,
  value: value,

  /***/
  4: (
  /***/
  function (module, exports, __webpack_require__) {
    "use strict";

    var throttle = function throttle(func, wait, options) {
      var context = void 0;
      var args = void 0;
      var result = void 0;
      var timeout = null;
      var previous = 0;
      if (!options) options = {};

      var later = function later() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      };

      return function () {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;

        if (remaining <= 0 || remaining > wait) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }

        return result;
      };
    };

    Component({
      options: {
        addGlobalClass: true,
        pureDataPattern: /^_/
      },
      properties: {
        list: {
          type: Array,
          value: [],
          observer: function observer(newVal) {
            var _this = this;

            if (newVal.length === 0) return;
            var data = this;
            var alphabet = data.list.map(function (item) {
              return item.alpha;
            });
            this.setData({
              alphabet: alphabet,
              current: alphabet[0]
            }, function () {
              _this.computedSize();
            });
          }
        },
        vibrated: {
          type: Boolean,
          value: true
        }
      },
      data: {
        windowHeight: 612,
        current: 'A',
        intoView: '',
        touching: false,
        alphabet: [],
        _tops: [],
        _anchorItemH: 0,
        _anchorItemW: 0,
        _anchorTop: 0,
        _listUpperBound: 0
      },
      lifetimes: {
        created: function created() {},
        attached: function attached() {
          this.__scrollTo = throttle(this._scrollTo, 100, {});
          this.__onScroll = throttle(this._onScroll, 100, {});

          var _wx$getSystemInfoSync = uni.getSystemInfoSync(),
              windowHeight = _wx$getSystemInfoSync.windowHeight;

          this.setData({
            windowHeight: windowHeight
          });
        }
      },
      methods: {
        choose: function choose(e) {
          var item = e.target.dataset.item;
          this.$emit('choose', {
            detail: {
              item: item
            }
          });
        },
        scrollTo: function scrollTo(e) {
          this.__scrollTo(e);
        },
        _scrollTo: function _scrollTo(e) {
          var data = this;
          var clientY = e.changedTouches[0].clientY;
          var index = Math.floor((clientY - data._anchorTop) / data._anchorItemH);
          var current = data.alphabet[index];
          this.setData({
            current: current,
            intoView: current,
            touching: true
          });
          if (data.vibrated) uni.vibrateShort();
        },
        computedSize: function computedSize() {
          var data = this;
          var query = this.createSelectorQuery();
          query.selectAll('.city_list_item').boundingClientRect(function (rects) {
            var result = rects;
            data._tops = result.map(function (item) {
              return item.top;
            });
          }).exec();
          query.select('.anchor-list').boundingClientRect(function (rect) {
            data._anchorItemH = rect.height / data.alphabet.length;
            data._anchorItemW = rect.width;
            data._anchorTop = rect.top;
          }).exec();
          query.select('.page-select-city').boundingClientRect(function (rect) {
            data._listUpperBound = rect.top;
          });
        },
        removeTouching: function removeTouching() {
          var _this2 = this;

          setTimeout(function () {
            _this2.setData({
              touching: false
            });
          }, 150);
        },
        onScroll: function onScroll(e) {
          this.__onScroll(e);
        },
        _onScroll: function _onScroll(e) {
          var data = this;
          var _tops = data._tops,
              alphabet = data.alphabet;
          var scrollTop = e.detail.scrollTop;
          var current = '';

          if (scrollTop < _tops[0]) {
            current = alphabet[0];
          } else {
            for (var i = 0, len = _tops.length; i < len - 1; i++) {
              if (scrollTop >= _tops[i] && scrollTop < _tops[i + 1]) {
                current = alphabet[i];
              }
            }
          }

          if (!current) current = alphabet[alphabet.length - 1];
          this.setData({
            current: current
          });
        }
      }
    });
    /***/
  })
  /******/
  ,
  methods: {}
};
</script>
<style>
.wx-flex{display:flex;align-items:center}.wx-flex__item{flex:1}.thin-border-bottom{position:relative}.thin-border-bottom:after{content:"";position:absolute;left:0;bottom:0;right:0;height:1px;border-bottom:1px solid #EAEAEA;color:#e5e5e5;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleY(.5);transform:scaleY(.5);z-index:2}.thin-border-top{position:relative}.thin-border-top:after{content:"";position:absolute;left:0;top:0;right:0;height:1px;border-bottom:1px solid #EAEAEA;color:#e5e5e5;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleY(.5);transform:scaleY(.5);z-index:2}.square-tag{color:#9a9a9a;text-align:center;height:30px;line-height:30px;box-sizing:border-box;border-radius:2px;background-color:#f7f7f7;font-size:24rpx;position:relative}.square-tag:after{content:"";width:200%;height:200%;border:1px solid #f7f7f7;transform:scale(.5);transform-origin:0 0;position:absolute;left:0;top:0;box-sizing:border-box;border-radius:4px}.square-tag.selected{background:rgba(26,173,25,0.1);color:#1AAD19}.square-tag.selected:after{border:1px solid #1AAD19}.select-city__hd{padding:0 30rpx;position:fixed;height:50px;background-color:#fff;left:0;right:0;z-index:990}.select-city__hd.thin-border-bottom:after{left:24rpx;right:24rpx}.current-city__name{display:inline-block;margin-right:20rpx;margin-left:12rpx}.city-group_part .city-group__content{padding:0 30rpx}.city-group_part .city-group__title{padding-bottom:24rpx}.city-group__title{padding:24rpx 24rpx 12rpx}.city-group__content{font-size:0}.square-tag{width:200rpx;display:inline-block;margin-right:24rpx;margin-bottom:24rpx;height:80rpx;line-height:80rpx;font-size:30rpx;color:#000;background-color:rgba(0,0,0,0.02);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.city-group__item{padding:30rpx 24rpx;font-size:30rpx}.city-group__item.thin-border-bottom:after{left:24rpx}.city-group_all{padding-bottom:100rpx}.fixed__top{position:fixed;top:0;/*  #ifdef  H5  */top:calc(88rpx + constant(safe-area-inset-top));top:calc(88rpx + env(safe-area-inset-top))/*  #endif  */}.anchor-bar__wrp{position:fixed;top:0;/*  #ifdef  H5  */top:calc(88rpx + constant(safe-area-inset-top));top:calc(88rpx + env(safe-area-inset-top));/*  #endif  */bottom:0;right:0;width:60rpx;z-index:999}.anchor-item{font-size:0;text-align:center;position:relative}.anchor-item__inner{line-height:28rpx;height:28rpx;width:28rpx;border-radius:50%;display:inline-block;font-size:20rpx;margin:2rpx 0;font-weight:500}.tapped .anchor-item__pop{display:block}.anchor-item__pop{position:absolute;font-size:64rpx;width:100rpx;height:100rpx;line-height:100rpx;color:#fff;background-color:#C9C9C9;border-radius:50%;right:80rpx;top:50%;transform:translateY(-50%);display:none}.anchor-item__pop:after{content:"";display:block;position:absolute;width:0;height:0;left:80rpx;border:40rpx solid;border-color:transparent transparent transparent #C9C9C9;top:50%;transform:translateY(-50%)}.anchor-item.selected .anchor-item__inner{color:#fff;background-color:#1aad19}
</style>