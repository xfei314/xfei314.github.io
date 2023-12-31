const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNhYjRhNjc1NWY4YzQyOGMxNDJlMzciLCJuYW1lIjoi6LaF57qn566h55CG5ZGYIiwiYWNjb3VudCI6InhhZG1pbiIsImlhdCI6MTY4ODk1NTg3NiwiZXhwIjoxNjg5MTI4Njc2fQ.dpV8b4u2r0zi-yLP9NVFUwAoyChS0vHiZ17vR6Bi1PQ";

const user = {
  _id: "633ab4a6755f8c428c142e37",
  account: "xadmin",
  name: "超级管理员",
  roles: [], // 角色
  // fns 功能点
  fns: [],
  theme: "light",
  lang: "zh_CN",
  avatar: "",
  menus: [
    { id: "90", pid: "0", title: "首页", name: "home", path: "/home", host: "" },
    { id: "102", pid: "0", title: "app-3d", name: "xdp-3d", host: "" },
    { id: "10201", pid: "102", title: "3d-home", path: "/xdp-3d/home" },
    { id: "10202", pid: "102", title: "cesium demo", path: "/xdp-3d/cesium" },

    { id: "103", pid: "0", title: "app-test2", name: "xdp-t2", host: "" },
    { id: "10301", pid: "103", title: "t2-home", path: "/xdp-t2/home" },
    { id: "10302", pid: "103", title: "t2-about", path: "/xdp-t2/about" },
    {
      id: "10306",
      pid: "105",
      title: "t2-echart",
      show: false,
      path: "/xdp-t2/echart",
      target: "_black",
    },

    { id: "101", pid: "0", title: "系统管理", name: "xdp-sys", host: "" },
    { id: "10101", pid: "101", title: "用户管理", path: "/xdp-sys/a1", target: "_black" },
    { id: "10102", pid: "101", title: "角色管理", path: "/xdp-sys/a2" },
    { id: "10103", pid: "101", title: "功能管理", path: "/xdp-sys/a3" },
    { id: "10104", pid: "101", title: "菜单管理", path: "/xdp-sys/a4" },

    { id: "91", pid: "0", title: "关于我们", name: "about", path: "/about", host: "" },
  ],
};

export default [
  {
    url: "/api/user/getUserInfo",
    method: "post",
    response: () => {
      return {
        code: 200,
        data: user,
        token,
      };
    },
  },
  {
    url: "/api/user/login",
    method: "post",
    response: () => {
      return {
        code: 200,
        data: user,
        token,
      };
    },
  },
  {
    url: "/api/user/changeLang",
    method: "post",
    response: () => {
      return {
        code: 200,
        data: {},
        msg: "操作成功",
      };
    },
  },
  {
    url: "/api/user/changeTheme",
    method: "post",
    response: () => {
      return {
        code: 200,
        data: {},
        msg: "操作成功",
      };
    },
  },
];
