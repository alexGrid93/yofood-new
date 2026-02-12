<script setup lang="ts">
import { computed, markRaw, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import heartA from '../../assets/heart_a.svg'
import heartB from '../../assets/heart_b.svg'
import HeartIcoA from './HeartIcoA.vue'
import HeartIcoB from './HeartIcoB.vue'
import { useStorage } from '@vueuse/core'
import { valentines } from '@/constants/valentines.ts'

const isActivateValentineScreen = useStorage('valentineActivateScreen', false)
const isValentineWasUsed = useStorage('valentineWasUsed', false)

type Particle = {
  id: number
  src: string
  variant: keyof typeof SETTINGS.componentVariants
  x: number
  y: number // расстояние от низа, растёт вверх
  size: number
  speed: number
  swayAmp: number
  phase: number
  phaseSpeed: number
  rot: number
  rotSpeed: number
  opacity: number
  bornAt: number
}

//
// ✅ ВСЕ НАСТРОЙКИ ТУТ
//
const SETTINGS = {
  // твои 2 картинки
  images: [heartA, heartB],
  componentVariants: {
    A: markRaw(HeartIcoA),
    B: markRaw(HeartIcoB),
  },

  // как часто появляются (мс)
  spawnEveryMs: 400,

  // лимит частиц, чтобы не раздувать DOM
  maxParticles: 25,

  // размеры (px)
  sizeMin: 36,
  sizeMax: 76,

  // скорость всплытия (px per frame * multiplier)
  speedMin: 0.6,
  speedMax: 1.4,
  speedMultiplier: 2.2,

  // покачивание по X
  swayAmpMin: 6,
  swayAmpMax: 18,
  phaseSpeedMin: 0.008,
  phaseSpeedMax: 0.02,

  // вращение
  rotSpeedMin: -0.6,
  rotSpeedMax: 0.6,

  // плавное появление
  fadeInMs: 700,

  // запас, чтобы удалять после ухода за верх
  topPaddingRemove: 100,

  // если true — отключаем при prefers-reduced-motion
  pauseOnReducedMotion: true,
} as const

const isSpawningEnabled = ref(true)

const rootEl = ref<HTMLElement | null>(null)
const particles = shallowRef<Particle[]>([])

type Focused = {
  id: number
  src: string
  variant: keyof typeof SETTINGS.componentVariants
  startLeft: number
  startTop: number
  startW: number
  startH: number
  active: boolean
}

const focused = ref<Focused | null>(null)
const focusReady = ref(false) // ✅ кнопка появится только когда true

let raf = 0
let timer: number | null = null
let idSeq = 1

const reducedMotion = ref(false)

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function pickImage() {
  const arr = SETTINGS.images
  return arr[Math.floor(Math.random() * arr.length)] || ''
}

function pickVariant(): keyof typeof SETTINGS.componentVariants {
  const keys = Object.keys(SETTINGS.componentVariants) as Array<keyof typeof SETTINGS.componentVariants>
  return keys[Math.floor(Math.random() * keys.length)] ?? 'A'
}

const canRun = computed(() => {
  if (!SETTINGS.pauseOnReducedMotion) return true
  return !reducedMotion.value
})

function updateReducedMotion() {
  if (!window.matchMedia) return
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function spawn() {
  if (!isSpawningEnabled.value) return
  if (!canRun.value) return
  if (!rootEl.value) return
  if (!SETTINGS.images.length) return
  if (particles.value.length >= SETTINGS.maxParticles) return

  const rect = rootEl.value.getBoundingClientRect()
  const w = rect.width
  const size = rand(SETTINGS.sizeMin, SETTINGS.sizeMax)
  const x = rand(0, Math.max(0, w - size))

  const p: Particle = {
    id: idSeq++,
    src: pickImage(),
    variant: pickVariant(),
    x,
    y: -size - rand(0, 40), // старт чуть ниже низа
    size,
    speed: rand(SETTINGS.speedMin, SETTINGS.speedMax),
    swayAmp: rand(SETTINGS.swayAmpMin, SETTINGS.swayAmpMax),
    phase: rand(0, Math.PI * 2),
    phaseSpeed: rand(SETTINGS.phaseSpeedMin, SETTINGS.phaseSpeedMax),
    rot: rand(0, 360),
    rotSpeed: rand(SETTINGS.rotSpeedMin, SETTINGS.rotSpeedMax),
    opacity: 0,
    bornAt: performance.now(),
  }

  particles.value.push(p)
}

function tick() {
  const now = performance.now()
  const h = rootEl.value?.getBoundingClientRect().height ?? window.innerHeight

  const next: Particle[] = []
  for (const p of particles.value) {
    const age = now - p.bornAt
    p.opacity = Math.min(1, age / SETTINGS.fadeInMs)

    p.y += p.speed * SETTINGS.speedMultiplier
    p.phase += p.phaseSpeed
    p.rot += p.rotSpeed

    // y — "сколько улетела вверх от низа".
    // Когда y становится больше высоты контейнера — элемент ушёл за верх.
    if (p.y <= h + p.size + SETTINGS.topPaddingRemove) {
      next.push(p)
    }
  }

  particles.value = next
  raf = requestAnimationFrame(tick)
}

function start() {
  stop()
  if (!canRun.value) return

  // стартовые частички, чтобы сразу было красиво
  spawn()
  spawn()

  timer = window.setInterval(spawn, SETTINGS.spawnEveryMs)
  raf = requestAnimationFrame(tick)
}

function stop() {
  if (timer != null) {
    clearInterval(timer)
    timer = null
  }
  if (raf) {
    cancelAnimationFrame(raf)
    raf = 0
  }
  particles.value = []
}

function particleStyle(p: Particle) {
  const sway = Math.sin(p.phase) * p.swayAmp
  const translateY = -p.y // вверх = отрицательное смещение

  return {
    fontSize: `${p.size}px`,
    left: `${p.x}px`,
    opacity: String(p.opacity),
    transform: `translate(${sway}px, ${translateY}px) rotate(${p.rot}deg)`,
  } as Record<string, string>
}

onMounted(() => {
  updateReducedMotion()
  const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  mq?.addEventListener?.('change', updateReducedMotion)

  start()

  // чтобы на ресайз корректно работало — можно просто продолжать,
  // а новые частицы будут спавниться уже по новой ширине
  const onResize = () => {}
  window.addEventListener('resize', onResize)

  onBeforeUnmount(() => {
    stop()
    mq?.removeEventListener?.('change', updateReducedMotion)
    window.removeEventListener('resize', onResize)
  })
})

onBeforeUnmount(() => {
  stop()
})

const onClose = () => {
  isActivateValentineScreen.value = false
}

function onParticleClick(p: Particle, ev: MouseEvent) {
  if (focused.value) return

  // 1) стопаем новые
  isSpawningEnabled.value = false

  // 2) сбрасываем готовность кнопки
  focusReady.value = false

  // 3) берём позицию кликнутой картинки
  const imgEl = ev.currentTarget as HTMLElement
  const r = imgEl.getBoundingClientRect()

  focused.value = {
    id: p.id,
    src: p.src,
    variant: p.variant,
    startLeft: r.left,
    startTop: r.top,
    startW: r.width,
    startH: r.height,
    active: false,
  }

  // 4) убираем частицу из общего слоя (она "переехала" в overlay)
  particles.value = particles.value.filter((x) => x.id !== p.id)

  // 5) запускаем transition
  requestAnimationFrame(() => {
    if (focused.value) focused.value.active = true
  })
}

const focusTargetSize = computed(() => {
  if (!focused.value) return 0

  const padX = -50     // поля по бокам
  const padY = 0    // поля сверху/снизу + место под кнопки/текст

  const maxW = window.innerWidth - padX * 2
  const maxH = window.innerHeight - padY * 2

  // т.к. иконка квадратная 1em x 1em
  return Math.floor(Math.min(maxW, maxH))
})

const focusTransform = computed(() => {
  if (!focused.value) return 'translate3d(0px,0px,0)'

  const f = focused.value
  const target = focusTargetSize.value || f.startW

  // хотим, чтобы фокус-элемент стоял по центру экранa
  const endLeft = window.innerWidth / 2 - target / 2
  const endTop = window.innerHeight / 2 - target / 2

  const dx = endLeft - f.startLeft
  const dy = endTop - f.startTop - 20

  return f.active ? `translate3d(${dx}px, ${dy}px, 0)` : 'translate3d(0px,0px,0)'
})

const isShowOpenButton = ref(false)

function onOpenClick() {
  isShowOpenButton.value = false

  isValentineWasUsed.value = true
}

function onChooseAgain() {
  focusReady.value = false
  focused.value = null
  isSpawningEnabled.value = true
  isShowOpenButton.value = false
}

const valentineText = computed<string>(() => {
  if (!focused.value) {
    return 'Будь собой! Ты чудо!'
  }

  if (focused.value?.id > valentines.length) {
    return valentines[(focused.value.id % valentines.length) - 1]
  }

  return valentines[focused.value?.id - 1]
})

function onFocusTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'transform') return
  focusReady.value = true
  isShowOpenButton.value = true
}
</script>

