<template>
<!--components/timePicker/timePicker.wxml-->
<!-- 自定义时间筛选器 -->
<view :hidden="!pickerShow">
  <view :class="'picker-container ' + (pickerShow?'show_picker':'hide_picker')" :animation="animationData">

    <view class="btn-box" catchtouchmove="onCatchTouchMove">
      <view class="pick_btn" @tap="hideModal">取消</view>
      <view class="pick_btn" style="color: #19f" @tap="onConfirm">确定</view>
    </view>

    <view>
      <picker-view class="sensorTypePicker" indicator-style="height: 35px;" @change="changeStartDateTime" :value="startValue" :style="'height: ' + (endDate?'120px':'250px') + ';'" @pickstart="handlePickStart" @pickend="handlePickEnd">
        <picker-view-column style="min-width: 70px;flex-shrink: 0">
          <view v-for="(item, index) in startYearList" :key="index" class="picker-item">{{item}}年</view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item, index) in startMonthList" :key="index" class="picker-item">{{item}}月</view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item, index) in startDayList" :key="index" class="picker-item">{{item}}日</view>
        </picker-view-column>
        <picker-view-column :hidden="!hourColumn">
          <view v-for="(item, index) in startHourList" :key="index" class="picker-item">{{item}}时</view>
        </picker-view-column>
        <picker-view-column :hidden="!minColumn">
          <view v-for="(item, index) in startMinuteList" :key="index" class="picker-item">{{item}}分</view>
        </picker-view-column>
        <picker-view-column :hidden="!secColumn">
          <view v-for="(item, index) in startSecondList" :key="index" class="picker-item">{{item}}秒</view>
        </picker-view-column>
      </picker-view>
    </view>

    <view v-if="endDate">
      <view class="to" style="margin-top: 4px;margin-bottom: 4px;">至</view>
        <picker-view class="sensorTypePicker" indicator-style="height: 35px;" @change="changeEndDateTime" @pickstart="handlePickStart" @pickend="handlePickEnd" :value="endValue">
          <picker-view-column style="min-width: 70px;flex-shrink: 0">
            <view v-for="(item, index) in endYearList" :key="index" class="picker-item" style="min-width: 70px;">{{item}}年</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="(item, index) in endMonthList" :key="index" class="picker-item">{{item}}月</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="(item, index) in endDayList" :key="index" class="picker-item">{{item}}日</view>
          </picker-view-column>
          <picker-view-column :hidden="!hourColumn">
            <view v-for="(item, index) in endHourList" :key="index" class="picker-item">{{item}}时</view>
          </picker-view-column>
          <picker-view-column :hidden="!minColumn">
            <view v-for="(item, index) in endMinuteList" :key="index" class="picker-item">{{item}}分</view>
          </picker-view-column>
          <picker-view-column :hidden="!secColumn">
            <view v-for="(item, index) in startSecondList" :key="index" class="picker-item">{{item}}秒</view>
          </picker-view-column>
      
      
        </picker-view>
    </view>
    

    <!-- <view class='sure' bindtap="onConfirm">确定</view> -->

  </view>
  <!-- 遮罩 -->
  <view class="sensorType-screen" @tap="hideModal" catchtouchmove="onCatchTouchMove" :animation="animationOpacity"></view>
</view>
</template>

