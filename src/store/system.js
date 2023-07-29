import { reactive, watchPostEffect, watch } from "vue";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import zh_CN from "xdp/ui/locale/lang/zh-cn";
import en_US from "xdp/ui/locale/lang/en-us";
import { setToken, addInterceptorsRequest, addInterceptorsResponse } from "@/libs/request";
import { setSessionData } from "@/utils";
import * as userApi from "@/api/user";

import { Message } from "xdp";
import { cloneDeep, debounce } from "lodash-es";
import { isDev, sleep, setThemeColor } from "@/utils";
import router, { push } from "@/router";

const uiI18n = {
  zh_CN,
  en_US,
};
let allRequestClose = null;
function hideAjaxLoading() {
  if (allRequestClose) {
    allRequestClose.close();
    allRequestClose = null;
  }
}
function showAjaxLoading() {
  if (!allRequestClose) {
    allRequestClose = Message.loading({ content: `loading 加载中`, duration: 0, closable: true });
  }
}
function setUserToken(token) {
  setSessionData("token", token);
  setToken(token);
}
function addAllRequestFn() {
  if (sessionStorage.getItem("token")) {
    setToken(sessionStorage.getItem("token"));
  }

  addInterceptorsRequest(
    function (config) {
      // Do something before request is sent
      console.log("x-ajax-request config", config);
      // 可以修改请求参数
      showAjaxLoading();
      return config;
    },
    function (error) {
      // Do something with request error
      console.log("x-ajax-request error", error);
      return Promise.reject(error);
    }
  );
  addInterceptorsResponse(
    function (response) {
      console.log("x-ajax-response ", response);
      hideAjaxLoading();
      const { config, data } = response;
      const { code, msg } = data;
      if (code !== 200) {
        Message.error(msg);
        return;
      }
      if (config.url === "/api/user/login") {
        setUserToken(data.token);
      }

      // 可以修改返回值
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return data.data;
    },
    function (error) {
      console.log("x-ajax-response error", error);
      hideAjaxLoading();
      Message.error({ content: error.message, duration: 2000, closable: true });
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      // return Promise.reject(error);
    }
  );
}
addAllRequestFn();

