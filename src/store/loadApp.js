import { defineStore } from "pinia";
import router, { addRoute, push } from "@/router";
import { useI18n } from "vue-i18n"; //引入vue-i18n组件
import { watch, watchEffect } from "vue";
import { debounce } from "lodash-es";
import { addCss } from "@/utils";
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
  const appScript = {};
  console.log("xx loadAppStore init ");
  const { mergeLocaleMessage, locale } = useI18n();
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
      loadByEntryUrl(name, subAppJsUrl);
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
    loadByEntryUrl(name, subAppJsUrl);
  }
  async function loadByEntryUrl(name, url) {
    // 找到入口文件 然后加载
    const subRes = await import(/* @vite-ignore */ url);
    const subApp = await subRes.default();
    appScript[name] = subApp;
    initApp(subApp);
  }
  // 初始化子产品
  function initApp(subApp) {
    // 添加 子产品的 路由， 跳转默认地址
    addRoute(subApp.routes);
    push("");
    // 同步 i18n
    const appI18n = subApp.i18n;
    if (typeof appI18n === "function") {
      const lang = locale.value;
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
  }

  // 国际化语言变化
  watchEffect(() => {
    const lang = locale.value;
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

  const onUrlChange = debounce(() => {
    const appName = getAppNameByUrl();
    console.log(`xxxx onUrlChange [${new Date().getTime()}] urlChange appName `, appName);
    if (!appName) {
      // 默认页
      push("/home");
      return;
    }
    if (["about", "home"].includes(appName)) return;
    loadApp(appName);
  }, 20);
  // watch(() => router.currentRoute.value.fullPath, urlChange);
  // onUrlChange 事件
  window.__OSL.onUrlChange(onUrlChange);
  onUrlChange();
});
