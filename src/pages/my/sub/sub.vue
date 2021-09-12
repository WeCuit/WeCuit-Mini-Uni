<template>
<view>
<!--  -->
<mp-cells title="订阅项目" footer="点击文字可增加订阅次数">
    <mp-cell v-for="(item, index) in tplList" :key="index">
        <switch slot="icon" :checked="item.status" :data-index="index" @change="changeSubStatus"></switch>

        <view @tap="addSubCnt" :data-index="index">{{item.description}}</view>
        <view slot="footer" @tap="addSubCnt" :data-index="index">{{item.subCnt}}</view>

    </mp-cell>
</mp-cells>
<button class="btn" type="warn" :loading="delBtnLoading" :disabled="delBtnDisabled" @tap="bindDelSub">
    删除订阅信息
</button>
<view>说明：</view>
<text :user-select="true">
    1.打开开关，小程序将会把经过RSA非对称加密的账号于密码上传至云端，供打卡以及成绩提醒使用。
    2.开启后，若需打卡或成绩提醒，还需到相应页面填写细节。
    3.末尾数字为订阅次数；订阅次数为0时，不进行成绩关系监测；但会进行打卡操作。
    4.点击文字，在同意后会增加一次订阅次数。
    5.“删除订阅信息”将会把阁下的所有信息从数据库删除
</text>
</view>
</template>

<script>
// pages/my/sub/sub.js
const app = getApp();
import { genQuerySign } from "../../../utils/tool";
import mpCell from "../../../miniprogram_npm/weui-miniprogram/cell/cell";
import mpCells from "../../../miniprogram_npm/weui-miniprogram/cells/cells";