export default defineStore("systemStore", () => {
  console.log("xx useSystemStore init ");
  const { locale, mergeLocaleMessage } = useI18n();
  const state = reactive({
    showLoginWin: false,
    lang: "",
    theme: "",
    primaryColor: "#165DFF", //蓝色 #165DFF  绿色 #18a058
    leftMenuCollapsed: false,
    uiLang: {},
    langList: [],
    // 用户信息
    userInfo: {
      _id: "",
      account: "",
      avatar: "",
      theme: "",
      name: "",
      lang: "",
      roles: [], // 角色
      permissionList: [], // 权限点
    },
    // meun
    menuId: "",
    menus: [],
    menuTabId: "",
    menuTabs: [],
    // beforeEach url
    beforeFullPath: "",
  });
  function changeUrlByMenuId(id) {
    let item = state.menus.find(r => r.id === id);
    if (!item) return;
    push(item.path);
  }
  function findLastMenu(fullPath) {
    let menu = null;
    // last to first
    for (let i = state.menus.length - 1; i >= 0; i--) {
      const item = state.menus[i];
      if (fullPath.startsWith(item.path)) {
        menu = item;
        break;
      }
    }
    return menu;
  }
  // 删除 meun tabs
  function deleteMenuTabs(id) {
    if (state.menuTabs.length === 0) return;
    let index = state.menuTabs.findIndex(r => r.id === id);
    if (index === -1) return;
    let item = state.menuTabs[index];
    if (!item) return;
    const needSetId = state.menuTabId === item.id;
    let fullPath = "/";
    if (state.menuTabs.length === 1) {
      state.menuTabs = [];
    } else {
      // delete
      if (needSetId) {
        if (index === state.menuTabs.length - 1) {
          fullPath = state.menuTabs[index - 1].fullPath;
        } else {
          fullPath = state.menuTabs[index + 1].fullPath;
        }
      }
      state.menuTabs.splice(index, 1);
    }
    if (needSetId) push(fullPath);
  }
  // set left menu  ， main tabs
  const setMenuAndTabs = debounce(({ menus, fullPath }) => {
    if (!fullPath) return;
    if (fullPath === "/") return;
    if (menus.length === 0) return;
    console.log("x system setMenuAndTabs", fullPath);
    // left menu
    let menu = menus.find(r => r.path === fullPath);
    if (menu) {
      state.menuId = menu.id;
    } else {
      state.menuId = "";
    }

    // menu tabs
    let tab = state.menuTabs.find(r => r.fullPath === fullPath);
    if (!tab) {
      // add
      menu = findLastMenu(fullPath);
      console.log("x system setMenuAndTabs findLastMenu menu", menu);
      if (menu) {
        tab = {
          id: new Date().getTime() + "",
          name: menu.name,
          title: menu.title,
          icon: menu.icon,
          fullPath: fullPath,
        };
      } else {
        tab = {
          id: new Date().getTime() + "",
          title: "not find!",
          fullPath: fullPath,
        };
        tab.name = tab.id;
      }
      state.menuTabs.push(tab);
    }
    state.menuTabId = tab.id;
  }, 200);
  // url 修改
  router.beforeEach((to, from, next) => {
    state.beforeFullPath = to.fullPath;
    next();
  });
  watch(
    () => [state.menus, state.beforeFullPath],
    () => {
      setMenuAndTabs({ menus: state.menus, fullPath: state.beforeFullPath });
    },
    { immediate: true }
  );

  //  设置主题色
  watchPostEffect(() => {
    if (state.primaryColor) {
      setThemeColor(state.primaryColor);
    }
  });

  function setLangList(arr) {
    state.langList = arr;
  }

  async function clearToken() {
    setToken("");
    state.token = "";
    state.userInfo = {
      _id: "",
      account: "",
      avatar: "",
      theme: "",
      name: "",
      lang: "",
      roles: [], // 角色
      permissionList: [], // 权限点
    };
    // 登录
    state.showLoginWin = true;
  }
  // 加载用户信息
  async function initUser() {
    // 生产环境需要等待mock 执行完在 请求mock数据
    if (!isDev) await sleep(0);
    const token = sessionStorage.getItem("token");
    if (!token) {
      clearToken();
      return;
    }
    // 请求接口 获得用户信息
    const res = await userApi.getUserInfo().catch(err => {
      console.error("getUserInfo", err);
    });

    if (!res) {
      clearToken();
      return;
    }
    console.log("x initUser res ", res);
    setUserInfo(res);
  }

  function setMenus(menus) {
    console.log("x setMenus menus ", menus);
    for (let item of menus) {
      if (!item.icon) item.icon = "xp-menu1";
    }
    state.menus = menus;
  }
  function setUserInfo(data) {
    state.theme = data.theme || "light";
    state.lang = data.lang || "zh_CN";
    state.userInfo = data;
    changeTheme(state.userInfo.theme);
    changeLang(state.userInfo.lang);
    setMenus(cloneDeep(state.userInfo.menus));
  }
  // 登录
  // 调用登录方法
  async function login({ account, password }) {
    const res = await userApi.login({ account, password });
    if (!res) return;
    setUserInfo(res);

    return res;
  }
  function logout() {
    setUserToken("");
    clearToken();
  }

  function changeLang(rlang) {
    let lang = rlang;
    if (!lang) return;
    if (locale.value === lang) return;
    if (!state.langList.find(r => r.id === lang)) {
      lang = state.langList[0].id;
    }
    // 更新ui 组件库的国际化配置
    state.uiLang = uiI18n[lang];
    locale.value = lang;
    state.lang = lang;

    if (state.userInfo.lang === lang) return;
    state.userInfo.lang = lang;
    userApi.changeLang({ lang });
  }
  function changeTheme(theme) {
    if (!theme) return;
    if (state.userInfo.theme === theme) return;
    state.theme = theme;
    state.userInfo.theme = theme;
    userApi.changeTheme({ theme });
  }

  setLangList([
    { id: "zh_CN", value: "中文" },
    { id: "en_US", value: "English" },
  ]);
  initUser();
  return {
    state,
    login,
    logout,
    changeLang,
    changeTheme,
    setLangList,
    mergeLocaleMessage,
    changeUrlByMenuId,
    deleteMenuTabs,
  };
});
