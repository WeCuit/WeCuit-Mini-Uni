import request from '../../../../utils/request'; // 获取辅导员列表

export const getCounselorList = college => {
  return request.get("/v3/college/getCounselorList/college/" + college);
};