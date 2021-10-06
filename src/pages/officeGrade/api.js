import request from '../../utils/request';
export const getOfficePrepare = () => request.get("/v3/Jszx/office_prepare");
export const getOfficeCaptcha = data => request.get("/v3/Jszx/office_getCaptcha", data);
export const officeQuery = data => request.post('/v3/Jszx/office_query', data);