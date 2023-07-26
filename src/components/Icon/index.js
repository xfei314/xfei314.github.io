import comp from "./index.vue";

const Icon = Object.assign(comp, {
  install: app => {
    app.component("icon", comp);
  },
});
export { Icon };
