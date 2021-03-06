function t(t) {
  var s = Object.assign(Object.create(null), i.userAgentStyles);

  for (var h in t) s[h] = (s[h] ? s[h] + ";" : "") + t[h];

  this.styles = s;
}

function s(t, s) {
  this.data = t, this.floor = 0, this.i = 0, this.list = [], this.res = s, this.state = this.Space;
}

var i = require("./config.js"),
    h = function (t) {
  return t >= "a" && t <= "z" || t >= "A" && t <= "Z";
};

t.prototype.getStyle = function (t) {
  this.styles = new s(t, this.styles).parse();
}, t.prototype.match = function (t, s) {
  var i,
      h = (i = this.styles[t]) ? i + ";" : "";
  if (s.class) for (var e, a = s.class.split(" "), o = 0; e = a[o]; o++) (i = this.styles["." + e]) && (h += i + ";");
  return (i = this.styles["#" + s.id]) && (h += i + ";"), h;
}, module.exports = t, s.prototype.parse = function () {
  for (var t; t = this.data[this.i]; this.i++) this.state(t);

  return this.res;
}, s.prototype.section = function () {
  return this.data.substring(this.start, this.i);
}, s.prototype.Space = function (t) {
  "." == t || "#" == t || h(t) ? (this.start = this.i, this.state = this.Name) : "/" == t && "*" == this.data[this.i + 1] ? this.Comment() : i.blankChar[t] || ";" == t || (this.state = this.Ignore);
}, s.prototype.Comment = function () {
  this.i = this.data.indexOf("*/", this.i) + 1, this.i || (this.i = this.data.length), this.state = this.Space;
}, s.prototype.Ignore = function (t) {
  "{" == t ? this.floor++ : "}" != t || --this.floor || (this.list = [], this.state = this.Space);
}, s.prototype.Name = function (t) {
  i.blankChar[t] ? (this.list.push(this.section()), this.state = this.NameSpace) : "{" == t ? (this.list.push(this.section()), this.Content()) : "," == t ? (this.list.push(this.section()), this.Comma()) : !h(t) && (t < "0" || t > "9") && "-" != t && "_" != t && (this.state = this.Ignore);
}, s.prototype.NameSpace = function (t) {
  "{" == t ? this.Content() : "," == t ? this.Comma() : i.blankChar[t] || (this.state = this.Ignore);
}, s.prototype.Comma = function () {
  for (; i.blankChar[this.data[++this.i]];);

  "{" == this.data[this.i] ? this.Content() : (this.start = this.i--, this.state = this.Name);
}, s.prototype.Content = function () {
  this.start = ++this.i, -1 == (this.i = this.data.indexOf("}", this.i)) && (this.i = this.data.length);

  for (var t, s = this.section(), i = 0; t = this.list[i++];) this.res[t] ? this.res[t] += ";" + s : this.res[t] = s;

  this.list = [], this.state = this.Space;
};