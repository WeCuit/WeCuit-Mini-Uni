<template>
<!--components/dynamicForm/index.wxml-->
<view class="page">
  <view class="form-box">
    <block v-for="(item, index) in formData" :key="index">
      <!-- input输入框 -->
      <view class="form-row ipt-row " v-if="item.type==='input'">
        <view :class="'form-lable ' + (item.isRequired?'required':'' +'')">{{item.lable}}</view>
        <view style="width:100%">
          <input v-if="!item.disabled" :class="'field ' + (item.disabled?'disabled':'')" :type="inputMap[item.id].original.inputType || 'text'" :maxlength="item.maxLength || -1" @input="onInput" :id="item.id" :value="item.defaultValue || ''" :disabled="item.disabled" :placeholder="inputMap[item.id].placeholder || '请填写内容'">
          <view class="field disabled" v-else>{{item.defaultValue || ''}}</view>
          <view class="error-info" v-if="inputMap[item.id].error">{{inputMap[item.id].error}}</view>
        </view>
      </view>
      <!-- picker选择器 -->
      <view class="form-row flex-start" v-else-if="item.type==='picker'">
        <view :class="'form-lable ' + (item.isRequired?'required':'')">{{item.lable}}</view>
        <view style="width:100%">
          <view v-if="!item.disabled" :class="'picker-row ' + (item.disabled?'disabled':'')">
            <picker class="field" :range="item.range" :disabled="item.disabled" :id="item.id" :value="pickerMap[item.id].idx" range-key="name" @change="onPickerChange">
              {{pickerMap[item.id].hasChoose?item.range[pickerMap[item.id].idx].name:'请选择'}}
            </picker>
            <van-icon class="row-icon" name="arrow"></van-icon>
          </view>
          <view class="field disabled" v-else>{{pickerMap[item.id].hasChoose?item.range[pickerMap[item.id].idx].name:''}}</view>
          <view class="error-info" v-if="pickerMap[item.id].error">{{pickerMap[item.id].error}}</view>
        </view>
      </view>
      <!-- 日期选择器 -->
      <view class="form-row flex-start " v-else-if="item.type==='date'">
        <view :class="'form-lable ' + (item.isRequired?'required':'')">{{item.lable}}</view>
        <view style="width:100%">
          <view class="picker-row">
            <view :class="'field ' + (item.disabled?'disabled':'')" @tap="datePickerShow" :data-disabled="item.disabled" :data-id="item.id">{{dateMap[item.id].hasChoose?(dateMap[item.id].config.endDate?dateMap[item.id].startDate+' ~ ' + dateMap[item.id].endDate: dateMap[item.id].startDate):'请选择'}}</view>
            <time-picker :pickerShow="dateMap[item.id].show" :id="item.id" v-if="!isPickerRender" @hidePicker="datePickerHide" @setPickerTime="setPickerTime" :config="dateMap[item.id].original.config"></time-picker>
            <van-icon class="row-icon" name="arrow"></van-icon>
          </view>
          <view class="error-info" v-if="dateMap[item.id].error">{{dateMap[item.id].error}}</view>
        </view>
      </view>
      <!-- 文本框 -->
      <view class="textarea-box" v-else-if="item.type==='textarea'">
        <view class="flex mb-24">
          <view :class="'area-lable ' + (item.isRequired?'required':'')">{{item.lable}}</view>
          <view class="error-info" v-if="inputMap[item.id].error">{{inputMap[item.id].error}}</view>
        </view>
        <view :class="'text-area ' + (item.disabled?'disabled':'')">
          <textarea style="width:100%" :value="item.defaultValue || ''" :disabled="item.disabled" :placeholder="inputMap[item.id].placeholder || '请填写内容'" :id="item.id" @input="onInput" :auto-height="true" :maxlength="item.maxLength || -1" name cols="30" rows="10"></textarea>
          <view v-if="item.maxLength" class="text-num">{{inputMap[item.id].value.length||0}}/{{item.maxLength}}
          </view>
        </view>
      </view>
      <!-- 文件上传 -->
      <view class="img-box" v-else-if="item.type==='file'">
        <!-- <view class="area-lable mb-24 {{item.isRequired?'required':''}}">{{item.lable}}</view> -->
        <view class="flex mb-24">
          <view :class="'area-lable ' + (item.isRequired?'required':'')">{{item.lable}}</view>
          <view class="error-info" v-if="fileMap[item.id].error">{{fileMap[item.id].error}}</view>
        </view>
        <van-uploader :file-list="fileMap[item.id].list" preview-size="196rpx" :max-count="fileMap[item.id].original.maxCount || 9" :disabled="fileMap[item.id].original.disabled || false" :accept="fileMap[item.id].original.accept || 'image'" :id="item.id" multiple image-fit="aspectFill" @after-read="onFileRead" @delete="onFileDelete"></van-uploader>
      </view>
    </block>
  </view>
  <button v-if="showSubmitBtn" class="form-btn" @tap="formSubmit">提交</button>
