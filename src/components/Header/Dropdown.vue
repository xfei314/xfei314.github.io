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
