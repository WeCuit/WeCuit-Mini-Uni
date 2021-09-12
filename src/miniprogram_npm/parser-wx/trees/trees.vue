<template>
<view>
<block v-for="(n, i) in nodes" :key="i"><view v-if="n.name=='img'" :id="n.attrs.id" :class="'_img ' + n.attrs.class" :style="n.attrs.style" :data-attrs="n.attrs" @tap.stop="imgtap"><rich-text :nodes="[{attrs:{src:loading&&ctrl[i]!=2?loading:(lazyLoad&&!ctrl[i]?placeholder:n.attrs.src||''),alt:n.attrs.alt||'',width:n.attrs.width||'',style:'-webkit-touch-callout:none;max-width:100%;display:block'+(n.attrs.height?';height:'+n.attrs.height:'')},name:'img'}]"></rich-text><image class="_image" :src="lazyLoad&&!ctrl[i]?placeholder:n.attrs.src" :lazy-load="lazyLoad" :show-menu-by-longpress="!n.attrs.ignore" :data-i="i" :data-index="n.attrs.i" data-source="img" @load="loadImg" @error="error"></image></view><text v-else-if="n.type=='text'" decode>{{n.text}}</text><text v-else-if="n.name=='br'">\n</text><view v-else-if="n.name=='a'" :id="n.attrs.id" :class="'_a ' + n.attrs.class" hover-class="_hover" :style="n.attrs.style" :data-attrs="n.attrs" @tap.stop="canIUse?handler.visited:'linkpress'"><trees class="_node" :nodes="n.children"></trees></view><block v-else-if="n.name=='video'"><view v-if="n.lazyLoad&&!n.attrs.autoplay" :id="n.attrs.id" :class="'_video ' + n.attrs.class" :style="n.attrs.style" :data-i="i" @tap.stop="loadVideo"></view><video v-else :id="n.attrs.id" :class="n.attrs.class" :style="n.attrs.style" :autoplay="n.attrs.autoplay" :controls="n.attrs.controls" :loop="n.attrs.loop" :muted="n.attrs.muted" :poster="n.attrs.poster" :src="n.attrs.source[n.i||0]" :unit-id="n.attrs['unit-id']" :data-i="i" data-source="video" @error="error" @play="play"></video></block><audio v-else-if="n.name=='audio'" :id="n.attrs.id" :class="n.attrs.class" :style="n.attrs.style" :author="n.attrs.author" :autoplay="n.attrs.autoplay" :controls="n.attrs.controls" :loop="n.attrs.loop" :name="n.attrs.name" :poster="n.attrs.poster" :src="n.attrs.source[n.i||0]" :data-i="i" data-source="audio" @error="error" @play="play"></audio><ad v-else-if="n.name=='ad'" :class="n.attrs.class" :style="n.attrs.style" :unit-id="n.attrs['unit-id']" data-source="ad" @error="error"></ad><view v-else-if="n.name=='li'" :id="n.attrs.id" :class="n.attrs.class" :style="n.attrs.style + ';display:flex'"><view v-if="n.type=='ol'" class="_ol-bef">{{n.num}}</view><view v-else class="_ul-bef"><view v-if="n.floor%3==0" class="_ul-p1">█</view><view v-else-if="n.floor%3==2" class="_ul-p2"></view><view v-else class="_ul-p1" style="border-radius:50%">█</view></view><trees class="_node _li" :lazyLoad="lazyLoad" :loading="loading" :nodes="n.children"></trees></view><rich-text v-else-if="handler.use(n)" :id="n.attrs.id" :class="'_p __' + n.name" :nodes="[n]"></rich-text><trees v-else :id="n.attrs.id" :class="'_node _' + n.name + ' ' + n.attrs.class" :style="n.attrs.style" :lazyLoad="lazyLoad" :loading="loading" :nodes="n.children"></trees></block>
</view>
</template>

<script module="handler" lang="wxs" src="./handler.wxs"></script>

