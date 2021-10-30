import request from "../../utils/request";
export const getCourseList = cookie => request.post('/v3/Theol/courseList', {
  cookie
});
export const theolLogin = data => request.post('/v3/Theol/login', data);

export const getDirTree = lid => request.get('/v3/Theol/dirTree?lid=' + lid)

export const postFolderList = (lid, folderId, cookie) => request.post('/v3/Theol/folderList', {lid, folderId, theolCookie:cookie})