<template>
<view :class="'weui-badge ' + extClass + ' ' + (!content ? 'weui-badge_dot' : '')">{{content}}</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    extClass: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  options: {
    addGlobalClass: true
  },
  methods: {}
};
</script>
