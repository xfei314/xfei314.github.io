import { defineStore } from "pinia";
import NProgress from "nprogress";
import router, { addRoute, push } from "@/router";
import { watchEffect, watch } from "vue";
import { debounce } from "lodash-es";
import { addCss } from "@/utils";
import useSystem from "@/store/system";
NProgress.configure({ showSpinner: false });

function getAppNameByUrl() {
  const arr = location.hash.split("/");
  const appName = arr[1] ?? "";
  if (!appName) return "";
  return appName;
}
// 记录 app 的 host
let hostMap = {
  // t1: "/v1/app/t1",
  // t2: "t2",
};
function loadHostMap() {
  // 调试用
  try {
    let str = localStorage.getItem("hostMap");
    if (str) {
      hostMap = JSON.parse(str);
    }
  } catch (error) {}
}
loadHostMap();

export default defineStore("loadAppStore", () => {
  const { state, mergeLocaleMessage, urlChage } = useSystem();
  const appScript = {};
  console.log("xx loadAppStore init ");

  /**
   * 加载子产品
   * @param {子产品名称} name
   * @returns
   */
  async function loadApp(name) {
    console.log(`xx loadApp [${new Date().getTime()}]:`, name);
    // 加载子产品
    // 已经加载过的app
    if (appScript[name]) return;
    // 加载子产品文件
    const dfHost = hostMap["df"] ?? "/v1";
    let host = hostMap[name] ?? dfHost;
    // app 本地调试
    if (window.__XDP_DEV_TYPE === "app") {
      // 找到入口文件 然后加载
      let subAppJsUrl = `${host}/src/index.js`;
      await loadByEntryUrl(name, subAppJsUrl);
      return;
    }
    // 获得app 的配置信息 manifest.json
    let entry = `${host}/${name}`;
    const res = await fetch(`${entry}/manifest.json?t=${new Date().getTime()}`).catch(error => {
      console.log(`subapp [${name}] not find`, error);
    });
    if (!res?.ok) return;
    console.log("x fetch entry ", res);
    const manifest = await res.json();
    console.log("x fetch manifest ", manifest);
    let subEntry = null;
    for (const key in manifest) {
      const item = manifest[key];
      if (item.isEntry) {
        subEntry = item;
        break;
      }
    }
    if (!subEntry) return;
    const subAppJsUrl = `${entry}/${subEntry.file}`;
    if (subEntry.css) {
      for (const css of subEntry.css) {
        const cssUrl = `${entry}/${css}`;
        addCss(cssUrl);
      }
    }
    // 找到入口文件 然后加载
    await loadByEntryUrl(name, subAppJsUrl);
    return;
  }
  async function loadByEntryUrl(name, url) {
    // 找到入口文件 然后加载
    const subRes = await import(/* @vite-ignore */ url);
    const subApp = await subRes.default();
    appScript[name] = subApp;
    return initApp(subApp);
  }
  // 初始化子产品
  async function initApp(subApp) {
    // 添加 子产品的 路由， 跳转默认地址
    addRoute(subApp.routes);
    push("");
    // 同步 i18n
    const appI18n = subApp.i18n;
    if (typeof appI18n === "function") {
      const lang = state.lang;
      if (lang) {
        appI18n(lang).then(i18n => {
          mergeLocaleMessage(lang, i18n);
        });
      }
    } else {
      for (let lang in appI18n) {
        mergeLocaleMessage(lang, appI18n[lang]);
      }
    }
    return;
  }

  // 国际化语言变化
  watchEffect(() => {
    const lang = state.lang;
    if (!lang) return;
    // 刷新各个子产品的语言
    for (const name in appScript) {
      const subApp = appScript[name];
      const appI18n = subApp.i18n;
      if (typeof appI18n === "function") {
        appI18n(lang).then(i18n => {
          mergeLocaleMessage(lang, i18n);
        });
      }
    }
  });

  const npDone = debounce(() => {
    NProgress.done();
  }, 50);
  const npStart = ({ to, from }) => {
    if (from.fullPath !== to.fullPath) {
      NProgress.start();
    }
  };
  // url 修改
  router.beforeEach((to, from, next) => {
    npStart({ to, from });
    next();
  });

  const onUrlChange = debounce(() => {
    urlChage();
    const appName = getAppNameByUrl();
    if (!appName) {
      // 默认页
      push("/home");
      npDone();

      return;
    }
    if (["about", "home"].includes(appName)) {
      npDone();
      return;
    }
    loadApp(appName).then(() => {
      npDone();
    });
  }, 20);
  watch(() => router.currentRoute.value.fullPath, onUrlChange);
});
