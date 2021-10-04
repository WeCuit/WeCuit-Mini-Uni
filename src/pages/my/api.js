import request from '../../utils/request';

// SSO退出登录
export const ssoLogout = cookie => {
	return request.get("https://sso.cuit.edu.cn/authserver/logout", null, {
		header: {
			cookie
		}
	});
};

// 教务管理登录检查
export const jwglLoginCheck = cookie => {
	return request.post("/Jwgl/loginCheck", {
		cookie
	});
};
