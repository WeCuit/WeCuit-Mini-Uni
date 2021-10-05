import request from '../../utils/request.js'

export const getTokenTnfo = (token) => request.get('/v3/auth/mini/tokenInfo', {token})

export const postTokenResult = (token, code)=>request.post('/v3/auth/mini/result', {token, code})

export const postBindMini2Mini = (token, code)=>request.post('/v3/auth/binding/mini', {token, code})