export default {
  data() {
    return {
      tplList: [{
        tplId: "1",
        templateId: "ntDQ6-GCdTqbYCtqigSc7ZzK7rvyH1bfD_5wtcVgPWo",
        type: "wx",
        description: "期末成绩更新提醒",
        subCnt: 0
      }, {
        tplId: "2",
        templateId: "VOXuOsX_vQLFI2Ph5w0Q9qG_7X5VE5bntcN3H6RSvUM",
        type: "wx",
        description: "打卡提醒",
        subCnt: 0
      }],
      delBtnDisabled: true,
      delBtnLoading: false
    };
  },

  components: {
    mpCell,
    mpCells
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTemplateIdList().then(() => {
      this.getSubStatus();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
  onPullDownRefresh: function () {
    this.getSubStatus();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    getTemplateIdList: function () {
      uni.showLoading({
        title: "获取订阅列表~"
      });
      return app.globalData.httpGet({
        url: "/Sub/getTemplateIdList"
      }).then(data => {
        uni.hideLoading();
        this.setData({
          tplList: data.data
        });
      }).catch(err => {
        uni.showToast({
          icon: "none",
          title: err.errMsg ? err.errMsg : "未知异常"
        });
      });
    },
    changeSubStatus: function (e) {
      const index = e.currentTarget.dataset.index;
      const value = e.detail.value;
      this.tplList[index].status = value;
      console.log(e);
      this.showConfirm(value).then(() => {
        uni.showLoading({
          title: "请求中~"
        });
        app.globalData.httpPost({
          url: "/Sub/changeStatusV2",
          data: {
            openid: app.globalData.openid,
            status: value,
            tplId: this.tplList[index].tplId,
            userId: app.globalData.accountInfo.userId,
            userPass: app.globalData.RSAEncrypt(app.globalData.accountInfo.userPass),
            sign: genQuerySign("/Sub/changeStatusV2/", app.globalData.openid, this.tplList[index].tplId)
          }
        }).then(data => {
          uni.showToast({
            title: data.errMsg
          });

          if (value && this.delBtnDisabled) {
            this.setData({
              delBtnDisabled: false
            });
          }

          this.setData({
            tplList: this.tplList
          });
        }).catch(err => {
          uni.showToast({
            icon: "none",
            title: err.errMsg ? err.errMsg : "未知异常"
          });
          this.tplList[index].status = false;
          this.setData({
            tplList: this.tplList
          });
        });
      }).catch(() => {
        this.tplList[index].status = !value;
        this.setData({
          tplList: this.tplList
        });
      });
    },
    // 获取订阅状态
    getSubStatus: function () {
      uni.showLoading({
        title: "获取订阅信息~"
      });
      app.globalData.httpPost({
        url: "/Sub/getStatusV2",
        data: {
          openid: app.globalData.openid,
          sign: genQuerySign("/Sub/getStatusV2/", app.globalData.openid)
        }
      }).then(data => {
        uni.hideLoading();
        uni.stopPullDownRefresh();
        var sub = data.sub;
        var delBtnDisabled = this.delBtnDisabled;

        for (var i = 0; i < sub.length; i++) {
          for (var j = 0; j < this.tplList.length; j++) {
            if (this.tplList[j].tplId === sub[i].tplId) {
              this.tplList[j].subCnt = parseInt(sub[i].subCnt);
              this.tplList[j].status = sub[i].status;
              delBtnDisabled = !this.tplList[j].status;
            }
          }
        }

        if (delBtnDisabled !== this.delBtnDisabled) {
          this.setData({
            delBtnDisabled: delBtnDisabled
          });
        }

        this.setData({
          tplList: this.tplList
        });
      }).catch(err => {
        uni.hideLoading();
        uni.stopPullDownRefresh();
        uni.showToast({
          icon: "none",
          title: err.errMsg ? err.errMsg : "未知异常"
        });
      });
    },
    showConfirm: function (isShow) {
      return new Promise((resolve, reject) => {
        if (isShow) uni.showModal({
          title: "订阅提示",
          content: "订阅消息将加密上传学号密码",
          success: res => {
            if (res.confirm) {
              resolve();
            } else if (res.cancel) {
              uni.showToast({
                icon: "none",
                title: "取消"
              });
              reject();
            }
          }
        });else resolve();
      });
    },
    addSubCnt: function (e) {
      console.log(e);
      const index = e.currentTarget.dataset.index;

      if (true !== this.tplList[index].status) {
        uni.showToast({
          icon: "none",
          title: "暂未开启订阅！"
        });
        return;
      }

      new Promise((resolve, reject) => {
        // QQ微信订阅
        if (uni.requestSubscribeMessage) {
          uni.requestSubscribeMessage({
            tmplIds: [this.tplList[index].templateId],
            success: res => {
              if ("accept" === res[this.tplList[index].templateId]) {
                resolve(true); // 添加
              } else {
                reject({
                  errMsg: res[this.tplList[index].templateId]
                });
              }
            },
            fail: err => {
              reject(err);
            }
          });
        } else if (qq.subscribeAppMsg) {
          // 一次性订阅
          qq.subscribeAppMsg({
            tmplIds: [this.tplList[index].templateId],
            subscribe: true,
            success: res => {
              if ("accept" === res[this.tplList[index].templateId]) {
                resolve(true);
              } else {
                reject({
                  errMsg: res[this.tplList[index].templateId]
                });
              }
            },

            fail(res) {
              console.log("----subscribeAppMsg----fail", res);
            }

          });
        }
      }).then(res => {
        uni.showLoading({
          title: "请求中~"
        });
        app.globalData.httpPost({
          url: "/Sub/addCntV2",
          data: {
            openid: app.globalData.openid,
            tplId: this.tplList[index].tplId,
            sign: genQuerySign("/Sub/addCntV2/", app.globalData.openid, this.tplList[index].tplId)
          }
        }).then(data => {
          uni.showToast({
            title: data.errMsg
          });
          this.tplList[index].subCnt = this.tplList[index].subCnt ? this.tplList[index].subCnt + 1 : 1;
          this.setData({
            tplList: this.tplList
          });
        }).catch(err => {
          uni.showToast({
            icon: "none",
            title: err.errMsg ? err.errMsg : "未知异常"
          });
        });
      }).catch(err => {
        console.log(err);
      });
    },
    bindDelSub: function () {
      this.setData({
        delBtnLoading: true
      });

      let _that = this;

      app.globalData.httpPost({
        url: "/Sub/deleteV2",
        data: {
          openid: app.globalData.openid,
          sign: genQuerySign("/Sub/deleteV2/", app.globalData.openid)
        }
      }).then(data => {
        _that.setData({
          delBtnLoading: false
        });

        uni.showToast({
          title: "删除成功"
        });

        for (var i = 0; i < this.tplList.length; i++) {
          this.tplList[i].status = false;
          this.tplList[i].subCnt = 0;
        }

        this.setData({
          tplList: this.tplList,
          delBtnDisabled: true
        });
      }).catch(err => {
        _that.setData({
          delBtnLoading: false
        });

        if ("undefined" != typeof err.errMsg) {
          uni.showToast({
            icon: "none",
            title: err.errMsg
          });
        } else {
          uni.showToast({
            icon: "none",
            title: "未知错误"
          });
        }
      });
    }
  }
};
</script>
<style>
/* pages/my/sub/sub.wxss */
@import "../../common.css";
</style>