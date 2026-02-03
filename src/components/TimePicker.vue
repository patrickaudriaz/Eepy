<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'))

const hourRef = ref<HTMLElement | null>(null)
const minuteRef = ref<HTMLElement | null>(null)

// Current selection indices
const selectedHour = ref(0)
const selectedMinute = ref(0)

const ITEM_HEIGHT = 50 // Must match CSS

// Initialize from props
function parseInitialValue() {
  if (!props.modelValue) {
    const now = new Date()
    selectedHour.value = now.getHours()
    // Round to nearest 5 minutes
    selectedMinute.value = Math.round(now.getMinutes() / 5) % 12
    updateValue()
  } else {
    const [h, m] = props.modelValue.split(':').map(Number)
    selectedHour.value = h || 0
    selectedMinute.value = Math.round((m || 0) / 5) % 12
  }
}

function scrollToPosition(element: HTMLElement | null, index: number) {
  if (!element) return
  element.scrollTop = index * ITEM_HEIGHT
}

// Handle scroll events
function handleScroll(type: 'hour' | 'minute', event: Event) {
  const target = event.target as HTMLElement
  const index = Math.round(target.scrollTop / ITEM_HEIGHT)

  if (type === 'hour') {
    if (selectedHour.value !== index) {
      selectedHour.value = Math.max(0, Math.min(23, index))
      updateValue()
    }
  } else {
    if (selectedMinute.value !== index) {
      selectedMinute.value = Math.max(0, Math.min(11, index))
      updateValue()
    }
  }
}

function updateValue() {
  const h = hours[selectedHour.value]
  const m = minutes[selectedMinute.value]
  emit('update:modelValue', `${h}:${m}`)
}

onMounted(() => {
  parseInitialValue()
  // Wait for render to scroll
  nextTick(() => {
    scrollToPosition(hourRef.value, selectedHour.value)
    scrollToPosition(minuteRef.value, selectedMinute.value)
  })
})

// If parent changes value explicitly (rare in this app but good practice)
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return
    const [h, m] = newVal.split(':').map(Number)
    if (h !== selectedHour.value && hourRef.value) {
      selectedHour.value = h
      scrollToPosition(hourRef.value, h)
    }
    const mIndex = Math.round((m || 0) / 5) % 12
    if (mIndex !== selectedMinute.value && minuteRef.value) {
      selectedMinute.value = mIndex
      scrollToPosition(minuteRef.value, mIndex)
    }
  },
)
</script>

<template>
  <div class="time-picker">
    <!-- Selection overlay -->
    <div class="selection-bar"></div>

    <!-- Hours Column -->
    <div class="column" ref="hourRef" @scroll.passive="(e) => handleScroll('hour', e)">
      <div class="spacer"></div>
      <div
        v-for="(h, i) in hours"
        :key="h"
        class="item"
        :class="{ active: i === selectedHour }"
        @click="scrollToPosition(hourRef, i)"
      >
        {{ h }}
      </div>
      <div class="spacer"></div>
    </div>

    <div class="colon">:</div>

    <!-- Minutes Column -->
    <div class="column" ref="minuteRef" @scroll.passive="(e) => handleScroll('minute', e)">
      <div class="spacer"></div>
      <div
        v-for="(m, i) in minutes"
        :key="m"
        class="item"
        :class="{ active: i === selectedMinute }"
        @click="scrollToPosition(minuteRef, i)"
      >
        {{ m }}
      </div>
      <div class="spacer"></div>
    </div>
  </div>
</template>

<style scoped>
.time-picker {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  width: 100%;
  overflow: hidden;
  user-select: none;
  font-family: 'Inter', sans-serif;
  mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
}

.selection-bar {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 50px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.05); /* Very subtle highlight */
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
  z-index: 0;
}

.column {
  height: 100%;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  width: 80px;
  text-align: center;
  scrollbar-width: none; /* Firefox */
  z-index: 1;
}

.column::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

/* 
  Spacer is used to push the first item to the center.
  Container height is 250px. Center is at 125px.
  Item height is 50px.
  We want the first item centered.
  Top padding needed = 250/2 - 50/2 = 125 - 25 = 100px.
*/
.spacer {
  height: 100px;
  flex-shrink: 0;
}

.item {
  height: 50px;
  line-height: 50px;
  font-size: 1.5rem;
  color: var(--color-text-muted);
  scroll-snap-align: center;
  transition: all 0.2s;
  cursor: pointer;
  opacity: 0.5;
  transform: scale(0.9);
}

.item.active {
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 700;
  opacity: 1;
  transform: scale(1);
}

.colon {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  padding-bottom: 8px; /* Visual adjustment */
  z-index: 1;
}
</style>
