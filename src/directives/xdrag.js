const MIN_PX = 5;
import { throttle } from "lodash-es";
const xdragContext = "@@xdragContext";
// const isIE = "ActiveXObject" in window;
/**
 * 移动 < MIN_PX px 的情况就不做操作
 *
 */
export default {
  name: "xdrag",
  mounted: function (el, binding) {
    const style = getComputedStyle(el);
    if (style.position === "static") el.style.position = "relative";

    const dom = document.createElement("div");
    dom.className = "x-drag-ctr";
    dom.style.position = "absolute";
    dom.style.pointerEvents = "all";
    dom.style.cursor = "move";
    dom.style.zIndex = 2;
    dom.style.background = "transparent";
    dom.style.width = `100%`;
    dom.style.height = `100%`;
    dom.style.left = `0px`;
    dom.style.top = `0px`;
    dom.setAttribute("draggable", true);
    const attrs = el.attributes;
    // 设置 data
    for (let i = 0; i < attrs.length; i++) {
      const item = attrs[i];
      const name = item.name;
      if (name.startsWith("data-")) {
        const key = name.substring("data-".length);
        if (!key.startsWith("v-")) {
          dom.setAttribute(`data-${key}`, item.value);
        }
      }
    }

    el.appendChild(dom);
    if (!el[xdragContext]) el[xdragContext] = {};

    el[xdragContext].dragstart = e => {
      const startX = e.pageX;
      const startY = e.pageY;
      el[xdragContext].startX = startX;
      el[xdragContext].startY = startY;
      el[xdragContext].lastX = startX;
      el[xdragContext].lastY = startY;
      el[xdragContext].xdraging = true;
      const pos = {
        startX,
        startY,
      };
      const start = binding.value && binding.value.start;
      start && start(e, pos);
    };

    el[xdragContext].drag = throttle(function (moveEvent) {
      if (!el[xdragContext].xdraging) return;
      const moveX = moveEvent.pageX;
      const moveY = moveEvent.pageY;
      if (Math.abs(moveY - el[xdragContext].lastY) > MIN_PX || Math.abs(moveX - el[xdragContext].lastX) > MIN_PX) {
        el[xdragContext].lastX = moveX;
        el[xdragContext].lastY = moveY;
        const pos = {
          startX: el[xdragContext].startX,
          startY: el[xdragContext].startY,
          moveX,
          moveY,
          width: moveX - el[xdragContext].startX,
          height: moveY - el[xdragContext].startY,
        };
        const move = binding.value && binding.value.move;
        move && move(moveEvent, pos);
      } else {
        // console.log(`xdrag move < ${MIN_PX}`);
      }
    }, 100);

    el[xdragContext].dragend = e => {
      el[xdragContext].xdraging = false;
      const end = binding.value && binding.value.end;
      end && end(e);
    };

    dom.addEventListener("dragstart", el[xdragContext].dragstart);
    dom.addEventListener("drag", el[xdragContext].drag);
    dom.addEventListener("dragend", el[xdragContext].dragend);
    el[xdragContext].dragCtrDom = dom;
  },
  beforeUnmount(el) {
    const dom = el[xdragContext].dragCtrDom;
    dom.removeEventListener("dragstart", el[xdragContext].dragstart);
    dom.removeEventListener("drag", el[xdragContext].drag);
    dom.removeEventListener("dragend", el[xdragContext].dragend);
    el[xdragContext].drag.cancel && el[xdragContext].drag.cancel();

    el.removeChild(el[xdragContext].dragCtrDom);
    delete el[xdragContext];
  },
};
