<script setup lang="ts">
import PromoCard from '@/components/promo/PromoCard.vue'
import {promotions} from '@/data/promo/promotions.ts'
</script>

<template>
  <section class="promo-view">
    <PromoCard v-for="(promo, index) in promotions" :key="`promo-${index}-${promo.title}`" :promo="promo" />
  </section>
</template>

<style scoped>
.promo-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
