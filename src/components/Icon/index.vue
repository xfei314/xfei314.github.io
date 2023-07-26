<template>
  <svg :class="['svg-icon', name]" aria-hidden="true">
    <use :xlink:href="`#${name}`"></use>
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: "",
  },
});
</script>
