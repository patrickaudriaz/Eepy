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
      <button class="back-link" @click="goHome">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
        Start Over
      </button>
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
          <div v-if="item.cycles >= 5" class="badge">Recommended</div>
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
  color: var(--color-text-muted);
  font-size: 1rem;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--color-text);
}

.content {
  padding-bottom: 2rem;
}

h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
  background: linear-gradient(to right, #818cf8, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.desc {
  margin-bottom: 2rem;
  color: var(--color-text-muted);
  text-align: center;
  font-size: 1rem;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.result-card.highlight {
  border-color: var(--color-primary);
  background: rgba(129, 140, 248, 0.1);
  box-shadow: 0 0 30px rgba(129, 140, 248, 0.1);
}

.time {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 20px rgba(129, 140, 248, 0.5);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.cycles {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.7rem;
  background: var(--color-primary);
  color: #0f172a;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
