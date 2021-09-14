<template>
<view>
<!-- pages/laboratory/list.wxml -->
<view class="search">
    <view class="title" @tap="hideAni" data-ele="0">
        <view>搜索数据</view>
        <view class="notice" :style="'--ani:' + (isShowNotice?'showNotice':'hideNotice')">
            {{notice}}
        </view>
    </view>
    <form id="card-body-0" :style="'--card-height:' + (heightData[0]?heightData[0]:'auto')" :class="'card-body ' + (hideData['ele_0']?'hide':'display')" @submit="doSubmit">
        <view class="input-form">
            <view class="item">
                <view>实验室：</view>
                <input type="text" name="cxMc" data-name="cxMc" @input="bindinput" v-model="cxMc" maxlength="20" confirm-type="search" @focus="showNotice" @blur="hideNotice" data-title="可输入名称的一部分" @confirm="doSubmit2">
            </view>
            <view class="item">
                <view>房间：</view>
                <input type="text" name="cxFjh" data-name="cxFjh" @input="bindinput" v-model="cxFjh" maxlength="8" confirm-type="search" @focus="showNotice" @blur="hideNotice" data-title="可只输入房间编号的左边部分" @confirm="doSubmit2">
            </view>
            <view class="item">
                <view>教学班：</view>
                <input type="text" name="cxJxb" data-name="cxJxb" @input="bindinput" v-model="cxJxb" maxlength="10" confirm-type="search" @focus="showNotice" @blur="hideNotice" data-title="可只输入班简名的左边部分" @confirm="doSubmit2">
            </view>
            <view class="item">
                <view>教师：</view>
                <input type="text" name="cxJs" data-name="cxJs" @input="bindinput" v-model="cxJs" maxlength="10" confirm-type="search" @focus="showNotice" @blur="hideNotice" data-title="可只输入姓名的左边部分" @confirm="doSubmit2">
            </view>
            <view class="item">
                <view>课程：</view>
                <input type="text" name="cxKc" data-name="cxKc" @input="bindinput" v-model="cxKc" maxlength="20" confirm-type="search" @focus="showNotice" @blur="hideNotice" data-title="可只输入课程名称的左边部分" @confirm="doSubmit2">
            </view>
            <view class="item">
                <view>时间范围：</view>
                <picker mode="selector" name="cxZt" data-name="cxZt" :range="cxZt" range-key="text" v-model="cxZt_index">
                    {{cxZt[cxZt_index].text}}
                </picker>
            </view>
            <view class="item">
                <view>第</view>
                <input type="number" name="cxZc" data-name="cxZc" @input="bindinput" v-model="cxZc" maxlength="2" confirm-type="search" @confirm="doSubmit2">
                <view>周</view>
            </view>
            <view class="item">
                <view>类别：</view>
                <picker mode="selector" name="cxLb" data-name="cxLb" :range="cxLb" range-key="text" v-model="cxLb_index">
                    {{cxLb[cxLb_index].text}}
                </picker>
            </view>
            <view class="item">
                <view>类型：</view>
                <picker mode="selector" name="cxXsms" data-name="cxXsms" :range="cxXsms" range-key="text" v-model="cxXsms_index">
                    {{cxXsms[cxXsms_index].text}}
                </picker>
            </view>
        </view>
        <button class="btn" type="primary" form-type="submit">搜索</button>
    </form>
</view>

<view class="result">
    <block v-for="(item, index) in retList" :key="index" v-if="retList.length>0">
        <view class="search">
            <view class="title">
                <navigator :url="'detail?' + item.link">{{item.name}}</navigator>
                <view @tap="hideAni" :data-ele="index + 1" :class="'iconfont icon-' + (!hideData['ele_' + (index+1)]?'shouqi':'zhankai')"></view>
            </view>
            <view :id="'card-body-' + (index+1)" :style="'--card-height:' + (heightData[index+1]?heightData[index+1]:'auto')" :class="'card-body ' + (hideData['ele_' + (index+1)]?'hide':'display')">
                <view class="place">
                    <block v-for="(place_item, place_index) in item.place" :key="place_index">
                        <!-- <view class="place__title" data-link="{{place_item.link}}">{{place_item.name}}</view> -->
                        <navigator class="place__title" :url="'detail?' + place_item.link">{{place_item.name}}</navigator>
                        <view class="place__body">
                            <block v-for="(lab_item, lab_index) in place_item.lab" :key="lab_index">
                                <!-- <view class="lab__name" data-link="{{lab_item.link}}" style="{{lab_item.style}}">{{lab_item.name}}</view> -->
                                <navigator class="lab__name" :url="'detail?' + lab_item.link" :style="lab_item.style">{{lab_item.name}}</navigator>
                            </block>
                        </view>
                    </block>
                </view>
            </view>
        </view>
    </block>
    <block v-if="retList.length===0">
        <view>没有数据</view>
    </block>
