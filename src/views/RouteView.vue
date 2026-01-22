<script setup lang="ts">
import DeliveryCheckPage from '@/views/DeliveryCheckPage.vue'
import MainPage from '@/views/MainPage.vue'
</script>

<template>
  <template v-if="$route.query.mode === 'delivery'">
    <DeliveryCheckPage />
  </template>

  <template v-else>
    <MainPage />
  </template>
</template>

<style scoped></style>