</view>
</template>

<script>
// components/dynamicForm/index.js
import formatTime from './utils/formatTime';
import vanIcon from "./vant/icon/index";
import vanUploader from "./vant/uploader/index";
import timePicker from "./components/timePicker/timePicker";

export default {
  data() {
    return {
      pickerMap: {},
      fileMap: {},
      inputMap: {},
      pickers: "",
      inputs: "",
      datePickers: "",
      files: "",
      dateMap: ""
    };
  },

  components: {
    vanIcon,
    vanUploader,
    timePicker
  },
  props: {
    formData: Array,
    showSubmitBtn: {
      type: Boolean,
      default: true
    },
    toSubmit: Number
  },
  watch: {
    "toSubmit": {
      handler: function (e) {
        if (e) {
          this.formSubmit();
        }
      },
      immediate: true,
      deep: true
    },
    "formData": {
      handler: function () {
        this.formInit();
      },
      immediate: true,
      deep: true
    }
  },
  beforeMount: function () {
    this.formInit();
  },
  moved: function () {},
  destroyed: function () {},
  // 组件所在页面的生命周期函数
  onPageShow: function () {},
  onPageHide: function () {},
  onPageResize: function () {},
  methods: {
    //表单初始化
    formInit() {
      const pickerMap = {},
            fileMap = {},
            inputMap = {},
            dateMap = {}; //存储各表单变化后的值,表单id为索引

      const pickers = [],
            files = [],
            inputs = [],
            datePickers = [];
      this.formData.forEach(val => {
        switch (val.type) {
          case 'picker':
            pickers.push(val);
            break;

          case 'file':
            files.push(val);
            break;

          case 'input':
          case 'textarea':
            inputs.push(val);
            break;

          case 'date':
            datePickers.push(val);
            break;

          default:
            break;
        }
      });
      pickers.forEach(val => {
        pickerMap[val.id] = {
          original: val,
          hasChoose: val.defaultIdx != 'undefined',
          error: null,
          idx: val.defaultIdx || 0
        };
      });
      files.forEach(val => {
        fileMap[val.id] = {
          original: val,
          error: null,
          list: val.fileList
        };
      });
      inputs.forEach(val => {
        inputMap[val.id] = {
          original: val,
          value: val.defaultValue || '',
          placeholder: val.placeholder,
          error: null,
          rules: val.rules ? val.rules.map(val => {
            val.regular = new RegExp(val.regular);
            return val;
          }) : []
        };
      });
      datePickers.forEach(val => {
        dateMap[val.id] = {
          original: val,
          config: val.config,
          completeTime: val.completeTime,
          show: false,
          hasChoose: !!val.config.initStartTime,
          error: null,
          startDate: val.config.initStartTime || formatTime(),
          endDate: val.config.initEndTime || formatTime()
        };

        if (!val.completeTime) {
          dateMap[val.id].startDate = dateMap[val.id].startDate.split(' ')[0];
          dateMap[val.id].endDate = dateMap[val.id].endDate.split(' ')[0];
        }
      });
      this.setData({
        pickers,
        inputs,
        datePickers,
        files,
        pickerMap,
        inputMap,
        fileMap,
        dateMap
      });
    },

    //提交表单
    formSubmit() {
      let formData = {};
      const {
        pickerMap,
        inputMap,
        dateMap,
        fileMap
      } = this;

      for (let i in this) {
        //获取表单数据后缀为Map
        if (i.match(/Map$/)) {
          formData = Object.assign({}, formData, this[i]);
        }
      }

      let hasError = false;

      for (let i in formData) {
        //循环验证所有表单数据规则
        let info = formData[i];

        if (info.original.type === 'input' || info.original.type === 'textarea') {
          if (!info.value) {
            if (info.original.isRequired) {
              info.error = info.original.lable + '不可为空';
              hasError = true;
            }
          } else if (info.rules) {
            for (let val of info.rules) {
              if (!info.value.match(val.regular)) {
                info.error = val.tips || '格式有误';
                hasError = true;
                break;
              }
            }
          }

          this.setData({//[`inputMap.${i}`]: info
          });
          //try fix
          this[`inputMap.${i}`] = info;
        } else if (info.original.type === 'file') {
          if (info.list.length === 0 && info.original.isRequired) {
            let error = '请选择文件';

            if (info.original.accept === 'video') {
              error = '请选择视频';
            } else if (info.original.accept === 'image') {
              error = '请选择图片';
            }

            info.error = error;
            hasError = true;
            this.setData({//[`fileMap.${i}`]: info
            });
            //try fix
            this[`fileMap.${i}`] = info;
          }
        } else if (info.original.type === 'picker' || info.original.type === 'date') {
          if (!info.hasChoose && info.original.isRequired) {
            info.error = '请选择' + info.original.lable;
            hasError = true;
            this.setData({//[`${info.original.type}Map.${i}`]: info
            });
            //try fix
            this[`${info.original.type}Map.${i}`] = info;
          }
        }
      }

      if (hasError) {
        uni.showToast({
          title: '表单填写有误',
          icon: 'none'
        });
        return;
      }

      this.$emit('DynamicFormSubmit', {
        detail: formData
      });
      console.log(formData);
    },

    //更新数据劫持
    updateData(key, val) {
      this.setData({//[key]: val
      });
      //try fix
      this[key] = val;
      this.$emit('DynamicFormChange', {
        detail: {
          key,
          val
        }
      });
    },

    //显示选择器
    datePickerShow(e) {
      if (e.target.dataset.disabled) {
        return;
      }

      this.setData({//[`dateMap.${e.target.dataset.id}.show`]: true
      });
      //try fix
      this[`dateMap.${e.target.dataset.id}.show`] = true;
    },

    //隐藏时间选择器
    datePickerHide(id) {
      if (typeof id === 'object') {
        id = id.target.id;
      }

      this.setData({//[`dateMap.${id}.show`]: false
      });
      //try fix
      this[`dateMap.${id}.show`] = false;
    },

    //设置选择器时间
    setPickerTime(e) {
      const {
        dateMap
      } = this;
      const {
        startTime,
        endTime
      } = e.detail;
      const date = dateMap[e.target.id];

      if (!date.hasChoose) {
        date.hasChoose = true;
        date.error = null;
      }

      date.show = false;
      date.startDate = date.completeTime ? startTime : startTime.split(' ')[0];
      date.endDate = date.completeTime ? endTime : endTime.split(' ')[0];
      this.updateData(`dateMap.${e.target.id}`, date);
    },

    //输入框
    onInput(e) {
      const {
        value
      } = e.detail;
      const info = this.inputMap[e.target.id] || {};

      if (!info) {
        return;
      }

      info.value = e.detail.value;
      info.error = null;

      if (info.rules && info.value) {
        for (let val of info.rules) {
          if (!info.value.match(val.regular)) {
            info.error = val.tips || '格式有误';
            break;
          }
        }
      }

      this.updateData(`inputMap.${e.target.id}`, info);
    },

    //picker选择
    onPickerChange(e) {
      const {
        id
      } = e.target;
      const picker = this.pickerMap[id];

      if (!picker.hasChoose) {
        picker.hasChoose = true;
        picker.error = null;
      }

      picker.idx = e.detail.value;
      picker.data = this.pickers.filter(val => val.id === id)[0].range[e.detail.value];
      this.updateData(`pickerMap.${e.target.id}`, picker);
    },

    // 选择文件
    onFileRead(e) {
      console.log(e);

      for (let val of e.detail.file) {
        const size = this.fileMap[e.target.id].original.maxSize;

        if (val.size > size * 1024 * 1024) {
          uni.showToast({
            title: `请选择${size}MB以内的文件`,
            icon: 'none'
          });
          return;
        }
      }

      const files = this.fileMap[e.target.id];
      files.error = null;
      files.list = files.list.concat(e.detail.file);
      this.updateData(`fileMap.${e.target.id}`, files);
    },

    //删除文件
    onFileDelete(e) {
      console.log(e);
      const files = this.fileMap[e.target.id].list;
      files.splice(e.detail.index, 1);
      this.updateData(`fileMap.${e.target.id}.list`, files);
    }

  }
};
</script>
<style>
/* components/dynamicForm/index.wxss */
.page{
  background-color: #eeeeef;
  padding-top: 1px;
  padding-bottom: 1px;
}
.flex{
  display: flex;
  align-items: center;
}
.form-box{
  padding: 0 30rpx 0px;
  padding-right: 0;
  margin: 30rpx;
  box-sizing: border-box;
  border-top: 1px solid #eee;
  border-radius: 10rpx;
  background-color: #fff;
}
.form-row{
  position: relative;
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  font-size: 30rpx;
  border-bottom: 1px solid #eee;
}
.ipt-row{
  align-items: flex-start;
}
.flex-start{
  align-items: flex-start;
}
.picker-row{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.form-row:last-child{
  border-bottom: none;
}
.form-lable{
  position: relative;
  min-width: 120rpx;
  max-width: 200rpx;
  word-break: break-all;
  padding-right: 30rpx;
  flex-shrink: 0;
  flex-grow: 0;
  font-weight: 700;
}
.field{
  width: 100%;
  flex-grow: 1;
  min-height: 45rpx;
  padding-right: 30rpx;
  box-sizing: border-box;
  line-height: 45rpx;
}
.error-info{
  font-size: 24rpx;
  color: #f00;
}
.required::before{
  position: absolute;
  top: 50%;
  left: -18rpx;
  transform: translateY(-35%);
  content: '*';
  color: #f00;
  font-size: 36rpx;
}
.form-btn{
  margin: 60rpx auto;
  width: 400rpx;
  background-color: #17e;
  color: #fff;
}
.row-icon{
  padding-right: 20rpx;
}
.img-box{
  padding-top: 25rpx;
  /* padding-bottom: 25rpx; */
}
.mb-24{
  margin-bottom: 24rpx;
}
.area-lable{
  position: relative;
  font-size: 30rpx;
  margin-right: 20rpx;
  font-weight: 700;
}
.textarea-box{
  padding-top: 20rpx;
}
.text-area{
  position: relative;
  width: 630rpx;
  padding: 20rpx;
  padding-bottom: 60rpx;
  font-size: 30rpx;
  min-height: 200rpx;
  box-sizing: border-box;
  border-radius: 8rpx;
  border: 1px solid #eee;
}
.text-num{
  position: absolute;
  right: 20rpx;
  bottom: 10px;
  text-align: right;
  color: #999;
}

.disabled{
  opacity: 0.3;
}

@import "./index-wxa-auto-dark.css";
</style>