</view>

<!-- 回首页按钮悬浮按钮 -->
<view v-if="fromShare">
  <navigator url="/pages/index/index" open-type="reLaunch" class="floatBtn" style="bottom: 5%;font-size: x-large;">
    <view class="iconfont icon-shouye"></view>
  </navigator>
</view>
</view>
</template>

<script>
// pages/laboratory/list.js
import { getLabAll } from './api';

export default {
  data() {
    return {
      notice: "",
      cxMc: "",
      cxFjh: "",
      cxJxb: "",
      cxJs: "",
      cxKc: "",
      cxZt: [{
        id: "0",
        text: "无时间限制"
      }, {
        id: "8",
        text: "未结束授课"
      }, {
        id: "9",
        text: "授课已结束"
      }, {
        id: "A",
        text: "指定周次有课"
      }, {
        id: "1",
        text: "今天有课"
      }, {
        id: "2",
        text: "明天有课"
      }, {
        id: "3",
        text: "后天有课"
      }, {
        id: "4",
        text: "第4天有课"
      }, {
        id: "5",
        text: "第5天有课"
      }, {
        id: "6",
        text: "第6天有课"
      }, {
        id: "7",
        text: "第7天有课"
      }],
      cxZt_index: 0,
      cxZc: "",
      cxLb: [{
        id: "1",
        text: "实践教学"
      }, {
        id: "5",
        text: "开放实验室"
      }, {
        id: "6",
        text: "教师值班"
      }],
      cxLb_index: 0,
      cxXsms: [{
        id: "J",
        text: "简表"
      }, {
        id: "X",
        text: "详表"
      }],
      cxXsms_index: 0,
      hideData: {},
      heightData: [],
      retList: [],
      isShowNotice: false,
      hideDataundefined: false,
      fromShare: false
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log('onLoad')
    uni.showShareMenu({
      withShareTicket: true,
      // for wx
      menus: ["shareAppMessage", "shareTimeline"],
      // for qq
      showShareItems: ["qq", "qzone", "wechatFriends", "wechatMoment"]
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
		console.log('onReady')
    if ("undefined" !== typeof qq && 1 === getCurrentPages().length) {
      this.setData({
        fromShare: true
      });
    }
    this.doSubmit2();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		console.log('onShow')
  },

	mounted() {
		console.log('mounted')
	},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 分享至微信朋友圈
   */
  onShareTimeline: function (e) {
    let data = {
      cxMc: this.cxMc,
      cxFjh: this.cxFjh,
      cxJxb: this.cxJxb,
      cxJs: this.cxJs,
      cxKc: this.cxKc,
      cxZt: this.cxZt[this.cxZt_index].id,
      cxZc: this.cxZc,
      cxLb: this.cxLb[this.cxLb_index].id,
      cxXsms: this.cxXsms[this.cxXsms_index].id
    };
    let url = this.getUrlByParam(data);
    return {
      title: "实验安排表-We成信大",
      query: url
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let data = {
      cxMc: this.cxMc,
      cxFjh: this.cxFjh,
      cxJxb: this.cxJxb,
      cxJs: this.cxJs,
      cxKc: this.cxKc,
      cxZt: this.cxZt[this.cxZt_index].id,
      cxZc: this.cxZc,
      cxLb: this.cxLb[this.cxLb_index].id,
      cxXsms: this.cxXsms[this.cxXsms_index].id
    };
    let url = this.getUrlByParam(data);
    return {
      title: "实验安排表-We成信大",
      // for wechat
      path: "/pages/laboratory/list?" + url,
      // for qq
      query: url
    };
  },
  methods: {
    showNotice: function (e) {
      if (this.noticeTimeout) clearTimeout(this.noticeTimeout);
      this.setData({
        notice: e.currentTarget.dataset.title,
        isShowNotice: true
      });
    },
    hideNotice: function (e) {
      console.log(e);
      this.noticeTimeout = setTimeout(() => {
        this.setData({
          isShowNotice: false
        });
      }, 500);
    },
    hideAni: function (e) {
      let eleId = e.currentTarget.dataset.ele;
			const temp = JSON.parse(JSON.stringify(this.hideData))
      temp["ele_" + eleId] = !Boolean(this.hideData["ele_" + eleId]);
			this.hideData = temp
    },
    calAniHeight: function () {
      let query = uni.createSelectorQuery();

      for (let i = 0; i <= this.retList.length; i++) {
        query.select(`#card-body-${i}`).boundingClientRect();
      }

      query.exec(ret => {
        console.log('ret', ret);
        ret.forEach((v, i) => {
          this.heightData[i] = v.height + 'px';
        });
        this.setData({
          heightData: this.heightData
        });
      });
    },
    bindinput: function (e) {
      // 微信端使用双向绑定更佳
      // console.log(e);
      let data = e.currentTarget.dataset;
      this[data.name] = e.detail.value;
    },
    doSubmit: function (e) {
      let data = e.detail.value;
      data.cxLb = this.cxLb[data.cxLb].id;
      data.cxXsms = this.cxXsms[data.cxXsms].id;
      data.cxZt = this.cxZt[data.cxZt].id;
      this.requestForList(data);
    },
    doSubmit2: function () {
      let data = {
        cxMc: this.cxMc,
        cxFjh: this.cxFjh,
        cxJxb: this.cxJxb,
        cxJs: this.cxJs,
        cxKc: this.cxKc,
        cxZt: this.cxZt[this.cxZt_index].id,
        cxZc: this.cxZc,
        cxLb: this.cxLb[this.cxLb_index].id,
        cxXsms: this.cxXsms[this.cxXsms_index].id
      };
      this.requestForList(data);
    },
    getUrlByParam: function (param) {
      var url = "";

      for (field in param) {
        url += "&" + field + "=" + param[field];
      }

      return url == "" ? url : url.substring(1);
    },
    requestForList: function (param) {
      getLabAll(param).then(res => {
        const resp = res.data;
				const {data} = resp
				console.log(data)
				this.retList = data.list
				Object.getOwnPropertyNames(data.form).forEach(name=>{
					this[name] = data.form[name]
				})
				setTimeout(this.calAniHeight, 500)
        // this.calAniHeight();
      });
    }
  }
};
</script>
<style>
/* pages/laboratory/list.wxss */
@import "./iconfont.css";

page{
    background-color: #f7f7f7;
}
.search{
    background-color: #fff;
    border-radius: 7px;
    border: 1px solid #eee;
    padding: 10rpx;
    margin: 10rpx;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.card-body{
    min-height: 0;
    transition: height .5s;
    -webkit-transition: height .5s;
}
.display {
    height: var(--card-height);
}
.hide {
    height: 0px;
}
.search .title{
    display: flex;
    padding: 10rpx;
    justify-content: space-between;
}

.title > .notice{
    /* height: 30rpx; */
    animation: var(--ani) 2000ms forwards;
    --progress: 0%;
}

@keyframes showNotice{
    0%{
	    color:rgba(255, 0, 0, 0)
    }
    100%{
	    color:rgba(255,0,0,1)
    }
}
@keyframes hideNotice{
    from{
	    color:rgba(255,0,0,1)
    }
    to{
	    color:rgba(255,0,0,0)
    }
}
.input-form{
    display: flex;
    flex-wrap: wrap;
    font-size: small;
    margin: 10rpx;
    border-top: 1px solid #eee;
}

.item {
    display: flex;
    float: left;
    width: 45%;
    margin-top: 10rpx;
    margin-bottom: 10rpx;
}
input{
    width: 50%;
    background-color: #f7f7f7;
}

/* 搜索结果 */
.place{
    padding-left: 10rpx;
}
.place__title{
    padding: 15rpx 0rpx 3rpx 15rpx;
    font-size: medium;
    color:royalblue;
}
.place__body{
    padding: 10rpx 0rpx 0rpx 25rpx;
    display: flex;
    flex-wrap: wrap;
    font-size: small;
}
.place__body > navigator{
    width:50%;
    color: darkcyan;
}
</style>