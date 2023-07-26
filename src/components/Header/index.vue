<template>
  <div class="portal-header" ref="refMain">
    <div class="logo">
      <div class="menu-btn" @click="changeAppMenuVisible">
        <icon :name="data.appMenuVisible ? 'xp-close' : 'xp-menu'" />
      </div>
      <div class="title">
        {{ $t("starter_title") }}
      </div>
    </div>
    <div class="right-box">
      <x-dropdown @select="menuCommand">
        <span class="x-dropdown-btn"> 跳转菜单 <icon name="xp-arrow_down" /> </span>
        <template #content>
          <x-doption v-for="item in data.meunList" :key="item.id" :value="item.id">
            {{ item.value }}
          </x-doption>
        </template>
      </x-dropdown>
      <x-dropdown v-model:popup-visible="langVisible" @select="langCommand">
        <span class="x-dropdown-btn">
          <icon name="xp-i18n" /> <icon :name="langVisible ? 'xp-arrow_up' : 'xp-arrow_down'" />
        </span>
        <template #content>
          <x-doption v-for="item in systemState.langList" :key="item.id" :value="item.id" :active="item.id === lang">
            {{ item.value }}
          </x-doption>
        </template>
      </x-dropdown>

      <x-theme-button v-model="theme" />

      <x-dropdown @select="userCommand">
        <span class="x-dropdown-btn">
          <x-avatar class="user-avatar">
            <img v-if="userAvatarUrl" :src="userAvatarUrl" alt="" />
            <img v-else :src="dfaUrl" alt="" />
          </x-avatar>
          <icon name="xp-arrow_down" />
        </span>
        <template #content>
          <x-doption v-for="item in data.userMeunList" :key="item.id" :value="item.id" :active="item.id === lang">
            {{ item.value }}
          </x-doption>
        </template>
      </x-dropdown>
    </div>
    <MenuDrawer :top="data.headerHeight" v-model="data.appMenuVisible" />
  </div>
</template>
<script setup>
import MenuDrawer from "./MenuDrawer.vue";
import { computed, ref, reactive } from "vue";
import { push } from "@/router";
import useSystem from "@/store/system";
import dfaUrl from "@/assets/df-avatar.png";
console.log("x dfaUrl", dfaUrl);
const langVisible = ref(false);
const { state: systemState, logout, changeTheme, changeLang } = useSystem();

const refMain = ref(null);
const data = reactive({
  appMenuVisible: false,

  headerHeight: 0,
  menuId: "",
  meunList: [
    { id: 1, link: "/home", value: "portal home" },
    { id: 2, link: "/about", value: "portal about" },
    { id: 11, link: "/xdp-t1", value: "xt1 home" },
    { id: 12, link: "/xdp-t1/about", value: "xt1 about" },
    { id: 21, link: "/xdp-t2", value: "xt2 home" },
    { id: 22, link: "/xdp-t2/about", value: "xt2 about" },
    { id: 31, link: "/xdp-t3", value: "xt3 home" },
    { id: 32, link: "/xdp-t3/about", value: "xt3 about" },
  ],
  userMeunList: [
    {
      id: "logout",
      icon: "x-logout",
      value: "退出",
    },
  ],
});
const theme = computed({
  get: () => {
    return systemState.theme;
  },
  set: val => {
    changeTheme(val);
  },
});
const lang = computed({
  get: () => {
    return systemState.lang;
  },
  set: val => {
    changeLang(val);
  },
});
const userAvatarUrl = computed({
  get: () => {
    return systemState?.userInfo?.avatar ?? "";
  },
});

function changeAppMenuVisible() {
  const visible = data.appMenuVisible;
  if (visible) {
    data.appMenuVisible = false;
    return;
  }
  data.headerHeight = refMain.value.offsetHeight;
  data.appMenuVisible = true;
}
function langCommand(id) {
  if (lang.value === id) return;
  lang.value = id;
}
function userCommand(id) {
  console.log(" userCommand ", id);
  switch (id) {
    case "logout":
      logout();
      break;
  }
}
function menuCommand(id) {
  const item = data.meunList.find(r => r.id === id);
  if (!item) return;

  data.menuId = id;
  push(item.link);
}
</script>

<style lang="less">
.portal-header {
  box-shadow: var(--td-shadow-inset-bottom);

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 46px;
  .right-box {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .logo {
    height: 30px;
    align-items: center;
    display: flex;
    gap: 8px;
    .title {
      font-size: 16px;
    }
    .menu-btn {
      .svg-icon {
        cursor: pointer;
        font-size: 30px;
      }
    }
  }

  .x-dropdown-btn {
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;

    .xp-i18n {
      font-size: 26px;
    }
  }
}
</style>
