import request from '../../utils/request'; // 获取课表选项

export const getCourseOption = cookie => {
  return request.post("/v3/Jwgl/getCourseOption/", {
    cookie
  });
}; // 获取课表

export const getCourseTable = (cookie, courseType, semester) => {
  return request.post('/v3/Jwgl/getCourseTableV2/', {
    cookie,
    courseType,
    semester
  });
};