<script>
function _defineProperty(t, e, r) {
  return e in t ? Object.defineProperty(t, e, {
    value: r,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = r, t;
}
var t = require("../libs/config.js").errorImg;
import trees from "./trees";

export default {
  data() {
    return {
      canIUse: !!uni.chooseMessageFile,
      placeholder: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='225'/>",
      ctrl: [],
      i: ""
    };
  },

  components: {
    trees
  },
  props: {
    nodes: Array,
    lazyLoad: Boolean,
    loading: String
  },
  methods: {
    play: function (t) {
      if (this.top.group && this.top.group.pause(this.top.i), this.top.videoContexts.length > 1 && this.top.data.autopause) for (var e = this.top.videoContexts.length; e--;) this.top.videoContexts[e].id != t.currentTarget.id && this.top.videoContexts[e].pause();
    },
    imgtap: function (t) {
      var e = t.currentTarget.dataset.attrs;

      if (!e.ignore) {
        var r = !0;

        if (this.top.$emit("imgtap", {
          detail: {
            id: t.currentTarget.id,
            src: e.src,
            ignore: function () {
              return r = !1;
            }
          }
        }), r) {
          if (this.top.group) return this.top.group.preview(this.top.i, e.i);
          var i = this.top.imgList,
              a = i[e.i] ? i[e.i] : (i = [e.src], e.src);
          uni.previewImage({
            current: a,
            urls: i
          });
        }
      }
    },
    loadImg: function (t) {
      var e = t.target.dataset.i;
      this.lazyLoad && !this.ctrl[e] ? this.setData(_defineProperty({}, "ctrl[" + e + "]", 1)) : this.loading && 2 != this.ctrl[e] && this.setData(_defineProperty({}, "ctrl[" + e + "]", 2));
    },
    linkpress: function (t) {
      var e = !0,
          r = t.currentTarget.dataset.attrs;
      r.ignore = function () {
        return e = !1;
      }, this.top.$emit("linkpress", {
        detail: r
      }), e && (r["app-id"] ? uni.navigateToMiniProgram({
        appId: r["app-id"],
        path: r.path
      }) : r.href && ("#" == r.href[0] ? this.top.navigateTo({
        id: r.href.substring(1)
      }) : 0 == r.href.indexOf("http") || 0 == r.href.indexOf("//") ? uni.setClipboardData({
        data: r.href,
        success: function () {
          return uni.showToast({
            title: "链接已复制"
          });
        }
      }) : uni.navigateTo({
        url: r.href,
        fail: function () {
          uni.switchTab({
            url: r.href
          });
        }
      })));
    },
    error: function (e) {
      var r = e.target.dataset.source,
          i = e.target.dataset.i,
          a = this.nodes[i];

      if ("video" == r || "audio" == r) {
        var s = (a.i || 0) + 1;
        if (s < a.attrs.source.length) return this.setData(_defineProperty({}, "nodes[" + i + "].i", s));
      } else "img" == r && t && (this.top.imgList.setItem(e.target.dataset.index, t), this.setData(_defineProperty({}, "nodes[" + i + "].attrs.src", t)));

      this.top && this.top.$emit("error", {
        detail: {
          source: r,
          target: e.target,
          errMsg: e.detail.errMsg
        }
      });
    },
    loadVideo: function (t) {
      this.setData(_defineProperty({}, "nodes[" + t.target.dataset.i + "].attrs.autoplay", !0));
    }
  }
};
</script>
<style>
._a{display:inline;padding:1.5px 0 1.5px 0;color:#366092;word-break:break-all}._hover{text-decoration:underline;opacity:.7}._visited{color:#551a8b}._img{display:inline-block;max-width:100%;overflow:hidden}:host{display:inline}._blockquote,._div,._p,._ul,._ol,._li{display:block}._b,._strong{font-weight:bold}._code{font-family:monospace}._del{text-decoration:line-through}._em,._i{font-style:italic}._h1{font-size:2em}._h2{font-size:1.5em}._h3{font-size:1.17em}._h5{font-size:.83em}._h6{font-size:.67em}._h1,._h2,._h3,._h4,._h5,._h6{display:block;font-weight:bold}._image{display:block;width:100%;height:360px;margin-top:-360px;opacity:0}._ins{text-decoration:underline}._li{flex:1;width:0}._ol-bef{width:36px;margin-right:5px;text-align:right}._ul-bef{margin:0 12px 0 23px;line-height:normal}._ol-bef,._ul-bef{flex:none;user-select:none}._ul-p1{display:inline-block;width:.3em;height:.3em;overflow:hidden;line-height:.3em}._ul-p2{display:inline-block;width:.23em;height:.23em;border:.05em solid black;border-radius:50%}._q::before{content:'"'}._q::after{content:'"'}._sub{font-size:smaller;vertical-align:sub}._sup{font-size:smaller;vertical-align:super}.__bdi,.__bdo,.__ruby,.__rt{display:inline-block}._video{position:relative;display:inline-block;width:300px;height:225px;background-color:black}._video::after{position:absolute;top:50%;left:50%;margin:-15px 0 0 -15px;content:'';border-color:transparent transparent transparent white;border-style:solid;border-width:15px 0 15px 30px}
</style>