import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    name: "xhome",
    path: "/home",
    component: () => import("@/pages/Home.vue"),
  },
  {
    name: "xabout",
    path: "/about",
    component: () => import("@/pages/About.vue"),
  },
  {
    name: "xnopermission",
    path: "/nopermission",
    component: () => import("@/pages/NoPermission.vue"),
  },
];
export const push = url => {
  router.push(url);
};
export const addRoute = rs => {
  for (let item of rs) {
    router.addRoute(item);
  }
};

const router = createRouter({
  history: createWebHashHistory(), // hash路由模式
  // history: createWebHistory(),  // history路由模式
  routes,
});
export default router;