<template>
  <div ref="rootEl" class="valentine-activate-screen" aria-hidden="true">
    <button @click="onClose" class="valentine-activate-screen__close">Закрыть</button>

    <h3
      :class="{ 'valentine-activate-screen__hint--hide': focused }"
      class="valentine-activate-screen__hint"
    >
      Выбери свою валентинку
    </h3>

    <!-- слой частиц -->
    <div class="valentine-layer">
      <Component
        v-for="p in particles"
        :key="p.id"
        :is="SETTINGS.componentVariants[p.variant]"
        @click.stop="onParticleClick(p, $event)"
        :style="particleStyle(p)"
        class="valentine-item"
      />
    </div>

    <div
      v-if="focused"
      class="focus-card"
      :style="{
        left: focused.startLeft + 'px',
        top: focused.startTop + 'px',
        fontSize: (focused.active ? focusTargetSize : focused.startW) + 'px',  // ✅ вместо width/height
        transform: focusTransform,
      }"
      @transitionend="onFocusTransitionEnd"
    >
      <Component :is="SETTINGS.componentVariants[focused.variant]" class="focus-img" />
    </div>

    <button
      v-if="focusReady && isShowOpenButton"
      class="focus-btn focus-btn--open"
      @click.stop="onOpenClick"
    >
      Открыть
    </button>

    <button v-if="focusReady" class="focus-btn focus-btn--again" @click.stop="onChooseAgain">
      Выбрать еще
    </button>

    <p v-if="focusReady && focused" class="valentine-text">
      {{ valentineText }}
    </p>
  </div>
