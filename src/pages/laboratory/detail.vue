<template>
  <view>
    <!--pages/laboratory/detail.wxml-->
    <view class="search">
      <view class="title" @tap="hideAni" data-ele="0">
        <view>搜索数据</view>
        <view class="notice" :style="'--ani:' + (isShowNotice?'showNotice':'hideNotice')">{{notice}}</view>
      </view>
      <form
        id="card-body-0"
        :style="'--card-height:' + (heightData['card-body-0']?heightData['card-body-0']:'auto')"
        :class="'card-body ' + (hideData['ele_0']?'hide':'display')"
        @submit="doSubmit"
      >
        <view class="input-form">
          <view class="item">
            <view>学期：</view>
            <input
              type="text"
              name="Kkxq"
              data-name="Kkxq"
              @input="bindinput"
              v-model="Kkxq"
              maxlength="5"
              @focus="showNotice"
              @blur="hideNotice"
              data-title="可输入名称的一部分"
              confirm-type="search"
              @confirm="doSubmit2"
            />
          </view>
          <view class="item">
            <view>院系：</view>
            <picker
              mode="selector"
              name="Yx"
              data-name="Yx"
              :range="Yx"
              range-key="text"
              v-model="Yx_index"
            >{{Yx[Yx_index].text}}</picker>
          </view>
          <view class="item">
            <view>任务：</view>
            <picker
              mode="selector"
              name="Rw"
              data-name="Rw"
              :range="Rw"
              range-key="text"
              v-model="Rw_index"
            >{{Rw[Rw_index].text}}</picker>
          </view>
          <view class="item">
            <view>实验室：</view>
            <input
              type="text"
              name="Sys"
              data-name="Sys"
              @input="bindinput"
              v-model="Sys"
              maxlength="16"
              confirm-type="search"
              @focus="showNotice"
              @blur="hideNotice"
              data-title="可输入名称的一部分"
              @confirm="doSubmit2"
            />
          </view>
          <view class="item">
            <view>房间：</view>
            <input
              type="text"
              name="Fj"
              data-name="Fj"
              @input="bindinput"
              v-model="Fj"
              maxlength="8"
              confirm-type="search"
              @focus="showNotice"
              @blur="hideNotice"
              data-title="可只输入房间编号的左边部分"
              @confirm="doSubmit2"
            />
          </view>
          <view class="item">
            <view>教学班：</view>
            <input
              type="text"
              name="Jxb"
              data-name="Jxb"
              @input="bindinput"
              v-model="Jxb"
              maxlength="10"
              confirm-type="search"
              @focus="showNotice"
              @blur="hideNotice"
              data-title="可只输入班简名的左边部分"
              @confirm="doSubmit2"
            />
          </view>
          <view class="item">
            <view>教师/助教：</view>
            <input
              type="text"
              name="Zjjs"
              data-name="Zjjs"
              @input="bindinput"
              v-model="Zjjs"
              maxlength="10"
              confirm-type="search"
              @focus="showNotice"
              @blur="hideNotice"
              data-title="可只输入姓名的左边部分"
              @confirm="doSubmit2"
            />
          </view>
          <view class="item">
            <view>课程：</view>
            <input
              type="text"
              name="Jxkc"
              data-name="Jxkc"
              @input="bindinput"
              v-model="Jxkc"
              maxlength="20"
              confirm-type="search"
              @focus="showNotice"
              @blur="hideNotice"
              data-title="可只输入课程名称的左边部分"
              @confirm="doSubmit2"
            />
          </view>
          <view class="item">
            <view>时间范围：</view>
            <picker
              mode="selector"
              name="cxZt"
              data-name="cxZt"
              :range="cxZt"
              range-key="text"
              v-model="cxZt_index"
            >{{cxZt[cxZt_index].text}}</picker>
          </view>
          <view class="item">
            <view>第</view>
            <input
              type="number"
              name="cxZc"
              data-name="cxZc"
              @input="bindinput"
              v-model="cxZc"
              maxlength="2"
              @confirm="doSubmit2"
            />
            <view>周</view>
          </view>
          <view class="item">
            <view>类别：</view>
            <picker
              mode="selector"
              name="Lb"
              data-name="Lb"
              :range="Lb"
              range-key="text"
              v-model="Lb_index"
            >{{Lb[Lb_index].text}}</picker>
          </view>
        </view>
        <button class="btn" type="primary" form-type="submit">搜索</button>
      </form>
    </view>

    <view class="result">
      <!-- <block wx:if="{{!retList[0]}}">
        <view >空的</view>
      </block>-->
      <block v-for="(item, index) in retList" :key="index">
        <view class="search">
          <view class="title">
            <view>{{labDetail.getDay(index)}}</view>
            <view
              @tap="hideAni"
              :data-ele="(1+index)"
              :class="'iconfont icon-' + (!hideData['ele_' + (1+index)]?'shouqi':'zhankai')"
            ></view>
          </view>
          <view
            :id="'card-body-' + (1+index)"
            :style="'--card-height:' + (heightData['card-body-'+(1+index)]?heightData['card-body-'+(1+index)]:'auto')"
            :class="'card-body ' + (hideData['ele_' + (1+index)]?'hide':'display')"
          >
            <view class="lesson">
              <block v-for="(lesson_item, lesson_index) in item" :key="lesson_index">
                <view class="lesson__title">{{lesson_index}}</view>
                <view class="lesson__body">
                  <block v-for="(plan_item, plan_index) in lesson_item" :key="plan_index">
                    <!-- TODO: -->
                    <view
                      class="plan__name"
                      :style="{color:labDetail.getStyle(plan_item)}"
                    >{{plan_item}}</view>
                  </block>
                </view>
              </block>
            </view>
          </view>
        </view>
      </block>
    </view>

    <!-- 回首页按钮悬浮按钮 -->
    <view v-if="fromShare">
      <navigator
        url="/pages/index/index"
        open-type="reLaunch"
        class="floatBtn"
        style="bottom: 5%;font-size: x-large;"
      >
        <view class="iconfont icon-shouye"></view>
      </navigator>
    </view>
  </view>