<script>
function formatTime(date) {
  if (typeof date == 'string' || 'number') {
    try {
      date = date.replace(/-/g, '/'); //兼容ios
    } catch (error) {}

    date = new Date(date);
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return {
    str: [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':'),
    arr: [year, month, day, hour, minute, second]
  };
}
function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

export default {
  data() {
    return {
      startYearList: [],
      startMonthList: [],
      startDayList: [],
      startHourList: [],
      startMinuteList: [],
      startSecondList: [],
      startValue: "",
      endYearList: [],
      endMonthList: [],
      endDayList: [],
      endHourList: [],
      endMinuteList: [],
      endValue: "",
      endDate: false,
      animationData: "",
      animationOpacity: "",
      yearStart: "",
      yearEnd: "",
      dateLimit: "",
      hourColumn: "",
      minColumn: "",
      secColumn: "",
      limitStartTime: "",
      limitStartTimeArr: "",
      limitEndTime: "",
      limitEndTimeArr: "",
      isPicking: false,
      startTime: "",
      endTime: "",
      YearList: "",
      MonthList: "",
      DayList: "",
      HourList: "",
      MinuteList: "",
      SecondList: "",
      startPickTime: "",
      endSecondList: "",
      endPickTime: ""
    };
  },

  components: {},
  props: {
    pickerShow: {
      type: Boolean
    },
    config: Object
  },
  watch: {
    pickerShow: {
      handler: function (val) {
        //弹出动画
        // console.log(this.data);
        if (val) {
          let animation = uni.createAnimation({
            duration: 500,
            timingFunction: "ease"
          });
          let animationOpacity = uni.createAnimation({
            duration: 500,
            timingFunction: "ease"
          });
          setTimeout(() => {
            animation.bottom(0).step();
            animationOpacity.opacity(0.7).step();
            this.setData({
              animationOpacity: animationOpacity.export(),
              animationData: animation.export()
            });
          }, 0);
        } else {
          let animation = uni.createAnimation({
            duration: 100,
            timingFunction: "ease"
          });
          let animationOpacity = uni.createAnimation({
            duration: 500,
            timingFunction: "ease"
          });
          animation.bottom(-320).step();
          animationOpacity.opacity(0).step();
          this.setData({
            animationOpacity: animationOpacity.export(),
            animationData: animation.export()
          });
        } // 在picker滚动未停止前点确定，会使startValue数组各项归零，发生错误，这里判断并重新初始化
        // 微信新增了picker滚动的回调函数，已进行兼容


        if (this.startValue && this.endValue) {
          let s = 0,
              e = 0;
          let conf = this.config;
          this.startValue.map(val => {
            if (val == 0) {
              s++;
            }
          });
          this.endValue.map(val => {
            if (val == 0) {
              e++;
            }
          });
          let tmp = {
            hour: 4,
            minute: 5,
            second: 6
          };
          let n = tmp[conf.column];

          if (s >= n || e >= n) {
            this.initPick(this.config);
            this.setData({
              startValue: this.startValue,
              endValue: this.endValue
            });
          }
        }
      },
      immediate: true
    }
  },
  destroyed: function () {
    console.log("dele");
  },
  beforeMount: function () {},
  mounted: function () {
    this.readConfig();
    this.initPick(this.config || null);
    this.setData({
      startValue: this.startValue,
      endValue: this.endValue
    });
  },
  methods: {
    //阻止滑动事件
    onCatchTouchMove(e) {},

    //读取配置项
    readConfig() {
      let limitEndTime = new Date().getTime();
      let limitStartTime = new Date().getTime() - 1000 * 60 * 60 * 24 * 30;

      if (this.config) {
        let conf = this.config;

        if (typeof conf.dateLimit == "number") {
          limitStartTime = new Date().getTime() - 1000 * 60 * 60 * 24 * conf.dateLimit;
        }

        if (conf.limitStartTime) {
          limitStartTime = new Date(conf.limitStartTime.replace(/-/g, '/')).getTime();
        }

        if (conf.limitEndTime) {
          limitEndTime = new Date(conf.limitEndTime.replace(/-/g, '/')).getTime();
        }

        this.setData({
          yearStart: conf.yearStart || 2000,
          yearEnd: conf.yearEnd || 2100,
          endDate: conf.endDate || false,
          dateLimit: conf.dateLimit || false,
          hourColumn: conf.column == "hour" || conf.column == "minute" || conf.column == "second",
          minColumn: conf.column == "minute" || conf.column == "second",
          secColumn: conf.column == "second"
        });
      }

      let limitStartTimeArr = formatTime(limitStartTime);
      let limitEndTimeArr = formatTime(limitEndTime);
      this.setData({
        limitStartTime,
        limitStartTimeArr,
        limitEndTime,
        limitEndTimeArr
      });
    },

    //滚动开始
    handlePickStart: function (e) {
      this.setData({
        isPicking: true
      });
    },
    //滚动结束
    handlePickEnd: function (e) {
      this.setData({
        isPicking: false
      });
    },
    onConfirm: function () {
      //滚动未结束时不能确认
      if (this.isPicking) {
        return;
      }

      let startTime = new Date(this.startPickTime.replace(/-/g, "/"));
      let endTime = new Date(this.endPickTime.replace(/-/g, "/"));

      if (startTime <= endTime || !this.endDate) {
        this.setData({
          startTime,
          endTime
        });
        let startArr = formatTime(startTime).arr;
        let endArr = formatTime(endTime).arr;

        let format0 = function (num) {
          return num < 10 ? '0' + num : num;
        };

        let startTimeBack = startArr[0] + "-" + format0(startArr[1]) + "-" + format0(startArr[2]) + " " + (this.hourColumn ? format0(startArr[3]) : "00") + ":" + (this.minColumn ? format0(startArr[4]) : "00") + ":" + (this.secColumn ? format0(startArr[5]) : "00");
        let endTimeBack = endArr[0] + "-" + format0(endArr[1]) + "-" + format0(endArr[2]) + " " + (this.hourColumn ? format0(endArr[3]) : "00") + ":" + (this.minColumn ? format0(endArr[4]) : "00") + ":" + (this.secColumn ? format0(endArr[5]) : "00");
        let time = {
          startTime: startTimeBack,
          endTime: endTimeBack
        }; //触发自定义事件

        this.$emit("setPickerTime", {
          detail: time
        });
        this.$emit("hidePicker", {
          detail: {}
        });
      } else {
        uni.showToast({
          icon: "none",
          title: "时间不合理"
        });
      }
    },
    hideModal: function () {
      this.$emit("hidePicker", {
        detail: {}
      });
    },
    changeStartDateTime: function (e) {
      let val = e.detail.value;
      this.compareTime(val, "start");
    },
    changeEndDateTime: function (e) {
      let val = e.detail.value;
      this.compareTime(val, "end");
    },

    //比较时间是否在范围内
    compareTime(val, type) {
      let h = val[3] ? this.HourList[val[3]] : "00";
      let m = val[4] ? this.MinuteList[val[4]] : "00";
      let s = val[5] ? this.SecondList[val[5]] : "00";
      let time = this.YearList[val[0]] + "-" + this.MonthList[val[1]] + "-" + this.DayList[val[2]] + " " + h + ":" + m + ":" + s;
      let start = this.limitStartTime;
      let end = this.limitEndTime;
      let timeNum = new Date(time.replace(/-/g, '/')).getTime();
      let year, month, day, hour, min, sec, limitDate;
      let tempArr = [];

      if (!this.dateLimit) {
        limitDate = [this.YearList[val[0]], this.MonthList[val[1]], this.DayList[val[2]], this.HourList[val[3]], this.MinuteList[val[4]], this.SecondList[val[5]]];
      } else if (type == "start" && timeNum > new Date(this.endPickTime.replace(/-/g, '/')) && this.config.endDate) {
        limitDate = formatTime(this.endPickTime).arr;
      } else if (type == "end" && timeNum < new Date(this.startPickTime.replace(/-/g, '/'))) {
        limitDate = formatTime(this.startPickTime).arr;
      } else if (timeNum < start) {
        limitDate = this.limitStartTimeArr.arr;
      } else if (timeNum > end) {
        limitDate = this.limitEndTimeArr.arr;
      } else {
        limitDate = [this.YearList[val[0]], this.MonthList[val[1]], this.DayList[val[2]], this.HourList[val[3]], this.MinuteList[val[4]], this.SecondList[val[5]]];
      }

      year = limitDate[0];
      month = limitDate[1];
      day = limitDate[2];
      hour = limitDate[3];
      min = limitDate[4];
      sec = limitDate[5];

      if (type == "start") {
        this.setStartDate(year, month, day, hour, min, sec);
      } else if (type == "end") {
        this.setEndDate(year, month, day, hour, min, sec);
      }
    },

    getDays: function (year, month) {
      let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      if (month === 2) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0 ? 29 : 28;
      } else {
        return daysInMonth[month - 1];
      }
    },
    initPick: function (initData) {
      const date = initData.initStartTime ? new Date(initData.initStartTime.replace(/-/g, '/')) : new Date();
      const endDate = initData.initEndTime ? new Date(initData.initEndTime.replace(/-/g, '/')) : new Date(); // const startDate = new Date(date.getTime() - 1000 * 60 * 60 * 24);

      const startDate = date;
      const startYear = date.getFullYear();
      const startMonth = date.getMonth() + 1;
      const startDay = date.getDate();
      const startHour = date.getHours();
      const startMinute = date.getMinutes();
      const startSecond = date.getSeconds();
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth() + 1;
      const endDay = endDate.getDate();
      const endHour = endDate.getHours();
      const endMinute = endDate.getMinutes();
      const endSecond = endDate.getSeconds();
      let YearList = [];
      let MonthList = [];
      let DayList = [];
      let HourList = [];
      let MinuteList = [];
      let SecondList = []; //设置年份列表

      for (let i = this.yearStart; i <= this.yearEnd; i++) {
        YearList.push(i);
      } // 设置月份列表


      for (let i = 1; i <= 12; i++) {
        MonthList.push(i);
      } // 设置日期列表


      for (let i = 1; i <= 31; i++) {
        DayList.push(i);
      } // 设置时列表


      for (let i = 0; i <= 23; i++) {
        if (0 <= i && i < 10) {
          i = "0" + i;
        }

        HourList.push(i);
      } // 分|秒


      for (let i = 0; i <= 59; i++) {
        if (0 <= i && i < 10) {
          i = "0" + i;
        }

        MinuteList.push(i);
        SecondList.push(i);
      }

      this.setData({
        YearList,
        MonthList,
        DayList,
        HourList,
        MinuteList,
        SecondList
      });
      this.setStartDate(startYear, startMonth, startDay, startHour, startMinute, startSecond);
      this.setEndDate(endYear, endMonth, endDay, endHour, endMinute, endSecond); //!!!
      // setTimeout(() => {
      //   this.setStartDate(nowYear, nowMonth, nowDay, nowHour, nowMinute)
      //   this.setEndDate(nowYear, nowMonth, nowDay, nowHour, nowMinute)
      // }, 0);
    },

    setPickerDateArr(type, year, month, day, hour, minute, second) {
      let yearIdx = 0;
      let monthIdx = 0;
      let dayIdx = 0;
      let hourIdx = 0;
      let minuteIdx = 0;
      let secondIdx = 0;
      this.YearList.map((v, idx) => {
        if (parseInt(v) === year) {
          yearIdx = idx;
        }
      });
      this.MonthList.map((v, idx) => {
        if (parseInt(v) === month) {
          monthIdx = idx;
        }
      }); // 重新设置日期列表

      let DayList = [];

      for (let i = 1; i <= this.getDays(year, month); i++) {
        DayList.push(i);
      }

      DayList.map((v, idx) => {
        if (parseInt(v) === day) {
          dayIdx = idx;
        }
      });

      if (type == "start") {
        this.setData({
          startDayList: DayList
        });
      } else if (type == "end") {
        this.setData({
          endDayList: DayList
        });
      }

      this.HourList.map((v, idx) => {
        if (parseInt(v) === parseInt(hour)) {
          hourIdx = idx;
        }
      });
      this.MinuteList.map((v, idx) => {
        if (parseInt(v) === parseInt(minute)) {
          minuteIdx = idx;
        }
      });
      this.SecondList.map((v, idx) => {
        if (parseInt(v) === parseInt(second)) {
          secondIdx = idx;
        }
      });
      return {
        yearIdx,
        monthIdx,
        dayIdx,
        hourIdx,
        minuteIdx,
        secondIdx
      };
    },

    setStartDate: function (year, month, day, hour, minute, second) {
      let pickerDateArr = this.setPickerDateArr("start", year, month, day, hour, minute, second);
      this.setData({
        startYearList: this.YearList,
        startMonthList: this.MonthList,
        // startDayList: this.data.DayList,
        startHourList: this.HourList,
        startMinuteList: this.MinuteList,
        startSecondList: this.SecondList,
        startValue: [pickerDateArr.yearIdx, pickerDateArr.monthIdx, pickerDateArr.dayIdx, pickerDateArr.hourIdx, pickerDateArr.minuteIdx, pickerDateArr.secondIdx],
        startPickTime: this.YearList[pickerDateArr.yearIdx] + "-" + this.MonthList[pickerDateArr.monthIdx] + "-" + this.DayList[pickerDateArr.dayIdx] + " " + this.HourList[pickerDateArr.hourIdx] + ":" + this.MinuteList[pickerDateArr.minuteIdx] + ":" + this.SecondList[pickerDateArr.secondIdx]
      });
    },
    setEndDate: function (year, month, day, hour, minute, second) {
      let pickerDateArr = this.setPickerDateArr("end", year, month, day, hour, minute, second);
      this.setData({
        endYearList: this.YearList,
        endMonthList: this.MonthList,
        // endDayList: this.data.DayList,
        endHourList: this.HourList,
        endMinuteList: this.MinuteList,
        endSecondList: this.SecondList,
        endValue: [pickerDateArr.yearIdx, pickerDateArr.monthIdx, pickerDateArr.dayIdx, pickerDateArr.hourIdx, pickerDateArr.minuteIdx, pickerDateArr.secondIdx],
        endPickTime: this.YearList[pickerDateArr.yearIdx] + "-" + this.MonthList[pickerDateArr.monthIdx] + "-" + this.DayList[pickerDateArr.dayIdx] + " " + this.HourList[pickerDateArr.hourIdx] + ":" + this.MinuteList[pickerDateArr.minuteIdx] + ":" + this.SecondList[pickerDateArr.secondIdx]
      });
    }
  }
};
</script>
<style>
/* components/timePicker/timePicker.wxss */

