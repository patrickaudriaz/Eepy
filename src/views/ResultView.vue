<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  addMinutes,
  CYCLES,
  formatTime,
  getIdealBedTimes,
  getIdealWakeUpTimes,
  subtractMinutes,
} from '../utils/sleep'

const route = useRoute()
const router = useRouter()

const includeFallAsleepTime = ref(true)
const type = computed(() => route.query.type as 'wake-times' | 'bed-times')
const referenceTime = computed(() => parseInt(route.query.referenceTime as string))

const calculatedTimes = computed(() => {
  const refDate = new Date(referenceTime.value)
  let times: Date[] = []

  // Fall asleep buffer logic:
  // If 'wake-times' (Sleep Now/Start): We sleep at Ref Time + 15m. So wake up times are delayed by 15m.
  // If 'bed-times' (Finish): We need to sleep at Ref Time - Cycles. So we must be in bed (Ref Time - Cycles) - 15m.
  const buffer = includeFallAsleepTime.value ? 15 : 0

  if (type.value === 'wake-times') {
    // We start sleeping 'buffer' minutes after bed time
    const sleepStart = addMinutes(refDate, buffer)
    times = getIdealWakeUpTimes(sleepStart)
  } else {
    // We calculate when to sleep to wake up at refDate
    const sleepTimes = getIdealBedTimes(refDate)
    // We need to be in bed 'buffer' minutes before we need to sleep
    times = sleepTimes.map((date) => subtractMinutes(date, buffer))
  }

  // Map cycles to times
  return CYCLES.map((cycles, index) => {
    const time = times[index]
    if (!time) {
      // Fallback or error, shouldn't happen
      return {
        cycles,
        time: new Date(),
        formatted: '--:--',
        label: `${cycles} Cycles`,
      }
    }
    return {
      cycles,
      time: time,
      formatted: formatTime(time),
      label: `${cycles} Cycles (${cycles * 1.5} Hours)`,
    }
  })
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
    <div class="content">
      <h2>{{ title }}</h2>
      <p class="desc">{{ subtitle }}</p>

      <div class="toggle-container" v-if="type === 'wake-times'">
        <label class="toggle-switch">
          <input type="checkbox" v-model="includeFallAsleepTime" />
          <span class="slider"></span>
        </label>
        <span class="toggle-label">Include 15m to fall asleep</span>
      </div>

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

      <div class="actions">
        <button class="btn btn-primary" @click="goHome">Start Over</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-view {
  /* min-height: 100vh;  Removed to rely on #app height */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content {
  flex: 1;
  /* padding: 2rem 0;  Removed to reduce top margin & match InputView's centering */
  display: flex;
  flex-direction: column;
  /* justify-content: center; Removed to align to top like InputView */
}

.actions {
  margin-top: 2rem;
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
  margin-bottom: 1rem;
  color: var(--color-text-muted);
  text-align: center;
  font-size: 1rem;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  font-size: 0.6rem;
  background: var(--color-primary);
  color: #0f172a;
  padding: 0.15rem 0.4rem;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
}

.toggle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.toggle-label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1);
  transition: 0.3s;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: #fff;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

input:checked + .slider:before {
  transform: translateX(20px);
}
</style>
