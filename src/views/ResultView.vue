<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CYCLES, formatTime, getIdealBedTimes, getIdealWakeUpTimes } from '../utils/sleep'

const route = useRoute()
const router = useRouter()

const type = computed(() => route.query.type as 'wake-times' | 'bed-times')
const referenceTime = computed(() => parseInt(route.query.referenceTime as string))

const calculatedTimes = computed(() => {
  const refDate = new Date(referenceTime.value)
  let times: Date[] = []

  if (type.value === 'wake-times') {
    times = getIdealWakeUpTimes(refDate)
  } else {
    times = getIdealBedTimes(refDate)
  }

  // Map cycles to times
  return CYCLES.map((cycles, index) => ({
    cycles,
    time: times[index],
    formatted: formatTime(times[index]),
    label: `${cycles} Cycles (${cycles * 1.5} Hours)`,
  }))
})

const title = computed(() => {
  return type.value === 'wake-times' ? 'Ideal Wake Up Times' : 'Ideal Bed Times'
})

const subtitle = computed(() => {
  return type.value === 'wake-times'
    ? 'To feel refreshed, you should wake up at one of these times:'
    : 'To wake up feeling refreshed, you should go to bed at one of these times:'
})

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="result-view">
    <header>
      <button class="back-link" @click="goHome">Start Over</button>
    </header>

    <div class="content">
      <h2>{{ title }}</h2>
      <p class="desc">{{ subtitle }}</p>

      <div class="results-list">
        <div
          v-for="item in calculatedTimes"
          :key="item.cycles"
          class="card result-card"
          :class="{ highlight: item.cycles === 5 || item.cycles === 6 }"
        >
          <div class="time">{{ item.formatted }}</div>
          <div class="cycles">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-view {
  min-height: 100vh;
}

header {
  padding: 1rem 0;
}

.back-link {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1rem;
  padding: 0;
  width: auto;
}

.content {
  padding-bottom: 2rem;
}

.desc {
  margin-bottom: 2rem;
  opacity: 0.8;
  text-align: center;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
}

.result-card.highlight {
  border-color: var(--color-primary);
  background: linear-gradient(to bottom right, var(--color-surface), rgba(129, 140, 248, 0.1));
}

.time {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.cycles {
  font-size: 0.9rem;
  opacity: 0.6;
}
</style>
