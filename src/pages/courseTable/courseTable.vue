<template>
  <view>
    <!--table.wxml-->
    <!-- 课表类型 -->
    <picker
      @change="bindCourseTypePicker"
      :value="courseTypeIndex"
      :range="courseTypeArray"
      range-key="name"
    >
      <view class="floatBtn typePicker">类型</view>
    </picker>
    <!-- 周数选择器 -->
    <picker @change="bindWeekChange" :value="week_num" :range="courseWeekArray" range-key="name">
      <view class="floatBtn weekPicker">周数</view>
    </picker>
    <!-- 学期选择器 -->
    <picker
      mode="multiSelector"
      @change="bindTermChange"
      @columnchange="bindTermColumnChange"
      :value="termIndex"
      :range="termArray"
      range-key="name"
    >
      <view class="floatBtn termPicker">学期</view>
    </picker>

    <view
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @longpress="bindLongTab"
      :style="'background: url(' + background + ')no-repeat;background-size: 100% 100%;'"
    >
      <view :style="'background-color: rgba(255, 255, 255, ' + backOpacity + ');'">
        <view
          class="top-style"
          :style="'background-color: rgba(238,238,238, ' + gridOpacity + ');'"
        >
          <view
            v-for="(item, index) in ['一','二','三','四','五','六','日']"
            :key="index"
            class="top-text"
            :style="'color: ' + ((increment==0&&index==day_num)?'#009688':'black') + ';'"
          >周{{item}}</view>
        </view>
        <view>
          <view class="full-table" :style="'height: ' + (windowHeight - 20) + 'px;'">
            <view
              class="left-num-bar"
              :style="'background-color: rgba(238,238,238, ' + gridOpacity + ');'"
            >
              <view
                v-for="(item, index) in [1,2,3,4,5,6,7,8,9,10,11]"
                :key="index"
                class="left-num"
                :style="'height: ' + gridHeight + 'px;'"
              >{{item}}</view>
            </view>
            <view v-for="(item, index) in [1,2,3,4,5,6,7,8,9,10,11]" :key="index">
              <view
                :style="'width:715rpx;margin-top:' + ((index+1)*gridHeight-1) + 'px;  position: absolute;border-bottom:1rpx solid ' + (index==3||index==7?'rgba(153,153,153,' + (backOpacity+0.2) + ')':'rgba(211,211,211,' + (backOpacity+0.2) + ')') + ';'"
              ></view>
            </view>
            <!-- <view wx:for="{{[1,2,3,4,5,6,7,8,9,10,11]}}" wx:key="*this" wx:for-item="i">
          <view wx:for="{{[1,2,3,4,5,6,7]}}" wx:key="*this" wx:for-item="j" class="flex-item kcb-item" style='margin-left:{{(j-1)*100}}rpx;margin-top:{{(i-1)*gridHeight+1}}px;height:{{1*gridHeight-2}}px;background-color:rgba(238,238,238,{{backOpacity}});border-radius:10rpx;'>
            <view style="display:flex;flex-direction:column;padding:10rpx 3rpx 0rpx 3rpx;">{{i}}_{{j}}</view>
          </view>
            </view>-->
            <view v-for="(item, index) in week_list" :key="index">
              <scroll-view
                scroll-y="true"
                class="flex-item kcb-item"
                enable-flex="true"
                :style="'margin-left:' + ((item.day_of_week-1)*100) + 'rpx;margin-top:' + ((item.class_of_day-1)*gridHeight+1) + 'px;height:' + (item.duration*gridHeight-2) + 'px;background-color:rgba(' + colorArrays[index%8] + ',' + gridOpacity + ');border-radius:10rpx;'"
              >
                <view style="display:flex;flex-direction:column;padding:10rpx 3rpx 0rpx 3rpx;">
                  <view class="smalltext">{{item.name}}</view>
                  <view class="smalltext">{{item.place}}</view>
                  <view class="smalltext">{{item.teacherName}}</view>
                </view>
              </scroll-view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 设置 -->
    <view class="container" :hidden="settingHidden">
      <view class="float">
        <view class="floatContent">
          <view class="floatText">
            <button @tap="settingSelectImg">选择背景图片</button>
            <view>格子不透明度：</view>
            <slider
              min="0"
              max="100"
              step="1"
              :value="gridOpacity * 100"
              block-size="10"
              block-color="#12aef3"
              show-value="true"
              data-type="grid"
              @change="bindOpacityChange"
            ></slider>
            <view>背景不透明度：</view>
            <slider
              min="0"
              max="100"
              step="1"
              :value="backOpacity * 100"
              block-size="10"
              block-color="#12aef3"
              show-value="true"
              data-type="back"
              @change="bindOpacityChange"
            ></slider>
            <button type="primary" @tap="settingFrameSwitch">关闭</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
