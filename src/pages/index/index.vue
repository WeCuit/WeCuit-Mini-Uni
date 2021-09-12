<template>
<!-- index.wxml -->

<view>
  <!-- 幻灯片 -->
  <view>
    <swiper :indicator-dots="false" style="height: 38vh;" :autoplay="true" interval="5000" duration="500" :current="isADClose?0:0">
      <block v-for="(item, index) in notice" :key="index">
        <swiper-item>
          <view class="swiper-item" :style="'background:url(' + api + '' + item.path + ') no-repeat;background-size: 100% 100%;height: 100%;'" :data-type="item.type" :data-data="item.data" @tap="bindSwiper">
            <text class="swiper-text">{{item.text}}</text>
          </view>
        </swiper-item>
      </block>
      <swiper-item v-if="!isADClose">
        <ad unit-id="5454da2c63e03ff3889c8a2dc5e90fb3"></ad>
      </swiper-item>
    </swiper>
  </view>
  <!-- 群应用提示 -->
  <view class="groupApp" v-if="showGANotice">
    <view class="iconfont icon-yingyong" style="font-size:50rpx;padding:20rpx;"></view>
    <view>
      <view style="font-size:35rpx;">添加为群应用</view>
      <view style="font-size:30rpx;">欢迎成信大相关群添加本小程序</view>
    </view>
    <view>
      <button style="font-size:35rpx;" type="primary" class="groupAppBtn" open-type="addGroupApp" @addgroupapp="addGroupApp">
        添加
      </button>
    </view>
  </view>
  <view class="card">
    <view class="card-header">
      <view class="iconfont icon-chuangkou" style="align-self: flex-end;"></view>
      <view style="margin-left:15rpx">功能</view>
    </view>
    <view class="card-body">
      <!-- 功能列表 -->
      <view>
        <swiper style="height:400rpx" :current="isADClose?0:0">
          <view class="grid-item-container">
            <swiper-item v-for="(item, i) in menuList" :key="i">
              <block v-for="(item, j) in item" :key="j">
                <view class="grid-item-child">
                  <view :data-path="item.path" :data-needlogin="item.needLogin" @tap="item.action">
                    <!-- <icon class='grid-item-icon' type='{{item.type}}' size='{{item.size}}' color='{{item.color}}'/> -->
                    <view :class="'grid-item-icon iconfont ' + item.icon"></view>
                    <text class="grid-item-label">{{item.text}}</text>
                  </view>
                </view>
                <view v-if="!isADClose && i==1 && j==2" class="grid-item-child" style="width:50%">
                  <ad unit-id="cc64587dbbb385f7537d2b3a4f3b56fd" type="block" block-orientation="landscape" block-size="2"></ad>
                </view>
              </block>
            </swiper-item>
            <!-- <swiper-item wx:if="{{!isADClose}}">
            <ad unit-id="cc64587dbbb385f7537d2b3a4f3b56fd" type="block" block-orientation="landscape" block-size="1"></ad>
          </swiper-item> -->
          </view>
        </swiper>
      </view>
      <!-- 功能列表end -->
    </view>
  </view>
  <view class="card">
    <view class="card-header">
      <view class="iconfont icon-kebiao" style="align-self: flex-end;"></view>
      <view style="margin-left:15rpx">课程安排</view>
      <view style="margin-left:auto">{{location}}</view>
    </view>
    <view class="card-body">
      <!-- 课程 -->
      <view v-if="nowAndNextClass.length==0">
        <view class="card-content" :style="'color:' + cardColor[0].color + ';'">
          <view class="card-content-item">阁下</view>
          <view class="card-content-item">
            <view>还没有获取课表呢</view>
          </view>
          <view class="card-content-item">
            <view>╮(╯▽╰)╭</view>
          </view>
        </view>
      </view>
      <view v-else>
        <view v-for="(item, index) in nowAndNextClass" :key="index">
          <view class="card-content" :style="'background-color:' + cardColor[index].back + ';color:' + cardColor[index].color">
            <view class="card-content-item">
              <view>{{item.type}}</view>
              <view v-if="item.class_of_day">第{{item.class_of_day}}节</view>
            </view>
            <view class="card-content-item">
              <view>{{item.name}}</view>
              <view v-if="item.time[0]">{{item.time[0]}}-{{item.time[1]}}</view>
            </view>
            <view class="card-content-item">{{item.place}}</view>
          </view>
        </view>
      </view>
      <!-- 课程END -->
    </view>
  </view>
  <view class="card">
    <view class="card-header">
      <view class="iconfont icon-yiqiatong" style="align-self: flex-end;"></view>
      <view style="margin-left:15rpx">一卡通余额</view>
    </view>
    <view class="card-body" style="background: url(https://cuit.api.jysafe.cn/public/images/card-ecard.png) 100% 100%;">
      <!-- 一卡通余额 -->
      <view v-if="ballance">
        <view class="card-content">
          <view style="font-size:xx-large">{{ballance}}</view>
        </view>
      </view>
      <view v-else>
        <view class="card-content">
          <view style="font-size:xx-large">Loading~</view>
        </view>
      </view>
      <!-- 一卡通余额END -->
    </view>
  </view>
  <view class="card">
    <view class="card-header">
      <view class="iconfont icon-yiyan" style="align-self: flex-end;"></view>
      <view style="margin-left:15rpx">一言</view>
    </view>
    <view class="card-body">
      <!-- 一言 -->
      <view>
        <view class="card-content">
          <view>{{hitokoto}}</view>
        </view>
      </view>
      <!-- 一言END -->
    </view>
  </view>
  <view>
    <button class="buttonFix" plain="true" open-type="share">--分享给身边的同学一起使用吧--</button>
  </view>
  <!-- TabBar 占位 -->
  <view style="height: 10vh;"></view>
  <!-- <view wx:if="{{!isADClose}}" style="margin-bottom: 4rem;">
  <ad unit-id="240fc3785c9751daa217884bbd12334d" type="feeds"></ad>
