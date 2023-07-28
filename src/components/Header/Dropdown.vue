<template>
  <x-dropdown v-model:popup-visible="ddVisible" @select="selectFn">
    <span class="dropdown-btn"> <slot /> <icon :name="ddVisible ? 'xp-arrow_up' : 'xp-arrow_down'" /> </span>
    <template #content>
      <x-doption v-for="item in list" :key="item.id" :value="item.id" :active="item.id === active">
        {{ item.value }}
      </x-doption>
    </template>
  </x-dropdown>
</template>
<script setup>
import { ref } from "vue";
defineProps({
  active: {
    type: String,
    default: "",
  },
  list: {
    type: Array,
    default: () => [],
  },
});
const ddVisible = ref(false);
const emit = defineEmits(["select"]);
function selectFn(key) {
  emit("select", key);
}
</script>

<style lang="less">
.portal-header {
  border-bottom: 1px solid var(--color-border-1);
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