.picker-item{
  line-height: 100rpx;  
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 自定义时间 */
.picker-container {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;

  width: 100%;
  overflow: hidden;
  position: fixed;
  bottom: -640rpx;
  left: 0;
  /* height: 0; */
  transition: height 0.5s;
  z-index: 2000;
  background: white;
  border-top: 1px solid #EFEFF4;
}
.sensorType-screen{
  width: 100vw;
  /* height:400rpx; */
  position: fixed;
  top: 0;/*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top));/*  #endif  */
  right: 0;
  bottom: 0;
  left: 0;
  background: #000;
  opacity: 0;
  overflow: hidden;
  z-index: 1999;
  color: #fff;
}
.sensorTypePicker{
  width: 690rpx;
  height: 240rpx;
  /* padding: 45px 0; */
}
.picker-item{
  line-height: 100rpx;  
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  /* overflow: hidden; */
}
.box{
   padding: 0 20rpx; 
}

/* 至 */
.to{
  width:100%;
  display: flex;
  justify-content: center;align-items: center;
  color:rgb(138,138,138);
  /* font-size:30rpx; */
}

/* 确定 */
.sure{
  width:100%;
  height:90rpx;
  border-top: 2rpx solid #EFEFF4;
  display: flex;justify-content: center;align-items: center;
  color: rgb(36,123,255);
  font-size:16px;
}

.btn-box{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2rpx solid #eee;
}
.pick_btn{
  padding: 14rpx 30rpx;
  color: #ccc;
  /* background-color: #159; */
}

.show_picker{
  /* height: 320px; */
}
.hide_picker{
  /* height: 0; */
}
@import "./timePicker-wxa-auto-dark.css";

</style>