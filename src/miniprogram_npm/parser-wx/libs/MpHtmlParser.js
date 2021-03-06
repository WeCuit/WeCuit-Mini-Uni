// 小程序富文本插件 https://github.com/jin-yufeng/Parser
var emoji;

function t(t) {
  var s = this,
      r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
  this.attrs = {}, this.CssHandler = new e(r.tagStyle, a), this.data = t, this.domain = r.domain, this.DOM = [], this.i = this.start = this.audioNum = this.imgNum = this.videoNum = 0, r.prot = (this.domain || "").includes("://") ? this.domain.split("://")[0] : "http", this.options = r, this.state = this.Text, this.STACK = [], this.bubble = function () {
    for (var t, e = s.STACK.length; t = s.STACK[--e];) {
      if (i.richOnlyTags[t.name]) return !1;
      t.c = 1;
    }

    return !0;
  }, this.decode = function (t, s) {
    for (var e, a, r = -1;;) {
      if (-1 == (r = t.indexOf("&", r + 1))) break;
      if (-1 == (e = t.indexOf(";", r + 2))) break;
      "#" == t[r + 1] ? (a = parseInt(("x" == t[r + 2] ? "0" : "") + t.substring(r + 2, e)), isNaN(a) || (t = t.substr(0, r) + String.fromCharCode(a) + t.substr(e + 1))) : (a = t.substring(r + 1, e), (i.entities[a] || a == s) && (t = t.substr(0, r) + (i.entities[a] || "&") + t.substr(e + 1)));
    }

    return t;
  }, this.getUrl = function (t) {
    return "/" == t[0] ? "/" == t[1] ? t = s.options.prot + ":" + t : s.domain && (t = s.domain + t) : s.domain && 0 != t.indexOf("data:") && !t.includes("://") && (t = s.domain + "/" + t), t;
  }, this.isClose = function () {
    return ">" == s.data[s.i] || "/" == s.data[s.i] && ">" == s.data[s.i + 1];
  }, this.section = function () {
    return s.data.substring(s.start, s.i);
  }, this.parent = function () {
    return s.STACK[s.STACK.length - 1];
  }, this.siblings = function () {
    return s.STACK.length ? s.parent().children : s.DOM;
  };
}

var i = require("./config.js"),
    s = i.blankChar,
    e = require("./CssHandler.js"),
    a = uni.getSystemInfoSync().windowWidth;

