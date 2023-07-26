import { defineStore } from "pinia";
import router, { addRoute, push } from "@/router";
import { useI18n } from "vue-i18n"; //引入vue-i18n组件
import { watchEffect, watch } from "vue";
import { debounce } from "lodash-es";

function addCss(url) {
  const ele = document.createElement("link");
  ele.type = "text/css";
  ele.rel = "stylesheet";
  ele.href = url;
  document.head.appendChild(ele);
}
function getAppNameByUrl() {
  const arr = location.hash.split("/");
  const appName = arr[1] ?? "";
  if (!appName) return "";
  return appName;
}
let hostMap = {};
function loadHostMap() {
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
    // 加载子产品
    // 已经加载过的app
    if (appScript[name]) return;
    // 加载子产品文件
    let host = hostMap[name] ?? "";
    let entry = "";
    if (host) {
      entry = host;
      // 找到入口文件 然后加载
      let subAppJsUrl = `${host}/src/index.js`;
      const subRes = await import(/* @vite-ignore */ subAppJsUrl);
      const subApp = await subRes.default();
      appScript[name] = subApp;
      initApp(subApp);
    } else {
      // 本地开发
      if (window.__XDP_DEV_TYPE === "app") {
        host = window.__XDP_DEV_SOL_HOST;
      } else {
        host = "";
      }
      entry = `${host}/v3/app/${name}`;

      const res = await fetch(`${entry}/manifest.json?t=${new Date().getTime()}`).catch(error => {
        console.log(`subapp [${name}] not find`, error);
      });
      if (!res) return;
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
      const subRes = await import(/* @vite-ignore */ subAppJsUrl);
      const subApp = await subRes.default();
      appScript[name] = subApp;
      initApp(subApp);
    }
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
    for (let key in appScript) {
      const subApp = appScript[key];
      const appI18n = subApp.i18n;
      if (typeof appI18n === "function") {
        appI18n(lang).then(i18n => {
          mergeLocaleMessage(lang, i18n);
        });
      }
    }
  });

  // 路由变化
  const hashChange = debounce(function () {
    const appName = getAppNameByUrl();
    console.log("x urlChange appName:", appName);
    if (!appName) {
      router.push("/home");
      return;
    }
    if (["about", "home"].includes(appName)) return;
    loadApp(appName);
  }, 20);
  // 监听 路由变化
  watch(
    () => router.currentRoute.value.fullPath,
    url => {
      if (!url) return;
      console.log("x urlChange currentRoute:", url);
      hashChange();
    }
  );
});
