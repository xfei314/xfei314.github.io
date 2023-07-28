import { resolve } from "path";
import fs from "fs";
import axios from "axios";

function copyDir(src, dst) {
  if (fs.existsSync(src)) {
    if (fs.statSync(src).isDirectory()) {
      if (!fs.existsSync(dst)) {
        fs.mkdirSync(dst);
      }
    }
    const files = fs.readdirSync(src);
    for (const file of files) {
      const _src = resolve(src, file);
      const _dst = resolve(dst, file);
      const st = fs.statSync(_src);
      if (st.isFile()) {
        //   file
        const readable = fs.createReadStream(_src); // 创建读取流
        const writable = fs.createWriteStream(_dst); // 创建写入流
        readable.pipe(writable);
      } else if (st.isDirectory()) {
        // recurse
        copyDir(_src, _dst);
      }
    }
  }
}
function deleteDir(path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteDir(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
// portal 开发环境
export default ({ path: webDir, oslUrl, oslBase, isDev }) => {
  const PLUGIN_NAME = "vite-plugin-xdp-portal";
  let oslManifest = {};
  let moduleMap = {}; // 公共依赖
  let oslVueName = "";
  let oslJsUrl = "";
  let oslCssUrl = "";
  let oslCsslink = "";

  function getImportStr(code, name) {
    let curImportStr = `import"${name}";`;
    let index = code.lastIndexOf(curImportStr);
    if (index > -1) {
      return { str: curImportStr, src: "", awaitName: name };
    }
    curImportStr = `import "${name}";`;
    index = code.lastIndexOf(curImportStr);
    if (index > -1) {
      return { str: curImportStr, src: "", awaitName: name };
    }
    curImportStr = `import("${name}")`;
    index = code.lastIndexOf(curImportStr);
    if (index > -1) {
      return { str: curImportStr, src: `window.__OSL.import("${name}")` };
    }
    let endFromStr = "";
    let curFromStr = `from"${name}"`;
    endFromStr = `from"`;
    index = code.lastIndexOf(curFromStr);
    if (index === -1) {
      curFromStr = `from "${name}"`;
      endFromStr = `from "`;
      index = code.lastIndexOf(curFromStr);

      if (index === -1) {
        curFromStr = `from '${name}'`;
        endFromStr = `from '`;
        index = code.lastIndexOf(curFromStr);
        if (index === -1) return null;
      }
    }
    let newStr = code.substring(0, index);

    let importIndex = newStr.lastIndexOf(`import`);
    let importEndIndex = code.indexOf(endFromStr, importIndex);
    let pStr = code.substring(importIndex + "import".length, importEndIndex);
    let str = code.substring(importIndex, index + curFromStr.length);
    let src = [];
    const mod = `window.__OSL.getModule("${name}");`;
    if (str.indexOf("{") > -1) {
      pStr = pStr.replace(/ as /g, ":");
      src.push(`const ${pStr} = ${mod}`);
    } else {
      src.push(`const ${pStr.trim()} = ${mod}`);
    }
    return { str, src: src.join(""), awaitName: name };
  }
  function transform(code, id) {
    let src = code;
    let importList = [];
    let awaitImportList = [];
    let awaitSet = new Set();
    for (let name in moduleMap) {
      // eslint-disable-next-line
      while (true) {
        let cur = getImportStr(src, name);
        if (!cur) break;
        importList.push(cur.src);
        src = src.replace(cur.str, "");
        if (cur.awaitName) {
          awaitSet.add(cur.awaitName);
        }
      }
    }
    // `window.__OSL.import("${name}");`
    for (const name of awaitSet) {
      // import group
      awaitImportList.push(`window.__OSL.import("${name}")`);
    }
    // await Promise.all([,])
    let importStr = "";
    if (awaitImportList.length) {
      importStr = `await Promise.all([${awaitImportList.join(",")}]);`;
    }

    if (importList.length) {
      importStr += importList.join("");
    }
    return importStr + src;
  }
  return {
    name: PLUGIN_NAME, // 名称用于警告和错误展示
    config(config) {
      if (!isDev) {
        if (!config.build) config.build = {};
        const build = config.build;
        // const external = ["vue", "vue-i18n", "axios", "vue-router", "pinia", "echarts", /^(xdp\/ui|dayjs)/i];
        const external = ["vue"];
        const format = "es"; // can be one of "amd", "cjs", "system", "es", "iife" or "umd".
        config.build = {
          ...build,
          manifest: true,
          target: "es2022",
          rollupOptions: {
            preserveEntrySignatures: "allow-extension",
            external,
            output: {
              format,
            },
          },
        };
      }
      return config;
    },
    async buildStart(options) {
      const url = `${oslUrl}${oslBase}/manifest.json`;
      console.log("x buildStart url: ", url);
      const res = await axios.get(url);
      oslManifest = res.data;
      moduleMap = oslManifest.moduleMap;
      oslVueName = moduleMap.vue;
      const oslUrlPre = isDev ? `${oslUrl}${oslBase}/` : `${oslBase}/`;
      for (const key in oslManifest) {
        const item = oslManifest[key];
        // 入口文件
        if (item.isEntry) {
          oslJsUrl = `${oslUrlPre}${item.file}`;
        }
        // css
        if (key === "style.css") {
          // css 文件
          oslCssUrl = `${oslUrlPre}${item.file}`;
          oslCsslink = `<link rel="stylesheet" href="${oslCssUrl}" />`;
        }
      }

      return options;
    },
    resolveId(source) {
      if (["@oslJsUrl", "/@dev"].includes(source)) {
        return source; // 返回source表明命中，vite不再询问其他插件处理该id请求
      }
      return null; // 返回null表明是其他id要继续处理
    },
    load(id) {
      if (id === "@oslJsUrl") {
        return `export default "${oslJsUrl}"`;
      } else if (id === "/@dev") {
        // 本地 devimp 调试
        return `import * as Vue from "vue"; window.${oslVueName} = Vue;await import(/* @vite-ignore */ "${oslJsUrl}");import("/src/main.js");`;
      }
      return null;
    },
    transformIndexHtml(html) {
      const begin = html.lastIndexOf(`<script type="module"`);
      let entryScript = html.substring(begin);
      const lastStr = "</script>";
      entryScript = entryScript.substring(0, entryScript.indexOf(lastStr) + lastStr.length);
      const oslJsScript = `<script>window.__oslCssUrl="${oslCssUrl}"; </script><script type="module" src="${oslJsUrl}" ></script>`;

      let importAppJS = `${entryScript}`;
      if (isDev) {
        importAppJS = `<script type="module" src="@dev"></script>`;
        html = html.replace(entryScript, importAppJS);
        html = html.replace("</head>", oslCsslink + "</head>");
      } else {
        importAppJS = `${oslJsScript}${entryScript}`;
        html = html.replace(entryScript, "");
        html = html.replace("</body>", oslCsslink + importAppJS + "</body>");
      }

      if (!isDev) {
        html = html.replace(/\n/g, "").replace(/>(\s*)</g, "><");
        html = html.replace("crossorigin", "");
      }
      return html;
    },
    transform(code, id) {
      if (id.includes("/node_modules/")) return code;
      // js，jsx,vue  文件需要转换引入公共模块的配置
      const needTsf = id.endsWith(".js") || id.endsWith(".vue") || id.endsWith(".jsx");
      if (!needTsf) return code;
      return transform(code, id);
    },
    closeBundle() {
      function readFile(fpath) {
        return fs.readFileSync(fpath, "utf-8");
      }
      function getManifest(mpath) {
        const str = readFile(resolve(mpath, "manifest.json"));
        return JSON.parse(str);
      }

      // 编译结束，文件写完后
      try {
        const distPath = resolve("dist");
        const manifest = getManifest(distPath);
        for (let nn in manifest) {
          let item = manifest[nn];
          const { file: filePath } = item;
          if (filePath && filePath.endsWith(".js")) {
            const jsPath = resolve(distPath, filePath);
            let jsStr = fs.readFileSync(jsPath, "utf-8");
            // import "vue";
            jsStr = jsStr.replace(`import "vue";`, "").replace(`import"vue";`, "");
            let iStr1 = `}from"vue";`;
            let iStr2 = `import{`;
            let i1 = jsStr.indexOf(iStr1);
            let i2 = -1;
            if (i1 < 0) {
              iStr1 = `} from "vue";`;
              iStr2 = `import {`;
              i1 = jsStr.indexOf(iStr1);
              if (i1 > 0) {
                i2 = jsStr.substring(0, i1).lastIndexOf(iStr2);
              }
            } else {
              i2 = jsStr.substring(0, i1).lastIndexOf(iStr2);
            }
            if (i1 > 0) {
              i2 = jsStr.substring(0, i1).lastIndexOf(iStr2);
              const imps = jsStr.substring(i2, i1 + iStr1.length);
              // const {createCommentVNode : pe,useSlots : Gr } = "vue"
              const newImps = imps
                .replace(/ as /g, ":")
                .replace(iStr2, "const{")
                .replace(iStr1, `}=__OSL.getModule("vue");`);
              jsStr = jsStr.replace(imps, newImps);
            }

            fs.writeFileSync(jsPath, jsStr);
          }
        }

        // 复制文件
        if (webDir) {
          deleteDir(webDir);
          copyDir(distPath, webDir);
        }
      } catch (error) {
        console.error("closeBundle error", error);
      }
    },
  };
};
