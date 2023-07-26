<template>
  <div class="portal-aside" ref="refMain">
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
  </div>
</template>
<script setup>
import { ref, watchPostEffect } from "vue";
import MenuTree from "./MenuTree";
import useSystem from "@/store/system";

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

watchPostEffect(() => {
  let id = state.menuId;
  if (!id) return;
  let item = state.menus?.find(r => r.id === id);
  if (!item) return;
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
});
// const handleSelect = id => {
//   console.log("handleSelect key", id);
//   changeMenuById(id);
// };
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
