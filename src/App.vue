<template>
  <x-config-provider :locale="state.uiLang">
    <Header class="portal-header" />
    <main class="portal-content-main">
      <LeftMenu />
      <div class="portal-content">
        <MainTabs />
        <main class="app-view">
          <router-view />
        </main>
      </div>
    </main>
    <footer class="portal-footer"></footer>
    <x-dynamic :is="loginWin" v-if="state.showLoginWin" v-model="state.showLoginWin" />
  </x-config-provider>
</template>
<script setup>
import Header from "@/components/Header/index.vue";
import LeftMenu from "@/components/LeftMenu/LeftMenu.vue";
import MainTabs from "@/components/MainTabs.vue";
import useSystem from "@/store/system";
import useLoadApp from "@/store/loadApp";
const { state } = useSystem();
useLoadApp();

const loginWin = () => import("@/components/Login/index.vue");
</script>
<style lang="less">
body {
  background-color: var(--color-bg-1);
  color: var(--color-text-1);
}
#xdp-portal {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .portal-content-main {
    flex: 1;
    height: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    padding-top: 2px;

    .portal-content {
      flex: 1;
      width: 0;
      display: flex;
      flex-direction: column;

      .app-view {
        flex: 1;
        height: 0;
        padding: 0 12px;
        overflow-y: scroll;
        overflow-x: hidden;
        padding-right: 0;
        border: 1px solid var(--color-neutral-3);
        border-top: none;
      }
    }
  }
  .portal-footer {
    height: 0;
  }
}
</style>
