<template>
<view class="beat-text">
    <view class="beat-char-group">
        <block v-for="(item, index) in beatChar" :key="index">
            <text class="beat-char beat-char-ani" :style="'--delay:' + (index*500) + 'ms;--color:#f00;--animation:' + (ani?'beatAni':'beatAni1')">{{item}}</text>
        </block>
    </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      beatChar: [],
      beatInterval: null,
      ani: false
    };
  },

  components: {},
  props: {
    beatText: {
      type: String,
      default: "test"
    }
  },
  watch: {
    beatText: {
      handler: function (newVal, oldVal) {
        // 属性值变化时执行
        console.log('new->', newVal, '|old->', oldVal);
        this.beatCharInit(newVal);
      },
      immediate: true
    }
  },
  // 私有数据，可用于模板渲染
  mounted: function () {},
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  beforeMount: function () {},
  moved: function () {},
  destroyed: function () {},
  methods: {
    beatCharInit(text) {
      var charArr = text.split('');
      console.log(charArr);
      this.setData({
        beatChar: charArr,
        ani: true
      });
      if (this.beatInterval) clearInterval(this.beatInterval);
      this.beatInterval = setInterval(() => {
        console.log('改变动画!');
        this.setData({
          ani: !this.ani
        });
      }, charArr.length * 500 + 500);
    }

  }
};
</script>
<style>

.beat-text{
    padding: 50rpx;
}
.beat-char-group {
    height: 200rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: row;
}
.beat-char {
    position: relative;
    margin-top: 40rpx;
      top:60rpx;
      font-family: "Impact",sans-serif;
      font-size: 40rpx;
      text-shadow: 0 1px 0 #CCC,
                   0 2px 0 #CCC,
                   0 3px 0 #CCC,
                   0 4px 0 #CCC,
                   0 5px 0 #CCC,
                   0 6px 0 transparent,
                   0 7px 0 transparent,
                   0 8px 0 transparent,
                   0 9px 0 transparent,
                   0 10px 10px rgba(0, 0, 0, .4);
}
.beat-char-ani {
    animation: var(--animation) 200ms ease  2 alternate none;
}
.beat-char-ani{
    color:var(--color);
    animation-delay: var(--delay);
}
@keyframes beatAni {
    100% 
      {
         top: 10rpx;
         text-shadow: 0 1px 0 #CCC,
                      0 2px 0 #CCC,
                      0 3px 0 #CCC,
                      0 4px 0 #CCC,
                      0 5px 0 #CCC,
                      0 6px 0 #CCC,
                      0 7px 0 #CCC,
                      0 8px 0 #CCC,
                      0 9px 0 #CCC,
                      0 50px 25px rgba(0, 0, 0, .2);
      }
}

@keyframes beatAni1 {
    100% 
      {
         top: 10rpx;
         text-shadow: 0 1px 0 #CCC,
                      0 2px 0 #CCC,
                      0 3px 0 #CCC,
                      0 4px 0 #CCC,
                      0 5px 0 #CCC,
                      0 6px 0 #CCC,
                      0 7px 0 #CCC,
                      0 8px 0 #CCC,
                      0 9px 0 #CCC,
                      0 50px 25px rgba(0, 0, 0, .2);
      }
}
</style>