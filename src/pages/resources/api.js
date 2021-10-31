import http from '../../utils/request.js'

export default {
	getResource: ()=>http.get('https://github.jysafe.cn/cuit_sharing/api/result.json', null, {
		ignoreCode:true
	})
}