import request from '../../utils/request.js'

const getAccessToken = (code)=>request.get('/auth/getAccessToken', {code}, {notice: false})

module.exports = {
	getAccessToken
}