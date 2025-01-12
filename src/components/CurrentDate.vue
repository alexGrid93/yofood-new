<script lang="ts" setup>
import { getCurrentDateView, now } from '@/utils/constants'
import { TypographyText } from 'ant-design-vue'
</script>

<template>
  <TypographyText className="currentDate">{{
    getCurrentDateView(now, { withWeekday: true })
  }}</TypographyText>
</template>

<style>
.currentDate {
  font-size: 12px;
}
</style>
