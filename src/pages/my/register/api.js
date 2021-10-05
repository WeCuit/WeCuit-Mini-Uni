import request from '../../../utils/request.js'
const getMiniRegister = (code)=>request.get('/v3/auth/register', {code})
export default getMiniRegister