import { getCourseOption, getCourseTable } from "./api";
import log from '../../utils/log.js'

export default {
  data() {
    return {
      colorArrays: [
        "133,184,207",
        "144,198,82",
        "216,170,90",
        "252,159,157",
        "10,154,132",
        "97,188,105",
        "18,174,243",
        "226,154,173"
      ],
      lastX: 0,
      currentGesture: "",
      courseWeekArray: [
        {
          key: "",
          name: "全部"
        }
      ],
      termArray: [
        [
          {
            name: "202?-202?"
          }
        ],
        [
          {
            id: 0,
            name: "第?学期"
          }
        ]
      ],
      termIndex: [0, 0],
      termData: {},
      courseTypeArray: [
        {
          key: "std",
          name: "学生课表"
        },
        {
          key: "class",
          name: "班级课表"
        }
      ],
      courseTypeIndex: 0,
      increment: 0,
      gridOpacity: 1,
      backOpacity: 0.5,
      settingHidden: true,
      background:
        "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==",
      windowHeight: 500,
      gridHeight: 50,
      sessionInfo: {},
      isFirstOpenSSO: true,
      week_num: "",
      week_list: [],
      day_num: (new Date().getDay() + 6) % 7
    };
  },

  components: {},
  props: {},
  onLoad: function(options) {
    this.sessionInfo = app.globalData.sessionInfo;
    this.termData = uni.getStorageSync("termData");
    this.setData({
      courseWeekArray: uni.getStorageSync("courseWeekArray")
    });
    uni.getStorage({
      key: "courseTableImg",
      success: res => {
        this.setData({
          background: res.data
        });
      }
    });
    uni.getStorage({
      key: "backOpacity",
      success: res => {
        this.setData({
          backOpacity: res.data
        });
      }
    });
    uni.getStorage({
      key: "gridOpacity",
      success: res => {
        this.setData({
          gridOpacity: res.data
        });
      }
    });
    app.globalData.start = uni.getStorageSync("start");
    app.globalData.classtable = uni.getStorageSync("classtable");
    uni.getSystemInfo({
      success: res => {
        this.setData({
          windowHeight: res.windowHeight,
          gridHeight: parseInt((res.windowHeight - 17) / 11 - 1)
        });
      },

      fail(err) {
        console.log(err);
      }
    });
    uni.showShareMenu({
      withShareTicket: true,
      // for wx
      menus: ["shareAppMessage", "shareTimeline"],
      // for qq
      showShareItems: ["qq", "qzone", "wechatFriends", "wechatMoment"]
    });
  },
  onShow: function() {
    this.getOptions();

    if ("undefined" != typeof app.globalData.tempBackImg) {
      const backImg = app.globalData.tempBackImg;
      delete app.globalData.tempBackImg;
      this.uploadBackImg(backImg);
      return;
    }

    if (!this.haveData()) {
      uni.showModal({
        title: "提示",
        content: "课表为空，是否更新？",
        success: res => {
          if (res.confirm) {
            this.getCourseFromServer();
          } else if (res.cancel) {
            uni.showToast({
              title: "可以长按该页面,从服务器拉取数据",
              icon: "none",
              duration: 3000
            });
          }
        }
      });
      return;
    }

    this.incrementZero();
  },

  /**
   * 下拉事件
   */
  onPullDownRefresh: function() {
    setTimeout(this.incrementZero, 500);
    setTimeout(uni.stopPullDownRefresh, 500);
  },

  /**
   * 分享至微信朋友圈
   */
  onShareTimeline: function() {
    return {
      title: "成信大课表",
      query: ""
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    return {
      title: "成信大课表",
      // for wechat
      path: "/pages/courseTable/courseTable",
      // for qq
      query: ""
    };
  },
  methods: {
    isNotExisted: function(item) {
      if (item == "" || item == null) {
        return true;
      }

      return false;
    },

    /**
     * 检查是否存在课表数据
     */
    haveData: function() {
      if (
        this.isNotExisted(app.globalData.classtable) ||
        this.isNotExisted(app.globalData.start)
      ) {
        return false;
      }

      return true;
    },
    getWeekList: function(week_num) {
      var week_list = [];
      if (0 == week_num) week_list = app.globalData.classtable;
      else
        for (var i = 0; i < app.globalData.classtable.length; i++) {
          if (app.globalData.classtable[i].week_num.indexOf(week_num) != -1) {
            week_list.push({
              day_of_week: app.globalData.classtable[i].day_of_week,
              class_of_day: app.globalData.classtable[i].class_of_day,
              duration: app.globalData.classtable[i].duration,
              name: app.globalData.classtable[i].name,
              place: app.globalData.classtable[i].place,
              teacherName: app.globalData.classtable[i].teacherName
            });
          }
        }
      return week_list;
    },
    updateScreen: function() {
      if (!this.haveData()) {
        return;
      }

      var now = new Date();
      var diff_day_without_increment = parseInt(
        (now - app.globalData.start) / (1000 * 60 * 60 * 24)
      )+5;
			// console.log("已开学：" + diff_day_without_increment + "---今天周" + (diff_day_without_increment % 7))
      var diff_day = diff_day_without_increment + this.increment;

      if (diff_day < -7) {
        diff_day = -7;
        this.increment += 7;
      }

      var week_num = parseInt(diff_day / 7);
      var week_list = this.getWeekList(week_num);
      this.setData({
        week_num: week_num,
        week_list: week_list
      });
      if (0 == week_num)
        uni.setNavigationBarTitle({
          title: "全部（不准）"
        });
      else
        uni.setNavigationBarTitle({
          title: "第" + this.week_num + "周"
        });
    },
    incrementAdd: function() {
      this.increment = this.increment + 7;
      this.updateScreen();
    },
    incrementSub: function() {
      this.increment = this.increment - 7;
      this.updateScreen();
    },

    /**
     * 重置相对于当天的天数增量
     */
    incrementZero: function() {
      this.setData({
        increment: 0
      });
      this.updateScreen();
    },
    handleTouchMove: function(event) {
      var currentX = event.touches[0].pageX;
      var currentY = event.touches[0].pageY;
      var tx = currentX - this.lastX;
      var ty = currentY - this.lastY;

      if (tx < -100) {
        this.currentGesture = "left";
      } else if (tx > 100) {
        this.currentGesture = "right";
      } else if (ty < -100) {
        this.currentGesture = "top";
      }
    },
    handleTouchStart: function(event) {
      this.lastX = event.touches[0].pageX;
      this.lastY = event.touches[0].pageY;
    },

    /**
     * 滑动处理事件
     * @param {*} event
     */
    handleTouchEnd: function(event) {
      if (this.currentGesture == "left") {
        this.incrementAdd();
      }

      if (this.currentGesture == "right") {
        this.incrementSub();
      }

      if (this.currentGesture == "top") {
        this.settingFrameSwitch();
      }

      this.currentGesture = 0;
    },
    settingFrameSwitch: function() {
      this.setData({
        settingHidden: !this.settingHidden
      });
    },
    // 不透明度变更
    bindOpacityChange: function(e) {
      const type = e.currentTarget.dataset.type;
      var t = {};
      t[type + "Opacity"] = e.detail.value / 100;
      this.setData(t);
      uni.setStorage({
        data: e.detail.value / 100,
        key: type + "Opacity"
      });
    },
    // 上传图片
    uploadBackImg: function(img) {
      uni.saveFile({
        tempFilePath: img,
        success: res => {
          const savedFilePath = res.savedFilePath;
          this.setData({
            background: savedFilePath
          });
          uni.setStorage({
            data: savedFilePath,
            key: "courseTableImg"
          });
        },
        fail: err => {
          if (err.errMsg)
            uni.showToast({
              icon: "none",
              title: err.errMsg
            });
        }
      });
      return;
    },
    // 背景图
    settingSelectImg: function() {
      uni.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: res => {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          uni.navigateTo({
            url:
              "/pages/courseTable/imgCropper/imgCropper?src=" +
              tempFilePaths[0] +
              "&width=" +
              app.globalData.windowWidth +
              "&height=" +
              app.globalData.windowHeight
          });
        }
      });
    },

    /**
     * 从服务器拉取课表数据
     */
    getCourseFromServer: function() {
      const cookie = `semester.id=${this.termArray[1][this.termIndex[1]].id};${
        this.sessionInfo.JWGL_cookie
      }; TWFID=${this.sessionInfo.TWFID}`;
      const courseType = this.courseTypeArray[this.courseTypeIndex].key;
      const semester = this.termArray[1][this.termIndex[1]].id;
      getCourseTable(cookie, courseType, semester)
        .then(res => {
          const resp = res.data;

          try {
            var obj = resp.data;

            if (obj.start.year == null) {
              throw "Error";
            }

            uni.startPullDownRefresh();
            app.globalData.start = new Date(
              obj.start.year,
              obj.start.month - 1,
              obj.start.day
            );
            app.globalData.classtable = obj.classtable;
            app.globalData.location = obj.location;
            uni.setStorage({
              key: "start",
              data: app.globalData.start
            });
            uni.setStorage({
              key: "classtable",
              data: app.globalData.classtable
            });
            uni.setStorage({
              key: "location",
              data: app.globalData.location
            });
            setTimeout(this.incrementZero, 500);
            setTimeout(uni.stopPullDownRefresh, 500);
          } catch (e) {
            uni.showToast({
              title: "信息有误",
              icon: "none",
              duration: 5000
            });
          }
        })
        .catch(err => {
          this.handelERR(err);
        });
    },

    /**
     * 获取周数，学期信息
     */
    getOptions: function() {
      let semesterId =
        this.termArray[1][this.termIndex[1]].id !== 0
          ? "semester.id=" + this.termArray[1][this.termIndex[1]].id + ";"
          : "";
      getCourseOption(
        `${semesterId}${this.sessionInfo.JWGL_cookie};TWFID=${this.sessionInfo.TWFID}`
      )
        .then(res => {
          let tempData = {};
          const resp = res.data;
          const { data } = resp;
          let sem = data.semesters;
          tempData["courseTypeArray"] = data.courseType;
          tempData["courseWeekArray"] = data.courseWeek;
          uni.setStorage({
            data: data.courseWeek,
            key: "courseWeekArray"
          });
          tempData["termArray"] = [sem.list[0]];
          tempData["termArray"][1] =
            sem.list[1][sem.index[0] === -1 ? 0 : sem.index[0]];
          if (sem.index[0] !== -1 && sem.index[1] !== -1)
            tempData["termIndex"] = sem.index;
          this.termData = sem.list[1];
          this.setData(tempData);
        })
        .catch(err => {
					log.info(err)
          return;
        });
    },

    /**
     * 长按事件
     */
    bindLongTab: function() {
      var _this = this;

      uni.showModal({
        title: "提示",
        content: "是否从服务器更新课表",
        success: function(res) {
          if (res.confirm) {
            _this.getCourseFromServer();
          }
        }
      });
    },

    /**
     * 课表类型变化事件
     * @param {*} e
     */
    bindCourseTypePicker: function(e) {
      this.setData({
        courseTypeIndex: e.detail.value
      });
      this.bindLongTab();
    },

    /**
     * 周数选项确定事件
     * @param {*} e
     */
    bindWeekChange: function(e) {
      // value值固定为字符串，需要强转一下
      var week_num = parseInt(e.detail.value);
      var week_list = this.getWeekList(week_num);
      var diff_day_without_increment = parseInt(
        (new Date() - app.globalData.start) / (1000 * 60 * 60 * 24)
      );
      var this_week_num = parseInt(diff_day_without_increment / 7 + 1);
      var increment = (week_num - this_week_num) * 7;
      this.setData({
        week_num: week_num,
        week_list: week_list,
        increment: increment
      });
      if (0 == week_num)
        uni.setNavigationBarTitle({
          title: "全部"
        });
      else
        uni.setNavigationBarTitle({
          title: "第" + this.week_num + "周"
        });
    },

    /**
     * 学期选项确定事件
     */
    bindTermChange: function(e) {
      this.setData({
        termIndex: e.detail.value
      });
      this.bindLongTab();
    },

    /**
     * 学期选项列变化事件
     * @param {*} e
     */
    bindTermColumnChange: function(e) {
      console.log(this.termData);
      var data = {
        termArray: this.termArray,
        termIndex: this.termIndex
      };
      data.termIndex[e.detail.column] = e.detail.value;

      switch (e.detail.column) {
        case 0:
          // 第二列、第三列默认索引值0
          data.termArray[1] = this.termData[e.detail.value];
          data.termIndex[1] = 0;
          break;
      }

      this.setData({
        termArray: data.termArray,
        termIndex: data.termIndex
      });
    }
  }
};
</script>
<style>
/* pages/table/table.wxss */

