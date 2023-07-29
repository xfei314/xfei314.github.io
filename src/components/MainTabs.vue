<template>
  <div class="main-tabs">
    <x-tabs
      type="card"
      hide-content
      v-model:active-key="state.menuTabId"
      :editable="true"
      @delete="onDelete"
      @tab-click="onTabClick"
      auto-switch
      v-if="state.menuTabs.length > 0"
    >
      <x-tab-pane v-for="item in state.menuTabs" :key="item.id" :closable="item.name !== 'home'">
        <template #title>
          <icon v-if="item.icon" :name="item.icon" />
          {{ item.title }}
        </template>
      </x-tab-pane>
    </x-tabs>
  </div>
</template>
<script setup>
import { push } from "@/router";
import useSystem from "@/store/system";
const { state, deleteMenuTabs } = useSystem();

function onDelete(id) {
  console.log("x onDelete ", id);
  deleteMenuTabs(id);
}
function onTabClick(id) {
  console.log("x onTabClick ", id);
  let item = state.menuTabs.find(r => r.id === id);
  push(item.fullPath);
}
// const onDragend = ({ currentIndex, current, targetIndex, target }) => {
//   [data.routerList[currentIndex], data.routerList[targetIndex]] = [
//     data.routerList[targetIndex],
//     data.routerList[currentIndex],
//   ];
// };
</script>

<style lang="less">
.main-tabs {
  // padding: 0 12px;
}
</style>
