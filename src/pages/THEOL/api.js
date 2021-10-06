import request from "../../utils/request";
export const getCourseList = cookie => request.post('/v3/Theol/courseList', {
  cookie
});
export const theolLogin = data => request.post('/v3/Theol/login', data);