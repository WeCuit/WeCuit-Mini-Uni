<template>
  <view>
    <view class="top-wrap">
      <tab
        id="category"
        :tab-data="categoryMenu"
        :tabcur="categoryCur"
        :size="80"
        :scroll="true"
        @change="toggleCategory"
      ></tab>
    </view>

    <swiper :current="categoryCur" :duration="duration" @animationfinish="animationFinish">
      <swiper-item v-for="(item, index) in categoryData" :key="index">
        <scroll
          :requesting="item.requesting"
          :end="item.end"
          :empty-show="item.emptyShow"
          :list-count="item.listData.length"
          :has-top="true"
          :top-size="80"
          @refresh="refresh"
          @more="more"
        >
          <view class="cells">
            <view
              v-for="(item, index2) in item.listData"
              :key="index2"
              class="cell"
              :data-link="item.link"
              @tap="showArticle"
            >
              <view class="cell__bd">
                <view class="name">
                  <rich-text :nodes="item.title"></rich-text>
                </view>
                <view class="tags">
                  <view class="tags__bd">
                    <view v-for="(item, index) in item.tags" :key="index" class="tag">{{item.name}}</view>
                  </view>
                  <view class="date">{{item.date}}</view>
                </view>
              </view>
            </view>
          </view>
        </scroll>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { getNewsTag, getNewsList } from "./api";
import Url from "url-parse";
let pageStart = 1;
import tab from "../../components/tab/index";
import scroll from "../../components/scroll/index";

export default {
  data() {
    return {
      duration: 300,
      // swiper-item 切换过渡时间
      categoryCur: 0,
      // 当前数据列索引
      categoryMenu: [],
      // 分类菜单数据, 字符串数组格式
      categoryData: [],
      // 所有数据列
      source: "home",
      selected: 0
    };
  },

  components: {
    tab,
    scroll
  },
  props: {},

  onLoad(options) {
    if (options.source) this.source = options.source;
    if (options.tag) this.tag = options.tag; // get tag

    getNewsTag(this.source).then(res => {
      const resp = res.data;
      let menus = resp.data || [];
      let categoryMenu = [];
      let categoryData = [];
      menus.forEach((item, index) => {
        categoryMenu.push(item.text.replace("&amp;", "&"));
        categoryData.push({
          id: item.name,
          categoryCur: index,
          requesting: false,
          end: false,
          emptyShow: false,
          page: pageStart,
          pageCount: item.total || 1,
          listData: []
        });
      });
      this.setData({
        categoryMenu,
        categoryData
      }); // 第一次加载延迟 350 毫秒 防止第一次动画效果不能完全体验

      setTimeout(() => {
        this.refresh();
      }, 350);
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
    }

    uni.showShareMenu({
      withShareTicket: true,
      // for wx
      menus: ["shareAppMessage", "shareTimeline"],
      // for qq
      showShareItems: ["qq", "qzone", "wechatFriends", "wechatMoment"]
    });
  },

  /**
   * 分享至微信朋友圈
   */
  onShareTimeline: function() {
    return {
      title: this.tabs[this.activeTab].text,
      query: `source=${this.source}&tag=${this.tabs[this.activeTab]}`
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    return {
      title: this.tabs[this.activeTab].name,
      // for wechat
      path: `/pages/newsList/newsList?source=${this.source}&tag=${
        this.tabs[this.activeTab]
      }`,
      // for qq
      query: `source=${this.source}&tag=${this.tabs[this.activeTab]}`
    };
  },
  methods: {
    getList(type, currentPage) {
      let currentCur = this.categoryCur;
      let pageData = this.getCurrentData(currentCur);
      console.log(pageData);
      if (type !== "refresh" && pageData.end) return;
      pageData.requesting = true;
      this.setCurrentData(currentCur, pageData);
      getNewsList(this.source, pageData.id, currentPage).then(res => {
        const resp = res.data;
        let data = resp.data || {
          list: [],
          over: false
        };
        data.over = currentPage >= pageData.pageCount;
        this.domain = resp.data.domain;
        let listData = data.list || [];
        pageData.requesting = false;

        if (type === "refresh") {
          pageData.listData = listData;
          pageData.end = data.over;
          pageData.page = currentPage + 1;
        } else {
          pageData.listData = pageData.listData.concat(listData);
          pageData.end = data.over;
          pageData.page = currentPage + 1;
        }

        uni.setNavigationBarTitle({
          title: data.name
        });
        this.setCurrentData(currentCur, pageData);
      });
    },

    // 更新页面数据
    setCurrentData(currentCur, pageData) {
      let categoryData = this.categoryData;
      categoryData[currentCur] = pageData;
      this.setData({
        categoryData: categoryData
      });
    },

    // 获取当前激活页面的数据
    getCurrentData() {
      return this.categoryData[this.categoryCur];
    },

    // 顶部tab切换事件
    toggleCategory(e) {
      this.setData({
        duration: 0
      });
      setTimeout(() => {
        this.setData({
          categoryCur: e.detail.index
        });
      }, 0);
    },

    // 页面滑动切换事件
    animationFinish(e) {
      this.setData({
        duration: 300,
        categoryCur: e.detail.current
      });
      let pageData = this.getCurrentData();

      if (pageData.listData.length === 0) {
        this.getList("refresh", pageStart);
      }
    },

    // 刷新数据
    refresh() {
      this.getList("refresh", pageStart);
    },

    // 加载更多
    more() {
      this.getList("more", this.getCurrentData(this.categoryCur).page);
    },

    showArticle(e) {
      let path = e.currentTarget.dataset.link;

      if (path.indexOf("http") === 0) {
        let url = new Url(path, true);
        console.log(url);
        uni.navigateTo({
          url: `/pages/articleView/articleView?path=${encodeURIComponent(
            url.pathname
          )}&source=${this.source}&domain=${url.hostname}`
        });
      } else {
        uni.navigateTo({
          url: `/pages/articleView/articleView?path=${encodeURIComponent(
            path
          )}&source=${this.source}&domain=${this.domain}`
        });
      }
    }
  }
};
</script>
<style>
@import "./newsList-wxa-auto-dark.css";
.top-wrap {
  position: fixed;
  left: 0;
  top: 0; /*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top)); /*  #endif  */
  width: 100%;
  background-color: #ffffff;
  z-index: 99;
  box-shadow: 0 0 20rpx -5rpx rgba(0, 0, 0, 0.1);
}

swiper {
  height: 100vh;
}

.cells {
  background: #ffffff;
  margin-top: 20rpx;
}

.cell {
  display: flex;
  padding: 20rpx;
}
.cell:not(:last-child) {
  border-bottom: 1rpx solid #ebedf0;
}
.cell__bd {
  flex: 1;
}
.cell__bd .name {
  height: 80rpx;
  font-size: 28rpx;
  margin-bottom: 12rpx;
}
.cell__bd .name > view {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
}
.cell__bd .tags {
  display: flex;
  align-items: center;
}
.cell__bd .tags .tags__bd {
  flex: 1;
}
.cell__bd .tags .tags__bd > view {
  display: inline-block;
  border: 1px solid rgba(63, 130, 253, 0.6);
  color: rgba(63, 130, 253, 0.6);
  font-size: 20rpx;
  height: 30rpx;
  line-height: 30rpx;
  padding: 0 8rpx;
}
.cell__bd .tags .date {
  color: #999999;
  font-size: 24rpx;
}
</style>