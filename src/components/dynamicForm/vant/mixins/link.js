
module.exports = {
  data() {
    return {};
  },

  props: {
    url: String,
    linkType: {
      type: String,
      default: 'navigateTo'
    }
  },
  methods: {
    jumpLink: function jumpLink(urlKey) {
      if (urlKey === void 0) {
        urlKey = 'url';
      }

      var url = this[urlKey];

      if (url) {
        uni[this.linkType]({
          url: url
        });
      }
    }
  }
};