import request from '../../utils/request.js'

export const getTokenTnfo = (token) => request.get('/auth/mini/tokenInfo', {token})

export const postTokenResult = (token, code)=>request.post('/auth/mini/result', {token, code})

export const postBindMini2Mini = (token, code)=>request.post('/auth/binding/mini', {token, code})