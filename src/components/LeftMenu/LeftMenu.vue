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
import router from "@/router";
import { debounce } from "lodash-es";
const { state } = useSystem();

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

const changeOpenKeysByUrl = debounce(() => {
  const keys = [];
  const urls = location.hash.split("/");
  const appName = urls[1];
  const app = state.menus.find(r => r.pid === rootId.value && r.name === appName);
  if (app) {
    keys.push(app.id);
  }
  openKeys.value = keys;
}, 200);
watch(() => router.currentRoute.value.fullPath, changeOpenKeysByUrl);

function changeSelectKeysMenuId(id) {
  if (!id) {
    selectedKeys.value = [""];
    changeOpenKeysByUrl();
    return;
  }
  let item = state.menus?.find(r => r.id === id);
  if (!item) {
    selectedKeys.value = [""];
    changeOpenKeysByUrl();
    return;
  }
  const opens = [item.pid];
  // 最多3级
  if (item.pid !== rootId.value) {
    item = state.menus?.find(r => r.id === item.pid);
    if (item.pid !== rootId.value) {
      opens.push(item.pid);
    }
  }
  console.log("xx selected", id);
  openKeys.value = opens;
  selectedKeys.value = [id];
}
watch(() => state.menuId, changeSelectKeysMenuId);

function onSubClick(id) {
  console.log("onSubClick key", id);
}
function onItemClick(id) {
  // 选中 菜单
  console.log("onItemClick key", id);
  if (id === state.menuId) return;

  state.menuId = id;
}
</script>

<style lang="less" scoped>
.portal-aside {
  border-right: 1px solid var(--color-border-1);
  box-shadow: 4px 6px 8px 0 rgba(0, 0, 0, 0.2);
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