</view> -->
</view>
</template>

<script>
//index.js
import { getConfig, getAccWallet } from './api'; //获取应用实例
//获取应用实例
const app = getApp();

export default {
  data() {
    return {
      api: "",
      showGANotice: false,
      menuList: [[{
        path: "../courseTable/courseTable",
        size: 30,
        color: "orange",
        action: "bindAction",
        icon: "icon-kebiao",
        text: "个人课表"
      }, {
        path: "../grade/grade",
        size: 30,
        color: "pink",
        action: "bindAction",
        icon: "icon-zhuxingtu",
        text: "成绩"
      }, {
        path: "../exam/exam",
        size: 30,
        color: "green",
        action: "bindAction",
        icon: "icon-kaoshi",
        text: "考试"
      }, {
        path: "../newsList/newsList?source=jwc",
        size: 30,
        color: "rgb(0,255,255)",
        action: "bindAction",
        icon: "icon-tongzhi",
        text: "教务公告"
      }, {
        path: "../card/card",
        size: 30,
        color: "purple",
        action: "bindAction",
        icon: "icon-yiqiatong",
        needLogin: true,
        text: "一卡通"
      }, {
        path: "../checkIn/list",
        size: 30,
        color: "#1296db",
        action: "bindAction",
        icon: "icon-daka",
        needLogin: true,
        text: "每日打卡"
      }, // {
      //   "type": "courseTableCom",
      //   "size": 30,
      //   "color": "blue",
      //   "action": "bindAction",
      //   "icon": "icon-kebiaoxinxi",
      //   "text": "公共课表"
      // },
      {
        path: "/welcome/pages/welcome",
        size: 30,
        color: "#185f97",
        action: "bindAction",
        icon: "icon-xinshengfuwu",
        text: "新生服务"
      }, // {
      //     path: "/map/pages/index",
      //     size: 30,
      //     color: "#185f97",
      //     action: "bindAction",
      //     icon: "icon-ditu",
      //     text: "游览校园",
      // },
      {
        path: "../calendar/calendar",
        size: 30,
        color: "#32CD32",
        action: "bindAction",
        text: "校历/地图",
        icon: "icon-calendar"
      }], [{
        path: "../laboratory/list",
        size: 30,
        color: "#185f97",
        action: "bindAction",
        icon: "icon-shiyanshijianshe",
        text: "实验查询"
      }, {
        path: "../officeGrade/query",
        size: 30,
        color: "#32CD32",
        action: "bindAction",
        text: "office\r\n成绩查询",
        icon: "icon-office"
      }, // {
      //     path: "../vote/vote",
      //     size: 30,
      //     color: "#32CD32",
      //     action: "bindAction",
      //     text: "教师评选",
      //     icon: "icon-toupiao",
      // },
      {
        path: "/college/pages/list/list",
        size: 30,
        color: "purple",
        action: "bindAction",
        icon: "icon-xueyuan",
        text: "学院信息"
      } // {
      //     path: "../THEOL/THEOL",
      //     size: 30,
      //     color: "purple",
      //     action: "bindAction",
      //     needLogin: true,
      //     icon: "icon-jiaoxuepingtai",
      //     text: "教学平台",
      // },
      // {
      //     path: "",
      //     size: 30,
      //     color: "purple",
      //     action: "testAction",
      //     icon: "",
      //     text: "测试",
      // },
      ]],
      notice: [],
      cardColor: [{
        color: "cornflowerblue"
      }, {
        color: "steelblue"
      }],
      nowAndNextClass: [],
      ballance: null,
      hitokoto: "醉笑陪君三千场，不诉离殇。",
      isADClose: app.globalData.isADClose,
      i: 0,
      j: 0,
      location: "",
      selected: 0,
      maintenance: false,
      maintenanceBText: "",
      maintenanceOText: "",
      isShow: false
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    this.setData({
      api: app.globalData.API_DOMAIN
    });
    uni.showShareMenu({
      withShareTicket: true,
      // for wx
      menus: ["shareAppMessage", "shareTimeline"],
      // for qq
      showShareItems: ["qq", "qzone", "wechatFriends", "wechatMoment"]
    });
    uni.getStorage({
      key: "config",
      success: res => {
        this.setData({
          notice: res.data.notice
        }); // 一小时更新一次配置

        if (parseInt(new Date().getTime() / 1000) - res.data.timestamp > 60 * 60) this.getConfig();
      },
      fail: err => {
        this.getConfig();
      }
    });
  },
  onShow: function () {
    // 广告关闭
    if (this.isADClose !== app.globalData.isADClose) {
      this.setData({
        isADClose: app.globalData.isADClose
      });
    }

    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }

    if ("object" == typeof qq) {
      // qq 添加群应用
      this.checkGroupAdmin();
    } // 一卡通余额


    uni.getStorage({
      key: "CARD_AccNum",
      success: res => {
        if (res.data) {
          this.CARD_AccNum = res.data;
          this.getWalletDetail();
        }
      },
      fail: err => {
        this.setData({
          ballance: "卡号未获取╮(╯▽╰)╭"
        });
      }
    });
    this.setData({
      location: "string" == typeof app.globalData.location && app.globalData.location.length > 0 ? app.globalData.location == "hkg" ? "航空港" : "龙泉" : ""
    });
    this.getClasses();
    this.hitokotoGet();
  },

  /**
   * 分享至微信朋友圈
   */
  onShareTimeline: function (e) {
    // console.log(e)
    return {
      title: "We成信大",
      query: ""
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "We成信大",
      // for wechat
      path: "/pages/index/index",
      // for qq
      query: ""
    };
  },
  methods: {
    getConfig: function () {
      getConfig().then(res => {
        const resp = res.data;
        const data = resp.data;

        if ("object" === typeof data) {
          app.globalData.config = data;
          data.timestamp = parseInt(new Date().getTime() / 1000);
          this.setData({
            notice: data.notice
          });
          uni.setStorage({
            key: "config",
            data: data
          });
        }
      }).catch(err => {});
    },
    bindAction: function (e) {
      var data = e.currentTarget.dataset;
      console.log(data);

      if (data.needlogin && !app.globalData.isUser) {
        uni.showToast({
          title: "需要登录",
          icon: "none"
        });
        return;
      }

      uni.navigateTo({
        url: data.path,
        fail: function (res) {
          uni.showToast({
            title: "该功能暂未开发",
            icon: "none"
          });
        }
      });
    },
    bindSwiper: function (e) {
      var data = e.currentTarget.dataset;

      switch (data.type) {
        case "html":
          uni.navigateTo({
            url: "../articleView/articleView?type=html&link=" + app.globalData.API_DOMAIN + data.data
          });
          break;

        default:
          uni.showToast({
            icon: "none",
            title: "未知操作"
          });
      }
    },
    testAction: function () {
      console.log("测试动作");
      this.setData({
        maintenance: true,
        maintenanceBText: "系统正在维护~",
        maintenanceOText: "维护时间：\r\n01-01 10:00 至 01-02 12:00"
      });
      uni.setNavigationBarTitle({
        title: "系统维护"
      });
      this.getTabBar().setData({
        isShow: false
      });
    },
    // 添加群应用部分显示判断
    checkGroupAdmin: function () {
      let launchInfo = qq.getLaunchOptionsSync();
      let {
        entryDataHash
      } = launchInfo; // 注意，当小程序切后台后，再打开 entryDataHash 会改变，可用 qq.onAppShow 监听小程序切前台事件

      qq.onAppShow(function (res) {
        entryDataHash = res.entryDataHash;
      });
      if (undefined == entryDataHash) return; // 是否管理员

      qq.getGroupInfo({
        entryDataHash,
        success: res => {
          if (res.isGroupManager) {
            // 是否已添加为群应用
            qq.getGroupAppStatus({
              entryDataHash: entryDataHash,
              success: res => {
                console.log("getGroupAppStatus success: ", res);

                if (!res.isExisted) {
                  // 未添加
                  this.setData({
                    showGANotice: true
                  });
                }
              },

              fail(res) {
                console.log("getGroupAppStatus fail: ", res);
              },

              complete(res) {}

            });
          }
        },

        fail(res) {},

        complete(res) {}

      });
    },
    // 添加群应用的回调事件
    addGroupApp: function (e) {
      console.log("添加群应用的回调事件", e);
    },
    getClasses: function () {
      /**
       * 第几周-->第几天-->第几节-->持续时间
       */
      if (0 == app.globalData.classtable.length) {
        this.setData({
          nowAndNextClass: []
        });
        return;
      }

      if (!app.globalData.start) {
        console.error("开学时间异常");
        return;
      }

      var now = new Date(); // 开学到现在的天数

      const diff_day_without_increment = parseInt((now - app.globalData.start) / (1000 * 60 * 60 * 24)); // 当前周数

      const week_num = parseInt(diff_day_without_increment / 7 + 1); // 今天周几

      const today = diff_day_without_increment % 7; // console.log("----第" + week_num + "周，周" + today);
      // [当前第几节课， 下节第几节课]

      const no = this.getNowClassStatus();
      var list = [];

      if (-1 == no[0] && -1 == no[1]) {
        list.push({
          type: "这么晚了",
          class_of_day: 0,
          name: "还不睡啊",
          place: "~"
        });
        this.setData({
          nowAndNextClass: list
        });
        return;
      } // 获取今天课程


      var today_list = [];

      for (var i = 0; i < app.globalData.classtable.length; i++) {
        if (today === app.globalData.classtable[i].day_of_week && app.globalData.classtable[i].week_num.indexOf(week_num) != -1) {
          // 一节课的情况
          // no[1] <= app.classtable[i].class_of_day
          today_list.push({
            day_of_week: app.globalData.classtable[i].day_of_week,
            class_of_day: app.globalData.classtable[i].class_of_day,
            duration: app.globalData.classtable[i].duration,
            name: app.globalData.classtable[i].name,
            place: app.globalData.classtable[i].place,
            teacherName: app.globalData.classtable[i].teacherName
          });
        }
      } // 按第几节排序


      today_list.sort((a, b) => {
        return a.class_of_day - b.class_of_day;
      }); // 当前课程

      if (0 === no[0]) {
        list.push({
          type: "当前",
          class_of_day: 0,
          name: "下课时间",
          place: "要做好课前准备哦"
        });
      } else {
        for (var i = 0; i < today_list.length; i++) {
          if (no[0] === today_list[i].class_of_day || no[0] === today_list[i].class_of_day + today_list[i].duration - 1) {
            list.push({
              type: "本节课程",
              class_of_day: no[0],
              name: today_list[i].name,
              time: this.courseTimeToTime(no[0], no[0]),
              place: today_list[i].place
            });
            break;
          }
        }

        if (0 === list.length) list.push({
          type: "当前",
          name: "下课时间",
          place: "要做好课前准备哦"
        });
      } // 下节课程


      if (no[1] > 0) {
        for (var i = 0; i < today_list.length; i++) {
          if (no[1] <= today_list[i].class_of_day) {
            list.push({
              type: "下节课程",
              class_of_day: today_list[i].class_of_day,
              name: today_list[i].name,
              time: this.courseTimeToTime(today_list[i].class_of_day, today_list[i].class_of_day),
              place: today_list[i].place
            });
            break;
          }

          if (no[1] <= today_list[i].class_of_day + today_list[i].duration - 1) {
            list.push({
              type: "下节课程",
              class_of_day: today_list[i].class_of_day + today_list[i].duration - 1,
              name: today_list[i].name,
              time: this.courseTimeToTime(today_list[i].class_of_day + today_list[i].duration - 1, today_list[i].class_of_day + today_list[i].duration - 1),
              place: today_list[i].place
            });
            break;
          }
        }
      }

      if (1 == list.length && !list[0].time) {
        list[0] = {
          type: "今天",
          class_of_day: 0,
          name: "似乎没课了哦",
          place: "o(*￣▽￣*)ブ"
        };
      }

      this.setData({
        nowAndNextClass: list
      });
    },

    /**
     * 获取上课状态(航空港)
     *
     * 返回  [当前课程序号， 下一节课程序号]
     */
    getNowClassStatus: function () {
      const h = new Date().getHours();
      const m = new Date().getMinutes();
      var hkg = true;
      if ("hkg" !== app.globalData.location) hkg = false;

      switch (h) {
        case 6:
        case 7:
          return [0, 1];

        case 8:
          if (hkg && m < 20 || !hkg && m < 30) return [0, 1];else return [1, 2];

        case 9:
          if (hkg && m < 5 || !hkg && m < 15) return [1, 2];else if (hkg && m < 15 || !hkg && m < 25) return [0, 2];else return [2, 3];

        case 10:
          if (hkg && m == 0 || !hkg && m < 10) return [2, 3];else if (m < 20) return [0, 3];else return [3, 4];

        case 11:
          if (m < 5) return [3, 4];else if (m < 15) return [0, 4];else return [4, 5];

        case 12:
        case 13:
          // 午间
          return [0, 5];

        case 14:
          if (m < 45) return [5, 6];else if (m < 55) return [0, 6];else return [6, 7];

        case 15:
          if (m < 40) return [6, 7];else return [0, 7];

        case 16:
          if (m < 45) return [7, 8];else if (m < 55) return [0, 8];else return [8, 9];

        case 17:
          if (m < 40) return [8, 9];

        case 18:
          // 下午放学
          return [0, 9];

        case 19:
          if (m < 30) return [0, 9];else return [9, 10];

        case 20:
          if (m < 15) return [9, 10];else if (m < 25) return [0, 10];else return [10, 11];
          break;

        case 21:
          if (m < 10) return [10, 11];else if (m < 20) return [0, 11];else return [11, 0];

        case 22:
          if (m < 5) return [11, 0];else return [0, 0];

        default:
          return [-1, -1];
      }
    },

    // 航空港作息时间
    courseTimeToTime(startTime, endTime) {
      if (startTime > endTime) {
        return;
      }

      var hkg = true;
      if ("hkg" !== app.globalData.location) hkg = false;

      switch (startTime) {
        case 1:
          startTime = hkg ? "8:20" : "8:30";
          break;

        case 2:
          startTime = hkg ? "9:15" : "9:25";
          break;

        case 3:
          startTime = "10:20";
          break;

        case 4:
          startTime = "11:15";
          break;

        case 5:
          startTime = "14:00";
          break;

        case 6:
          startTime = "14:55";
          break;

        case 7:
          startTime = "16:00";
          break;

        case 8:
          startTime = "16:55";
          break;

        case 9:
          startTime = "19:30";
          break;
      }

      switch (endTime) {
        case 1:
          endTime = hkg ? "9:05" : "9:15";
          break;

        case 2:
          endTime = hkg ? "10:00" : "10:10";
          break;

        case 3:
          endTime = "11:05";
          break;

        case 4:
          endTime = "12:00";
          break;

        case 5:
          endTime = "14:45";
          break;

        case 6:
          endTime = "15:40";
          break;

        case 7:
          endTime = "16:45";
          break;

        case 8:
          endTime = "17:40";
          break;

        case 9:
          endTime = "19:00";
          break;

        case 10:
          endTime = "20:30";
          break;
      }

      return [startTime, endTime];
    },

    // 获取钱包金额
    getWalletDetail: function () {
      getAccWallet(this.CARD_AccNum).then(res => {
        const resp = res.data;
        this.setData({
          ballance: parseFloat(resp.data.Rows[0].WalletRows[0].MonDBCurr) + parseFloat(resp.data.Rows[0].WalletRows[1].MonDBCurr)
        });
      }).catch(err => {});
    },
    hitokotoGet: function () {
      uni.request({
        url: "https://v1.hitokoto.cn/?encode=text",
        success: res => {
          this.setData({
            hitokoto: res.data
          });
        }
      });
    },

    item() {
      console.log("占位：函数 item 未声明");
    }

  }
};
</script>
<style>
/**index.wxss**/

