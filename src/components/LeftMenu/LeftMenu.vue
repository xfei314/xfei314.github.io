<template>
  <aside class="portal-aside" ref="refMain">
    <x-menu
      :style="{ width: '200px' }"
      show-collapse-button
      :theme="state.theme"
      auto-scroll-into-view
      v-model:collapsed="collapsed"
      v-model:selected-keys="selectedKeys"
      v-model:open-keys="openKeys"
      @menu-item-click="onItemClick"
      @sub-menu-click="onSubClick"
    >
      <MenuTree v-bind="{ id: rootId, rootId: rootId, menus: state.menus }" />
    </x-menu>
  </aside>
</template>
<script setup>
import { ref, watch } from "vue";
import MenuTree from "./MenuTree";
import useSystem from "@/store/system";
import router, { push } from "@/router";
import { debounce } from "lodash-es";
const { state, changeUrlByMenuId } = useSystem();

// 收缩
defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
});
const rootId = ref("0");
const collapsed = ref(false);

const selectedKeys = ref([]);
const openKeys = ref([]);

function getMenuById(id) {
  if (!id) return null;
  return state.menus.find(r => r.show !== false && r.id === id);
}
// set open keys
const setOpenKeys = debounce(() => {
  let item = getMenuById(state.menuId);
  if (item) return;

  // 没有选中的情况下执行
  selectedKeys.value = [""];

  const keys = [];
  const urls = location.hash.split("/");
  const appName = urls[1];
  const app = state.menus.find(r => r.pid === rootId.value && r.name === appName);
  if (app) {
    keys.push(app.id);
  }
  openKeys.value = keys;
}, 200);
// fullPath change
watch(() => router.currentRoute.value.fullPath, setOpenKeys);

function menuIdChange(id) {
  let item = getMenuById(id);
  if (!item) {
    setOpenKeys();
    return;
  }
  // find menu
  push(item.path);

  const opens = [item.pid];
  // 最多3级
  if (item.pid !== rootId.value) {
    item = state.menus?.find(r => r.id === item.pid);
    if (item && item.pid !== rootId.value) {
      opens.push(item.pid);
    }
  }
  openKeys.value = opens;
  selectedKeys.value = [id];
}
// menuId change
watch(() => state.menuId, menuIdChange);

function onSubClick(id) {
  console.log("onSubClick key", id);
}
function onItemClick(id) {
  changeUrlByMenuId(id);
}
</script>

<style lang="less" scoped>
.portal-aside {
  box-shadow: 0px 2px 8px 4px rgb(var(--gray-3));
  z-index: 1;
  :deep(.xdp-menu) {
    height: 100%;
    .xdp-menu-inner {
      height: calc(100% - 40px);
      padding: 4px 6px;
      padding-right: 0;
      overflow: scroll;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        border: 1px solid transparent;
      }
    }
  }
}
</style>
