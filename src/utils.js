import { generate } from "xdp/color";

// 设置 主题 颜色
export function setThemeColor(color, name = "primary") {
  setTheme({
    color,
    name,
    dark: true,
  });
  setTheme({
    color,
    name,
    dark: false,
  });
}
function setTheme({ color, dark, name }) {
  const str = [];
  const idPre = dark ? `__dark` : `__light`;
  const id = `${idPre}_${name}_theme`;
  const themeStyle = document.createElement("style");
  themeStyle.setAttribute("id", id);
  const arr = generate(color, {
    dark,
    list: true,
    // 'hex' | 'rgb' | 'hsl'
    format: "rgb",
  });
  for (let i = 0; i < arr.length; i++) {
    //  rgb(228, 128, 125)
    const item = arr[i];
    const cur = item.replace("rgb(", "").replace(")", "");
    str.push(`--${name}-${i + 1}: ${cur};`);
  }
  const themeCss = dark ? `body[arco-theme='dark']` : "body";
  themeStyle.innerHTML = `${themeCss}{\n ${str.join("\n")} \n}`;
  const el = document.querySelector(`#${id}`);
  if (el) el.parentElement.removeChild(el);

  document.body.appendChild(themeStyle);
}

export function getFileUrl(url) {
  return new URL(`./assets/${url}`, import.meta.url).href;
}
export const isDev = import.meta.env.DEV;
console.log("x isDev:", isDev);

// 24 小时
const time = 60 * 60 * 1000 * 24;
export function setSessionData(key, str) {
  sessionStorage.setItem(key, str, time);
}

export function toFixed(num, digit = 2) {
  // round()、floor()、ceil() 等都不能真正的四舍五入，有精度问题。
  if (typeof digit !== "number") digit = 2;

  if (digit < 0) digit = 0;
  if (digit > 99) digit = 99;
  // round() 可以通过以下方式来确保精度是正确的：   num + Number.EPSILON
  let pow = Math.pow(10, digit);
  return Math.round((num + Number.EPSILON) * pow) / pow;
}
export function sleep(time = 4) {
  return new Promise(reslove => {
    setTimeout(() => {
      reslove();
    }, time);
  });
}

export function addCss(url) {
  return addElToHead(url);
}
export function addJs(url, jsId) {
  return addElToHead(url, jsId);
}

const addElToHead = (url, jsId) => {
  return new Promise((reslove, reject) => {
    let ele = null;
    if (url.indexOf(".js") > 0) {
      ele = document.createElement("script");
      ele.type = "module";
      if (jsId) ele.id = jsId;
    } else if (url.indexOf(".css") > 0) {
      ele = document.createElement("link");
      ele.type = "text/css";
      ele.rel = "stylesheet";
    }
    if (!ele) {
      reject(`url [${url}] type error`);
      return;
    }
    ele.onload = function () {
      ele.onload = null;
      ele.onerror = null;
      reslove("");
    };
    ele.onerror = function () {
      ele.onload = null;
      ele.onerror = null;
      reject(`url:[${url}] loadjs error`);
    };
    if (url.indexOf(".js") > 0) {
      ele.src = url;
    } else {
      ele.href = url;
    }
    document.head.appendChild(ele);
  });
};