.groupApp{
    display: flex;
    margin: 30rpx;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 0.5rem;
    font-size: small;
    justify-content: space-between;
}
.groupApp > view {
    margin:auto;
}
.groupApp > view > view:nth-child(2){
    color: gray;
}

/*
  九宫格容器布局样式
 */
.grid-item-container {
    display: -webkit-flex;
    display: flex;
    /* align-items: center; */
    justify-content: space-between;
    flex-wrap: wrap;
    /* border-top: 1rpx solid #D9D9D9; */
    /* box-shadow: 0px 0px 20px 2px #b4b4b4; */
    margin: 0.5rem;
    border-radius: 0.5rem;
}

/*
  item容器样式
*/
.grid-item-child {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    flex-direction: column;
    flex-wrap: wrap;
    float: left;
    width: 25%;
    height: 200rpx;
    box-sizing: border-box;
    /* background-color: #FFFFFF; */
    /* border-right: 1rpx solid #D9D9D9; */
    /* border-bottom: 1rpx solid #D9D9D9; */
}

/*
  icon样式
*/
.grid-item-icon {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    font-size: 90rpx;
}

/*
 文本样式
*/
.grid-item-label {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    color: #666;
    font-size: 30rpx;
}

.swiper-item {
    display: flex;
    justify-content: center;
}
.swiper-text {
    bottom: 10%;
    position: fixed;
    text-align: center;
    color: #000;
    width: auto;
    font-size: 30rpx;
}

/* 卡片 */
.card-content {
    padding: 1rem;
    margin: 1rem;
    border-radius: 0.5rem;
    text-align: center;
    font-size: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}
.card-content-item {
    width: 33.33%;
}

/* card new*/
page {
    background-color: #efefef;
}
.card {
    background-color: #fff;
    /* border: solid 1px; */
    border-radius: 14rpx;
    margin: 30rpx;
}
.card-header {
    color: rgb(8, 161, 231);
    border-bottom: solid 1px #f4f9fa;
    display: flex;
    font-size: 30rpx;
    padding: 15rpx;
}
.card-header > view {
    font-size: 39rpx;
}
.card-body {
    padding: 14rpx;
    color: cornflowerblue;
}

.buttonFix {
    border: 0px !important;
    color: gray !important;
    width: 100% !important;
    font-size: 30rpx;
    font-weight: normal;
    text-align: center !important;
    padding: 0% !important;
}

@media (prefers-color-scheme: dark) {
    /* DarkMode 下的样式 start */
    page {
        background: #1b1b1b;
    }
    .card {
        background-color: #272727;
    }
    .grid-item-label {
        color: #fff;
    }
    /* DarkMode 下的样式 end */
}

@import "./index-wxa-auto-dark.css";
</style>