import request from '../../utils/request.js'

const getAccessToken = (code)=>request.get('/v3/auth/getAccessToken', {code}, {notice: false})

module.exports = {
	getAccessToken
}