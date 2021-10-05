import request from "../../utils/request";
export const downFilePrepare = data => request.post("/v3/News/downFilePrepare", data);