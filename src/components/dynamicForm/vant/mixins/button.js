
module.exports = {
  data() {
    return {};
  },

  props: {
    id: String,
    sessionFrom: String,
    appParameter: String,
    sendMessageImg: String,
    sendMessagePath: String,
    showMessageCard: String,
    sendMessageTitle: String,
    lang: {
      type: String,
      default: 'en'
    }
  },
  methods: {}
};