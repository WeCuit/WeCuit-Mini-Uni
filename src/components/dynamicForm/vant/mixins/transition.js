
export default function (showDefaultValue) {
  return {
    data() {
      return {
        type: '',
        inited: false,
        display: false,
        supportAnimation: true
      };
    },

    props: {
      customStyle: String,
      show: {
        type: Boolean,
        default: showDefaultValue
      },
      duration: {
        type: Number,
        default: 300
      }
    },
    watch: {
      show: {
        handler: 'observeShow',
        immediate: true
      }
    },
    beforeMount: function attached() {
      if (this.show) {
        this.show();
      }

      this.detectSupport();
    },
    methods: {
      detectSupport: function detectSupport() {
        var _this = this;

        uni.getSystemInfo({
          success: function success(info) {
            if (info && info.system && info.system.indexOf('iOS 8') === 0) {
              _this.set({
                supportAnimation: false
              });
            }
          }
        });
      },
      observeShow: function observeShow(value) {
        if (value) {
          this.show();
        } else {
          if (this.supportAnimation) {
            this.set({
              type: 'leave'
            });
          } else {
            this.set({
              display: false
            });
          }
        }
      },
      show: function show() {
        this.set({
          inited: true,
          display: true,
          type: 'enter'
        });
      },
      onAnimationEnd: function onAnimationEnd() {
        if (!this.show) {
          this.set({
            display: false
          });
        }
      }
    }
  };
}