.flex-item {
  width: 99rpx;
}

.kcb-item {
  position: absolute;
  justify-content: center;
  display: flex;
  align-items: center;
}

.smalltext {
  font-size: 8pt;
  color: #fff;
}

.top-style {
  display: flex;
  flex-direction: row;
  margin-left: 35rpx;
  margin-top: 15rpx;
  border-radius: 10rpx;
}

.top-text {
  width: 100rpx;
  height: 35rpx;
  font-size: 9pt;
  justify-content: center;
  display: flex;
  align-items: center;
}

.full-table {
  width: 730rpx;
  display: flex;
}

.left-num-bar {
  color: #000;
  border-radius: 10rpx;
}

.left-num {
  display: flex;
  width: 35rpx;
  font-size: 9pt;
  justify-content: center;
  align-items: center;
}

.left {
  width: 35rpx;
  height: 100rpx;
  font-size: 9pt;
  justify-content: center;
  display: flex;
  align-items: center;
}

.weekPicker {
  bottom: 15%;
}
.termPicker {
  bottom: 5%;
}
.typePicker {
  bottom: 25%;
}

/* 设置框 */
.float {
  height: 100%;
  width: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  top: 0; /*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top)); /*  #endif  */
  left: 0;
  z-index: 999;
}

.floatContent {
  padding: 20rpx 0;
  width: 80%;
  background: #fff;
  margin: 40% auto;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: relative;
  height: 500rpx;
}

.floatText text {
  color: #000;
  font-size: 40rpx;
  display: block;
  text-align: center;
  line-height: 90rpx;
  border-radius: 30rpx;
  margin-right: 10rpx;
}
/* 设置框End */
</style>