</template>

<script module="labDetail" lang="wxs" src="./labDetail.wxs"></script>

<script>
// pages/laboratory/detail.js
import { getLabDetail } from "./api";
const app = getApp();

export default {
  data() {
    return {
      notice: "",
      Yx: [
        {
          id: "0",
          text: "不限院系"
        }
      ],
      Yx_index: 0,
      Rw: [
        {
          id: "1",
          text: "承担任务"
        },
        {
          id: "2",
          text: "负责课程"
        },
        {
          id: "3",
          text: "聘用教师"
        },
        {
          id: "4",
          text: "所管班级"
        }
      ],
      Rw_index: 0,
      cxZt: [
        {
          id: "0",
          text: "无时间限制"
        },
        {
          id: "8",
          text: "未结束授课"
        },
        {
          id: "9",
          text: "授课已结束"
        },
        {
          id: "A",
          text: "指定周次有课"
        },
        {
          id: "1",
          text: "今天有课"
        },
        {
          id: "2",
          text: "明天有课"
        },
        {
          id: "3",
          text: "后天有课"
        },
        {
          id: "4",
          text: "第4天有课"
        },
        {
          id: "5",
          text: "第5天有课"
        },
        {
          id: "6",
          text: "第6天有课"
        },
        {
          id: "7",
          text: "第7天有课"
        }
      ],
      cxZt_index: 0,
      Lb: [
        {
          id: "A",
          text: "理论教学"
        },
        {
          id: "1",
          text: "实践教学"
        },
        {
          id: "B",
          text: "实践教学-计划外"
        },
        {
          id: "9",
          text: "理论与实践教学"
        },
        {
          id: "5",
          text: "开放实验室"
        },
        {
          id: "6",
          text: "教师值班"
        },
        {
          id: "8",
          text: "学生值班"
        }
      ],
      Lb_index: 0,
      hideData: {},
      heightData: {},
      retList: [],
      isShowNotice: false,
      Kkxq: "",
      Sys: "",
      Fj: "",
      Jxb: "",
      Zjjs: "",
      Jxkc: "",
      cxZc: "",
      lesson_index: "",
      hideDataundefined: false,
      heightDataundefined: false,
      fromShare: false
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.options = options;
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
  onReady: function() {
    if ("undefined" !== typeof qq && 1 === getCurrentPages().length) {
      this.setData({
        fromShare: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.requestForDetail(this.options);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 分享至微信朋友圈
   */
  onShareTimeline: function(e) {
    let data = this.getFormData();
    let search = this.getUrlByParam(data);
    return {
      title: "实验安排表-We成信大",
      query: search
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let data = this.getFormData();
    let search = this.getUrlByParam(data);
    return {
      title: "实验安排表-We成信大",
      // for wechat
      path: `/pages/laboratory/detail?${search}`,
      // for qq
      query: search
    };
  },
  methods: {
    getFormData: function() {
      return {
        Kkxq: this.Kkxq,
        Yx: this.Yx[this.Yx_index].id,
        Rw: this.Rw[this.Rw_index].id,
        Sys: this.Sys,
        Fj: this.Fj,
        Jxb: this.Jxb,
        Zjjs: this.Zjjs,
        Jxkc: this.Jxkc,
        cxZt: this.cxZt[this.cxZt_index].id,
        cxZc: this.cxZc,
        Lb: this.Lb[this.Lb_index].id
      };
    },
    requestForDetail: function(param) {
      getLabDetail(param).then(res => {
        const resp = res.data;
        const { data } = resp;
        this.setData({
          retList: data.list
        });
        this.setData(data.form);
        setTimeout(this.calAniHeight, 500);
      });
    },
    showNotice: function(e) {
      if (this.noticeTimeout) clearTimeout(this.noticeTimeout);
      this.setData({
        notice: e.currentTarget.dataset.title,
        isShowNotice: true
      });
    },
    hideNotice: function(e) {
      this.noticeTimeout = setTimeout(() => {
        this.setData({
          isShowNotice: false
        });
      }, 500);
    },
    calAniHeight: function() {
      let query = uni.createSelectorQuery();
      query.select(`#card-body-0`).boundingClientRect();

      for (let key in this.retList) {
        query.select(`#card-body-${1 + key}`).boundingClientRect();
      }

      query.exec(ret => {
        if (null == ret) return;
        ret.forEach((v, i) => {
          this.heightData[v.id] = v.height + "px";
        });
        this.setData({
          heightData: this.heightData
        });
      });
    },
    hideAni: function(e) {
      let eleId = e.currentTarget.dataset.ele;
      const temp = JSON.parse(JSON.stringify(this.hideData));
      temp["ele_" + eleId] = !Boolean(this.hideData["ele_" + eleId]);
      this.hideData = temp;
    },
    doSubmit: function(e) {
      let data = e.detail.value;
      data.Yx = this.Yx[data.Yx].id;
      data.Rw = this.Rw[data.Rw].id;
      data.cxZt = this.cxZt[data.cxZt].id;
      data.Lb = this.Lb[data.Lb].id;

      this.requestForDetail(data);
    },
    doSubmit2: function() {
      let data = this.getFormData();
      this.requestForDetail(data);
    },
    getUrlByParam: function(param) {
      var url = "";

      for (field in param) {
        url += "&" + field + "=" + param[field];
      }

      return url == "" ? url : url.substring(1);
    },
    bindinput: function(e) {
      let data = e.currentTarget.dataset;
      this[data.name] = e.detail.value;
    }
  }
};
</script>
<style>
/* pages/laboratory/detail.wxss */
@import "./iconfont.css";

page {
  background-color: #f7f7f7;
}
.search {
  background-color: #fff;
  border-radius: 7px;
  border: 1px solid #eee;
  padding: 10rpx;
  margin: 10rpx;
  overflow: hidden;
}

.card-body {
  transition: height 0.5s;
  -webkit-transition: height 0.5s;
}
.display {
  height: var(--card-height);
}
.hide {
  height: 0px;
}

.search > .title {
  display: flex;
  padding: 10rpx;
  justify-content: space-between;
}

.title > .notice {
  /* height: 30rpx; */
  animation: var(--ani) 2000ms forwards;
  --progress: 0%;
}

@keyframes showNotice {
  0% {
    color: rgba(255, 0, 0, 0);
  }
  100% {
    color: rgba(255, 0, 0, 1);
  }
}
@keyframes hideNotice {
  from {
    color: rgba(255, 0, 0, 1);
  }
  to {
    color: rgba(255, 0, 0, 0);
  }
}
form {
  display: block;
}
.hide .input-form {
  border-top: none !important;
}
.input-form {
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
input {
  width: 50%;
  background-color: #f7f7f7;
}

/* 搜索结果 */
.lesson__title {
  padding: 20rpx 0rpx 0rpx 5rpx;
  font-size: medium;
  color: blueviolet;
}
.lesson__body {
  padding: 30rpx;
  font-size: small;
}
</style>