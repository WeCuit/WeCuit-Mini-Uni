import request from "../../../utils/request.js"

export const postRegister = (userId,userPass)=>request.post('/auth/binding/student', {userId,userPass})