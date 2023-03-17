<template>
  <router-view />
</template>

<script setup lang="ts">
import { useGeoStore } from './stores/geo';
useGeoStore()
</script>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
