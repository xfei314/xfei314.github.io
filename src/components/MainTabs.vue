<template>
  <div class="main-tabs">
    <x-tabs v-model:active-key="data.curTab">
      <x-tab-pane v-for="item in data.routerList" :key="item.id" :value="item.id">
        <template #label>
          <span :class="['x-icon', item.icon ?? '']"></span>
          {{ item.title }}
        </template>
      </x-tab-pane>
    </x-tabs>
  </div>
</template>
<script setup>
import { reactive, watch, ref } from "vue";
import router, { push } from "@/router";
import { debounce } from "lodash-es";
const data = reactive({
  curTab: "k1",
  routerList: [
    { id: "k1", title: "home", path: "", icon: "" },
    { id: "k2", title: "home", path: "" },
    { id: "k3", title: "home", path: "" },
    { id: "k4", title: "home", path: "" },
  ],
});

const routeChange = debounce(function () {
  const currentRoute = router.currentRoute.value;
  console.log("currentRoute", currentRoute);
}, 100);
// 监听 路由变化
watch(
  () => router.currentRoute.value.fullPath,
  url => {
    if (!url) return;
    routeChange();
  }
);
const onDragend = ({ currentIndex, current, targetIndex, target }) => {
  [data.routerList[currentIndex], data.routerList[targetIndex]] = [
    data.routerList[targetIndex],
    data.routerList[currentIndex],
  ];
};
</script>

<style lang="less">
.main-tabs {
  padding: 0 12px;
}
</style>
