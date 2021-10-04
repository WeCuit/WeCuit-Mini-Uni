import request from '../../../utils/request.js'
const getMiniRegister = (code)=>request.get('/auth/register', {code})
export default getMiniRegister