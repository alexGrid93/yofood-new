<script setup lang="ts">
import { Alert } from 'ant-design-vue'
import OnionCatImg from '../assets/onion-cat.png'

const onClose = () => {
  console.log(123)
}
</script>

<template>
  <Alert
    message="Не останешься ли ты голодным на следующей на неделе?"
    description="p.s. Заполни табличкку :)"
    showIcon
    banner
    type="error"
    :closable="{ closeIcon: true, onClose, 'aria-label': 'close' }"
    class="choose-food-alert"
  >
    <template #icon>
      <img :src="OnionCatImg" alt="" data-class="choose-food-alert__img" />
    </template>
  </Alert>
</template>

<style scoped>
.choose-food-alert {
  background-color: #edc9ff;
}

.choose-food-alert :deep(.ant-alert-message) {
  font-size: 20px;
}

.choose-food-alert :deep(.ant-alert-close-icon) {
  font-size: 18px;
}

[data-class='choose-food-alert__img'] {
  width: 80px;
}
</style>