</template>

<style scoped>
.valentine-activate-screen {
  --v-t: 46%;
  --v-w: 92%;
  --v-h: 15%;

  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1000;
  background-color: hsla(357, 100%, 86%, 0.58);
  backdrop-filter: blur(6px);
}

.valentine-activate-screen__close {
  background-color: transparent;
  border: 2px solid hsl(0, 0%, 0%);
  padding: 8px 12px;

  text-decoration: underline;
  color: hsl(0, 0%, 0%);
  font-size: 14px;
  font-weight: 700;

  box-shadow: 0px 0px 20px 4px rgba(0, 0, 0, 0.22);

  border-radius: 4px;

  position: absolute;
  top: 2px;
  right: 2px;
}

.valentine-activate-screen__hint {
  position: absolute;
  top: 70px;
  width: 100%;
  text-align: center;
  margin: 0;

  font-family: 'Great Vibes', serif;
  font-size: 50px;
  color: #414042;
  font-weight: 700;

  opacity: 1;

  transition: opacity 300ms ease-out;
}

.valentine-activate-screen__hint--hide {
  opacity: 0;
}

.valentine-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.valentine-item {
  position: absolute;
  bottom: 0; /* точка отсчета снизу */
  will-change: transform, opacity;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.12));

  display: inline-block; /* ✅ важно для em */
  line-height: 1;

  pointer-events: auto;
}

.focus-card {
  position: fixed;
  display: grid;
  place-items: center;
  will-change: transform;
  transform-origin: center center; /* ✅ важно для правильного увеличения */

  transition:
    transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1),
    font-size 520ms cubic-bezier(0.2, 0.9, 0.2, 1); /* ✅ добавили fz */
  line-height: 1; /* ✅ */
}

.focus-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.22));
}

.valentine-text,
.focus-btn {
  position: absolute;
  left: 50%;
}

.valentine-text,
.focus-btn.focus-btn--open {
  position: absolute;
  left: 50%;
  top: var(--v-t);
  transform: translate(-50%, -50%);
  width: var(--v-w);
  height: var(--v-h);
  max-width: var(--v-w);
  max-height: var(--v-h);
  color: white;
}

.valentine-text {
  margin: 0;
  text-align: center;
  align-content: center;
  font-family: sans-serif;
  font-weight: 700;
}

.focus-btn {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  min-height: 40px;
  background-color: transparent;
}

.focus-btn.focus-btn--open {
  font-size: 24px;
  backdrop-filter: blur(10px);
  z-index: 1050;
  color: hsl(0, 0%, 100%);
}

.focus-btn.focus-btn--again {
  bottom: 17%;
  transform: translateX(-50%);
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 4px;
  color: hsl(0, 0%, 0%);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
}
</style>

<style>
body {
  overflow: hidden;
}
</style>
