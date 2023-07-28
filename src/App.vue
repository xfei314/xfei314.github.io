<template>
  <ConfigProvider :locale="state.uiLang">
    <Header class="portal-header" />
    <div class="portal-content">
      <LeftMenu />
      <div class="portal-content-main">
        <MainTabs />
        <div class="portal-app-view">
          <router-view />
        </div>
      </div>
    </div>
    <div class="portal-footer"></div>

    <loginWin v-model="state.showLoginWin" />
  </ConfigProvider>
</template>
<script setup>
import { ConfigProvider } from "xdp";

import Header from "@/components/Header/index.vue";
import LeftMenu from "@/components/LeftMenu/LeftMenu.vue";
import MainTabs from "@/components/MainTabs.vue";
import useSystem from "@/store/system";
import loginWin from "@/components/Login/index.vue";
import useLoadApp from "@/store/loadApp";
const { state } = useSystem();
useLoadApp();
</script>
<style lang="less">
#xdp-portal {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .portal-content {
    flex: 1;
    height: 0;
    width: 100%;
    display: flex;
    flex-direction: row;

    .portal-content-main {
      flex: 1;
      width: 0;

      display: flex;
      flex-direction: column;

      .portal-app-view {
        flex: 1;
        height: 0;
        overflow: auto;
      }
    }
  }
  .portal-footer {
    height: 0;
  }
}
</style>
