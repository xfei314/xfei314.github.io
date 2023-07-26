import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import { viteMockServe } from "vite-plugin-mock";
// 将 px 转换为 vw
// import postCssPxToViewport from "postcss-px-to-viewport";
// import { visualizer } from "rollup-plugin-visualizer"; // 代码分析
import xdpui from "xdp/plugins/vite-plugin-xdp-ui.js"; // 按需加载xdp ui
import xdpPortal from "./plugins/vite-plugin-xdp-portal.js"; // 使用xdp 微前端插件
import { name as appName } from "./package.json";

export default defineConfig(({ command, mode }) => {
  console.log("x vite.config.js ", mode, command);
  const env = {
    processEnv: process.env,
    isDev: mode === "development",
    port: 8800,
    appName, // 项目名称
    oslUrl: mode === "https://xfei314.github.io" ? "" : "//localhost:8001", // 在线共享库地址
    oslBase: "/v1/osl", // 共享库 base
    path: mode === "prod" ? "" : "D:\\js\\xdp\\v1\\plf", // portal文件地址可以不设置
  };
  return {
    base: "", // 设置成 "" 必要
    plugins: [
      xdpui(), // 按需加载插件 - 按需加载xdp的组件
      // env.isDev ? null : visualizer({ open: true, brotliSize: true, filename: "report.html" }),
      vue({
        script: {
          defineModel: true,
        },
      }),
      vueJsx(),
      viteMockServe({
        localEnabled: true, // 开发环境
        prodEnabled: true, // 生产环境设为true，也可以根据官方文档格式
        injectCode: ` import { setupProdMockServer } from './mockProdServer'; setupProdMockServer(); `,
        mockPath: "/src/mock",
        supportTs: false, // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
        watchFiles: true, // 监视文件更改
      }),
      xdpPortal(env), // 使用xdp portal插件
    ],
    server: {
      host: "0.0.0.0",
      open: true,
      port: env.port,
      proxy: {
        "/api": {
          target: "http://localhost:8801",
          changeOrigin: true,
        },
        "/app": {
          target: `http:${env.oslUrl}`,
          changeOrigin: true,
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          // postCssPxToViewport({
          //   unitToConvert: "px", // 要转化的单位
          //   viewportWidth: 1600, // UI设计稿的宽度，一般写 320
          //   // 下面的不常用，上面的常用
          //   unitPrecision: 6, // 转换后的精度，即小数点位数
          //   propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          //   viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
          //   fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
          //   selectorBlackList: ["ignore-"], // 指定不转换为视窗单位的类名，
          //   minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          //   mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          //   replace: true, // 是否转换后直接更换属性值
          //   landscape: false, // 是否处理横屏情况
          // }),
        ],
      },
    },
    resolve: {
      alias: {
        "@": resolve("src"),
        "@root": resolve(""),
        "@package": resolve("package.json"),
      },
    },
    build: {
      minify: true, // 不压缩
      modulePreload: { polyfill: false },
    },
  };
});
