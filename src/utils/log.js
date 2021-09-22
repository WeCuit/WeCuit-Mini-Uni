import {debug} from '../config.js'
const log = uni.getRealtimeLogManager ? uni.getRealtimeLogManager() : null;
module.exports = {
  debug() {
    if (!log) return;
		if(debug) console.log(arguments);
    log.debug.apply(log, arguments);
  },

  info() {
    if (!log) return;
		if(debug) console.info(arguments);
    log.info.apply(log, arguments);
  },

  warn() {
    if (!log) return;
		if(debug) console.warn(arguments);
    log.warn.apply(log, arguments);
  },

  error() {
    if (!log) return;
		if(debug) console.error(arguments);
    log.error.apply(log, arguments);
  },

  setFilterMsg(msg) {
    // 从基础库2.7.3开始支持
    if (!log || !log.setFilterMsg) return;
    if (typeof msg !== 'string') return;
    log.setFilterMsg(msg);
  },

  addFilterMsg(msg) {
    // 从基础库2.8.1开始支持
    if (!log || !log.addFilterMsg) return;
    if (typeof msg !== 'string') return;
    log.addFilterMsg(msg);
  }

};