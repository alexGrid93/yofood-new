<script setup lang="ts">
import doubleHeart from '../../assets/duoble_heart.svg'
import { useStorage } from '@vueuse/core'

const isActivateValentineScreen = useStorage('valentineActivateScreen', false)
const isValentineWasUsed = useStorage('valentineWasUsed', false)

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
    :class="{'valentine-activate-button--first-activation': !isValentineWasUsed && !isActivateValentineScreen}"
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

.valentine-activate-button--first-activation .valentine-activate-button__img {
  animation: heartPulse 1.4s infinite ease-in-out;
}

.valentine-activate-button__container {
  position: relative;
}

.valentine-activate-button__img {
  width: 100px;
  height: 80px;
}

@keyframes heartPulse {
  0% {
    transform: scale(1);
  }

  10% {
    transform: scale(1.06);
  }
  18% {
    transform: scale(1);
  }

  28% {
    transform: scale(1.09);
  }
  38% {
    transform: scale(1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
