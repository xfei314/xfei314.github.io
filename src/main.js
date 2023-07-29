// import "./__UrlChange";
import { createApp } from "vue";
import { createPinia } from "pinia";
import "./theme";
// import permission from "./permission";
import router from "@/router";
import i18n from "@/i18n";
import App from "@/App.vue";
import registerDirectives from "@/directives";
import { Icon } from "@/components/Icon";
import { addJs } from "./utils";

const app = createApp(App);
registerDirectives(app);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(Icon);
app.mount(document.querySelector("#xdp-portal"));

// permission();

// 动态添加 icon
setTimeout(() => {
  const url = new URL(`/font/iconfont.js?_v=20230713`, import.meta.url).href;
  addJs(url);
}, 200);