t.prototype.parse = function () {
  emoji && (this.data = emoji.parseEmoji(this.data));

  for (var t; t = this.data[this.i]; this.i++) this.state(t);

  for (this.state == this.Text && this.setText(); this.STACK.length;) this.popNode(this.STACK.pop());

  return this.DOM;
}, t.prototype.setAttr = function () {
  var t = this.attrName.toLowerCase(),
      e = this.attrVal;

  for (i.boolAttrs[t] ? this.attrs[t] = "T" : e && ("src" == t || "data-src" == t && !this.attrs.src ? this.attrs.src = this.getUrl(this.decode(e, "amp")) : "href" == t || "style" == t ? this.attrs[t] = this.decode(e, "amp") : "data-" != t.substr(0, 5) && (this.attrs[t] = e)), this.attrVal = ""; s[this.data[this.i]];) this.i++;

  this.isClose() ? this.setNode() : (this.start = this.i, this.state = this.AttrName);
}, t.prototype.setText = function () {
  var t,
      e = this.section();
  if (e) if (e = i.onText && i.onText(e, function () {
    return t = !0;
  }) || e, t) {
    this.data = this.data.substr(0, this.start) + e + this.data.substr(this.i);
    var a = this.start + e.length;

    for (this.i = this.start; this.i < a; this.i++) this.state(this.data[this.i]);
  } else {
    if (!this.pre) {
      for (var r, h, n = [], o = e.length; h = e[--o];) s[h] ? (" " != n[0] && n.unshift(" "), "\n" == h && void 0 == r && (r = 0)) : (n.unshift(h), r || (r = 1));

      if (0 == r) return;
      e = n.join("");
    }

    this.siblings().push({
      type: "text",
      text: this.decode(e)
    });
  }
}, t.prototype.setNode = function () {
  var t = {
    name: this.tagName.toLowerCase(),
    attrs: this.attrs
  },
      e = i.selfClosingTags[t.name];
  if (this.attrs = {}, i.ignoreTags[t.name]) {
    if (e) {
      if ("source" == t.name) {
        var r = this.parent();
        r && ("video" == r.name || "audio" == r.name) && t.attrs.src && r.attrs.source.push(t.attrs.src);
      } else "base" != t.name || this.domain || (this.domain = t.attrs.href);
    } else this.remove(t);
  } else {
    var h = t.attrs,
        n = this.CssHandler.match(t.name, h, t) + (h.style || ""),
        o = {};

    switch (h.id && (1 & this.options.compress ? h.id = void 0 : this.options.useAnchor && this.bubble()), 2 & this.options.compress && h.class && (h.class = void 0), t.name) {
      case "a":
      case "ad":
        this.bubble();
        break;

      case "font":
        if (h.color && (o.color = h.color, h.color = void 0), h.face && (o["font-family"] = h.face, h.face = void 0), h.size) {
          var l = parseInt(h.size);
          l < 1 ? l = 1 : l > 7 && (l = 7);
          var d = ["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large"];
          o["font-size"] = d[l - 1], h.size = void 0;
        }

        break;

      case "embed":
        var p = t.attrs.src || "",
            c = t.attrs.type || "";
        if (c.includes("video") || p.includes(".mp4") || p.includes(".3gp") || p.includes(".m3u8")) t.name = "video";else {
          if (!(c.includes("audio") || p.includes(".m4a") || p.includes(".wav") || p.includes(".mp3") || p.includes(".aac"))) break;
          t.name = "audio";
        }
        t.attrs.autostart && (t.attrs.autoplay = "T"), t.attrs.controls = "T";

      /*fallsthrough*/

      case "video":
      case "audio":
        h.id ? this[t.name + "Num"]++ : h.id = t.name + ++this[t.name + "Num"], "video" == t.name && (this.videoNum > 3 && (t.lazyLoad = 1), h.width && (o.width = parseFloat(h.width) + (h.width.includes("%") ? "%" : "px"), h.width = void 0), h.height && (o.height = parseFloat(h.height) + (h.height.includes("%") ? "%" : "px"), h.height = void 0)), h.controls || h.autoplay || (h.controls = "T"), h.source = [], h.src && (h.source.push(h.src), h.src = void 0), this.bubble();
        break;

      case "td":
      case "th":
        if (h.colspan || h.rowspan) for (var u, f = this.STACK.length; u = this.STACK[--f];) if ("table" == u.name) {
          u.flag = 1;
          break;
        }
    }

    h.align && ("table" == t.name ? "center" == h.align ? o["margin-inline-start"] = o["margin-inline-end"] = "auto" : o.float = h.align : o["text-align"] = h.align, h.align = void 0);
    var g = n.split(";");
    n = "";

    for (var m = 0, v = g.length; m < v; m++) {
      var b = g[m].split(":");

      if (!(b.length < 2)) {
        var y = b[0].trim().toLowerCase(),
            x = b.slice(1).join(":").trim();
        "-" == x[0] || x.includes("safe") ? n += ";" + y + ":" + x : o[y] && !x.includes("import") && o[y].includes("import") || (o[y] = x);
      }
    }

    if ("img" == t.name) {
      h.src && !h.ignore && (this.bubble() ? h.i = (this.imgNum++).toString() : h.ignore = "T"), h.ignore && (n += ";-webkit-touch-callout:none", o["max-width"] = "100%");
      var w;
      o.width ? w = o.width : h.width && (w = h.width.includes("%") ? h.width : parseFloat(h.width) + "px"), w && (o.width = w, h.width = "100%", parseInt(w) > a && (o.height = "", h.height && (h.height = void 0))), o.height ? (h.height = o.height, o.height = "") : h.height && !h.height.includes("%") && (h.height = parseFloat(h.height) + "px");
    }

    for (var C in o) {
      var T = o[C];

      if (T) {
        if ((C.includes("flex") || "order" == C || "self-align" == C) && (t.c = 1), T.includes("url")) {
          var A = T.indexOf("(");

          if (-1 != A++) {
            for (; '"' == T[A] || "'" == T[A] || s[T[A]];) A++;

            T = T.substr(0, A) + this.getUrl(T.substr(A));
          }
        } else T.includes("rpx") ? T = T.replace(/[0-9.]+\s*rpx/g, function (t) {
          return parseFloat(t) * a / 750 + "px";
        }) : "white-space" == C && T.includes("pre") && !e && (this.pre = t.pre = !0);

        n += ";" + C + ":" + T;
      }
    }

    n = n.substr(1), n && (h.style = n), e ? i.filter && 0 == i.filter(t, this) || this.siblings().push(t) : (t.children = [], "pre" == t.name && i.highlight && (this.remove(t), this.pre = t.pre = !0), this.siblings().push(t), this.STACK.push(t));
  }
  "/" == this.data[this.i] && this.i++, this.start = this.i + 1, this.state = this.Text;
}, t.prototype.remove = function (t) {
  var e = this,
      a = t.name,
      r = this.i,
      h = function () {
    var i = e.data.substring(r, e.i + 1);
    t.attrs.xmlns = "http://www.w3.org/2000/svg";

    for (var s in t.attrs) "viewbox" == s ? i = ' viewBox="' + t.attrs.viewbox + '"' + i : "style" != s && (i = " " + s + '="' + t.attrs[s] + '"' + i);

    i = "<svg" + i;
    var a = e.parent();
    "100%" == t.attrs.width && a && (a.attrs.style || "").includes("inline") && (a.attrs.style = "width:300px;max-width:100%;" + a.attrs.style), e.siblings().push({
      name: "img",
      attrs: {
        src: "data:image/svg+xml;utf8," + i.replace(/#/g, "%23"),
        style: t.attrs.style,
        ignore: "T"
      }
    });
  };

  if ("svg" == t.name && "/" == this.data[r]) return h(this.i++);

  for (;;) {
    if (-1 == (this.i = this.data.indexOf("</", this.i + 1))) return void (this.i = "pre" == a || "svg" == a ? r : this.data.length);

    for (this.start = this.i += 2; !s[this.data[this.i]] && !this.isClose();) this.i++;

    if (this.section().toLowerCase() == a) return "pre" == a ? (this.data = this.data.substr(0, r + 1) + i.highlight(this.data.substring(r + 1, this.i - 5), t.attrs) + this.data.substr(this.i - 5), this.i = r) : ("style" == a ? this.CssHandler.getStyle(this.data.substring(r + 1, this.i - 7)) : "title" == a && (this.DOM.title = this.data.substring(r + 1, this.i - 7)), -1 == (this.i = this.data.indexOf(">", this.i)) && (this.i = this.data.length), void ("svg" == a && h()));
  }
}, t.prototype.popNode = function (t) {
  if (t.pre) {
    t.pre = this.pre = void 0;

    for (var s = this.STACK.length; s--;) this.STACK[s].pre && (this.pre = !0);
  }

  var e = this.siblings(),
      a = e.length,
      r = t.children;
  if ("head" == t.name || i.filter && 0 == i.filter(t, this)) return e.pop();
  var h = t.attrs;
  if (i.blockTags[t.name] ? t.name = "div" : i.trustTags[t.name] || (t.name = "span"), t.c && ("ul" == t.name || "ol" == t.name)) if ((t.attrs.style || "").includes("list-style:none")) for (var n, o = 0; n = r[o++];) "li" == n.name && (n.name = "div");else if ("ul" == t.name) {
    for (var l = 1, d = this.STACK.length; d--;) "ul" == this.STACK[d].name && l++;

    if (1 != l) for (var p = r.length; p--;) r[p].floor = l;
  } else for (var c, u = 0, f = 1; c = r[u++];) "li" == c.name && (c.type = "ol", c.num = function (t, i) {
    if ("a" == i) return String.fromCharCode(97 + (t - 1) % 26);
    if ("A" == i) return String.fromCharCode(65 + (t - 1) % 26);

    if ("i" == i || "I" == i) {
      t = (t - 1) % 99 + 1;
      var s = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
          e = ["X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
          a = (e[Math.floor(t / 10) - 1] || "") + (s[t % 10 - 1] || "");
      return "i" == i ? a.toLowerCase() : a;
    }

    return t;
  }(f++, h.type) + ".");

  if ("table" == t.name) {
    var g = parseFloat(h.cellpadding),
        m = parseFloat(h.cellspacing),
        v = parseFloat(h.border);

    if (t.c && (isNaN(g) && (g = 2), isNaN(m) && (m = 2)), v && (h.style = "border:" + v + "px solid gray;" + (h.style || "")), t.flag && t.c) {
      t.flag = void 0, h.style = (h.style || "") + ";display:grid" + (m ? ";grid-gap:" + m + "px;padding:" + m + "px" : ";border-left:0;border-top:0");
      var b,
          y = 1,
          x = 1,
          w = [],
          C = [],
          T = {};
      !function t(i) {
        for (var s = 0; s < i.length; s++) "tr" == i[s].name ? w.push(i[s]) : t(i[s].children || []);
      }(t.children);

      for (var A = 0; A < w.length; A++) {
        for (var N, S = 0; N = w[A].children[S]; S++) if ("td" == N.name || "th" == N.name) {
          for (; T[y + "." + x];) x++;

          var I = {
            name: "div",
            c: 1,
            attrs: {
              style: (N.attrs.style || "") + (v ? ";border:" + v + "px solid gray" + (m ? "" : ";border-right:0;border-bottom:0") : "") + (g ? ";padding:" + g + "px" : "")
            },
            children: N.children
          };

          if (N.attrs.colspan && (I.attrs.style += ";grid-column-start:" + x + ";grid-column-end:" + (x + parseInt(N.attrs.colspan)), N.attrs.rowspan || (I.attrs.style += ";grid-row-start:" + y + ";grid-row-end:" + (y + 1)), x += parseInt(N.attrs.colspan) - 1), N.attrs.rowspan) {
            I.attrs.style += ";grid-row-start:" + y + ";grid-row-end:" + (y + parseInt(N.attrs.rowspan)), N.attrs.colspan || (I.attrs.style += ";grid-column-start:" + x + ";grid-column-end:" + (x + 1));

            for (var K = 1; K < N.attrs.rowspan; K++) T[y + K + "." + x] = 1;
          }

          C.push(I), x++;
        }

        b || (b = x - 1, h.style += ";grid-template-columns:repeat(" + b + ",auto)"), x = 1, y++;
      }

      t.children = C;
    } else t.c && (h.style = (h.style || "") + ";display:table"), h.style = "border-spacing:" + m + "px;" + (h.style || ""), (v || g || t.c) && function i(s) {
      for (var e, a = 0; e = s[a]; a++) if ("text" != e.type) {
        var r = e.attrs.style || "";
        t.c && "t" == e.name[0] && (e.c = 1, r += ";display:table-" + ("th" == e.name || "td" == e.name ? "cell" : "tr" == e.name ? "row" : "row-group")), "th" == e.name || "td" == e.name ? (v && (r = "border:" + v + "px solid gray;" + r), g && (r = "padding:" + g + "px;" + r)) : i(e.children || []), r && (e.attrs.style = r);
      }
    }(r);

    if (this.options.autoscroll) {
      var O = Object.assign({}, t);
      t.name = "div", t.attrs = {
        style: "overflow:scroll"
      }, t.children = [O];
    }
  }

  this.CssHandler.pop && this.CssHandler.pop(t), "div" != t.name || Object.keys(h).length || 1 != r.length || "div" != r[0].name || (e[a - 1] = r[0]);
}, t.prototype.Text = function (t) {
  if ("<" == t) {
    var i = this.data[this.i + 1],
        s = function (t) {
      return t >= "a" && t <= "z" || t >= "A" && t <= "Z";
    };

    s(i) ? (this.setText(), this.start = this.i + 1, this.state = this.TagName) : "/" == i ? (this.setText(), s(this.data[++this.i + 1]) ? (this.start = this.i + 1, this.state = this.EndTag) : this.Comment()) : "!" != i && "?" != i || (this.setText(), this.Comment());
  }
}, t.prototype.Comment = function () {
  var t;
  t = "--" == this.data.substring(this.i + 2, this.i + 4) ? "--\x3e" : "[CDATA[" == this.data.substring(this.i + 2, this.i + 9) ? "]]>" : ">", -1 == (this.i = this.data.indexOf(t, this.i + 2)) ? this.i = this.data.length : this.i += t.length - 1, this.start = this.i + 1, this.state = this.Text;
}, t.prototype.TagName = function (t) {
  if (s[t]) {
    for (this.tagName = this.section(); s[this.data[this.i]];) this.i++;

    this.isClose() ? this.setNode() : (this.start = this.i, this.state = this.AttrName);
  } else this.isClose() && (this.tagName = this.section(), this.setNode());
}, t.prototype.AttrName = function (t) {
  if ("=" == t || s[t] || this.isClose()) {
    if (this.attrName = this.section(), s[t]) for (; s[this.data[++this.i]];);

    if ("=" == this.data[this.i]) {
      for (; s[this.data[++this.i]];);

      this.start = this.i--, this.state = this.AttrValue;
    } else this.setAttr();
  }
}, t.prototype.AttrValue = function (t) {
  if ('"' == t || "'" == t) {
    if (this.start++, -1 == (this.i = this.data.indexOf(t, this.i + 1))) return this.i = this.data.length;
    this.attrVal = this.section(), this.i++;
  } else {
    for (; !s[this.data[this.i]] && !this.isClose(); this.i++);

    this.attrVal = this.section();
  }

  this.setAttr();
}, t.prototype.EndTag = function (t) {
  if (s[t] || ">" == t || "/" == t) {
    for (var i = this.section().toLowerCase(), e = this.STACK.length; e-- && this.STACK[e].name != i;);

    if (-1 != e) {
      for (var a; (a = this.STACK.pop()).name != i;) this.popNode(a);

      this.popNode(a);
    } else "p" != i && "br" != i || this.siblings().push({
      name: i,
      attrs: {}
    });

    this.i = this.data.indexOf(">", this.i), this.start = this.i + 1, -1 == this.i ? this.i = this.data.length : this.state = this.Text;
  }
}, module.exports = t;