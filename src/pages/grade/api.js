import request from '../../utils/request'; // 获取成绩

export const getGradeTable = cookie => {
  return request.post("/v3/Jwgl/getGradeTableV2/", {
    cookie
  });
};