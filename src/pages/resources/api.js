import http from '../../utils/request.js'

export default {
	getResource: ()=>http.get('https://raw.githubusercontents.com/WeCuit/cuit_sharing/api/result.json', null, {ignoreCode:true})
}