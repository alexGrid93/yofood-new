<script setup lang="ts">
import doubleHeart from '../../assets/duoble_heart.svg'
import { useStorage } from '@vueuse/core'

const isActivateValentineScreen = useStorage('valentineActivateScreen', false)

const onClickHeart = () => {
  if (isActivateValentineScreen.value) {
    isActivateValentineScreen.value = false
    return
  }
  isActivateValentineScreen.value = true
}
</script>

<template>
  <button
    @click="onClickHeart"
    type="button"
    aria-label="Активировать День святого Валентина"
    class="valentine-activate-button"
  >
    <div class="valentine-activate-button__container">
      <img
        :src="doubleHeart"
        alt=""
        height="80px"
        width="100px"
        class="valentine-activate-button__img"
      />
    </div>
  </button>
</template>

<style scoped>
button {
  padding: 0;
  background-color: hsla(0, 0%, 100%, 0);
  border: none;
}

.valentine-activate-button__container {
  position: relative;
}

.valentine-activate-button__img {
  width: 100px;
  height: 80px;
}
</style>
