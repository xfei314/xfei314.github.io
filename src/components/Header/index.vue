<template>
  <header class="portal-header" ref="refMain">
    <div class="logo">
      <div class="menu-btn" @click="changeAppMenuVisible">
        <icon :name="data.appMenuVisible ? 'xp-close' : 'xp-menu'" />
      </div>
      <div class="title">
        {{ $t("starter_title") }}
      </div>
    </div>
    <div class="right-box">
      <Dropdown @select="langCommand" :active="lang" :list="systemState.langList">
        <icon name="xp-i18n" />
      </Dropdown>

      <x-theme-button v-model="theme" />

      <Dropdown @select="userCommand" :list="data.userMeunList">
        <x-avatar class="user-avatar">
          <img v-if="userAvatarUrl" :src="userAvatarUrl" alt="" />
          <img v-else :src="dfaUrl" alt="" />
        </x-avatar>
      </Dropdown>
    </div>
    <x-dynamic v-if="data.appMenuVisible" :is="MenuDrawer" :top="data.headerHeight" v-model="data.appMenuVisible" />
  </header>
</template>
<script setup>
import { computed, ref, reactive } from "vue";
import useSystem from "@/store/system";
import Dropdown from "./Dropdown.vue";
import dfaUrl from "@/assets/df-avatar.png";
const MenuDrawer = () => import("./MenuDrawer.vue");

const { state: systemState, logout, changeTheme, changeLang } = useSystem();

const refMain = ref(null);
const data = reactive({
  appMenuVisible: false,
  headerHeight: 0,
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
</script>

<style lang="less">
.portal-header {
  background-color: var(--color-bg-2);
  box-shadow: 0 1px 0 rgb(var(--gray-3));
  z-index: 1;

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

  .dropdown-btn {
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
