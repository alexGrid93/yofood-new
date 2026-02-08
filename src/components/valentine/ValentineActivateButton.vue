<script setup lang="ts">
const onClickHeart = () => {
  console.log('onClickHeart')
};
</script>

<template>
  <button @click="onClickHeart" type="button" aria-label="Активировать День святого Валентина" class="valentine-activate-button">
    <div class="valentine-activate-button__container">
      <div class="heart heart-1"></div>
      <div class="heart heart-2"></div>
      <div class="heart heart-3"></div>
      <div class="heart heart-4"></div>
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

.heart {
  height: var(--heart-height, 90px); /* adjust to control the size */
  aspect-ratio: 1;
  --_m: radial-gradient(#000 69%,#0000 70%) 84.5%/50%;
  -webkit-mask-box-image: var(--_m);
  mask-border: var(--_m);
  clip-path: polygon(-41% 0,50% 91%, 141% 0);
  background: var(--heart-bg, #cc333f);
}
/* fallback until better support for mask-border */
@supports not (-webkit-mask-box-image: var(--_m)) {
  .heart {
    mask:
      radial-gradient(at 70% 31%,#000 29%,#0000 30%),
      radial-gradient(at 30% 31%,#000 29%,#0000 30%),
      conic-gradient(#000 0 0) bottom/100% 50% no-repeat;
  }
}

.heart-1 {
  --heart-height: 100px;
  --heart-bg: #ec4e5b;
}

.heart-1, .heart-2 {
  transform: rotate(25deg);
}

.heart-2 {
  position: absolute;
  top: 5px;
  left: 5px;
}

.heart-3 {
  --heart-height: 75px;
  --heart-bg: #ec4e5b;

  position: absolute;
  top: 22px;
}

.heart-3, .heart-4 {
  transform: rotate(-25deg);
}

.heart-4 {
  --heart-height: 65px;
  --heart-bg: #cc333f;

  position: absolute;
  top: 26px;
  left: 5px;
}
</style>
