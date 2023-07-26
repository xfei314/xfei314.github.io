import request from "@/libs/request";

//  图片验证码
export function getIndexImageCaptcha() {
  return request({
    url: `/api/user/getIndexImageCaptcha`,
    method: "post",
  });
}
// 登录
export function login(data) {
  return request({
    url: `/api/user/login`,
    method: "post",
    data,
  });
}

export function logout() {
  return request({
    url: `/api/user/logout`,
    method: "post",
  });
}

// 基础平台获取用户信息
export function getUserInfo() {
  return request({
    url: `/api/user/getUserInfo`,
    method: "post",
  });
}

export function changeLang(data) {
  return request({
    url: `/api/user/changeLang`,
    method: "post",
    data,
  });
}

export function changeTheme(data) {
  return request({
    url: `/api/user/changeTheme`,
    method: "post",
    data,
  });
}
