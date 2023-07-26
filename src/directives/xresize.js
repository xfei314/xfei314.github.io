import { debounce } from "lodash-es";
const xContext = "@@xresizeContext";
export default {
  name: "xresize",
  mounted: function (el, binding) {
    if (!el[xContext]) el[xContext] = {};
    const rect = el.getBoundingClientRect();
    el[xContext].size = {
      width: rect.width,
      height: rect.height,
    };
    // obj.scrollHeight > obj.clientHeight || obj.offsetHeight > obj.clientHeight
    el[xContext].change = debounce(function () {
      const rect = el.getBoundingClientRect();
      if (el[xContext].size.height !== rect.height || el[xContext].size.width !== rect.width) {
        el[xContext].size = {
          width: rect.width,
          height: rect.height,
        };
        binding.value();
      }
    }, Number(binding.arg) || 50);
    el[xContext].ro = new window.ResizeObserver(el[xContext].change);
    el[xContext].ro.observe(el);
  },
  beforeUnmount(el) {
    el[xContext].ro.disconnect();
    el[xContext].change = null;
    el[xContext].ro = null;
    el[xContext].size = null;
    delete el[xContext];
  },
};
