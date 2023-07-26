import NProgress from "nprogress"; // progress bar
import { debounce } from "lodash-es";
// import useSystem from "@/store/system";
import router from "@/router";
NProgress.configure({ showSpinner: false });

export default () => {
  const npStart = debounce(
    () => {
      console.log("x npStart");
      NProgress.start();
    },
    200,
    {
      leading: true,
      trailing: false,
    }
  );
  const npDone = debounce(() => {
    console.log("x npDone");
    NProgress.done();
  }, 200);
  let pageScrollTop = {};
  function setFromPageScrollTop(url) {
    // if (url === "/") return;
    // const dom = document.querySelector(".portal");
    // if (!dom) return;
    // // 记录当前页面位置
    // pageScrollTop[url] = dom.scrollTop;
  }
  function setScrollTop(url) {
    // setTimeout(() => {
    //   const dom = document.querySelector(".portal");
    //   if (!dom) return;
    //   const y = pageScrollTop[url] ?? 0;
    //   dom.scrollTop = y;
    // }, 100);
  }
  router.beforeEach((to, from, next) => {
    npStart();
    console.log("x beforeEach from", from);
    console.log("x beforeEach to ", to);
    // 设置 scrollTop
    setFromPageScrollTop(from.fullPath);
    next();

    // 权限判断
    // const { state, havPermission } = useSystem();
    // // const token = systemState.token;

    // if (to.path === "/login") {
    //   next();
    //   return;
    // }
    // let permission = to.meta.permission ?? "";
    // if (!permission) {
    //   next();
    //   return;
    // }

    // if (havPermission(permission)) {
    //   next();
    // } else {
    //   // 没有权限
    //   next("/nopermission");
    // }
  });
  router.afterEach((to, from) => {
    console.log("x afterEach to", to);
    console.log("x afterEach from", from);
    // if (to.path === "/login") {
    // 	const userStore = getUserStore();
    // 	const permissionStore = getPermissionStore();

    // 	userStore.logout();
    // 	permissionStore.restore();
    // }

    // 设置 scrollTop
    setScrollTop(to.fullPath);
    npDone();
  });
};
