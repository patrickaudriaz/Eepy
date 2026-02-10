<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  addMinutes,
  BRANY_CYCLES,
  CYCLES,
  formatTime,
  getIdealBedTimes,
  getIdealWakeUpTimes,
  subtractMinutes,
} from '../utils/sleep'

const route = useRoute()
const router = useRouter()

const includeFallAsleepTime = ref(true)
const isBranyMode = ref(false)
const type = computed(() => route.query.type as 'wake-times' | 'bed-times')
const referenceTime = computed(() => parseInt(route.query.referenceTime as string))

const activeCycles = computed(() => {
  const result = [...CYCLES]
  if (isBranyMode.value) {
    result.push(...BRANY_CYCLES)
  }
  return result.sort((a, b) => a - b)
})

const calculatedTimes = computed(() => {
  const refDate = new Date(referenceTime.value)
  let times: Date[] = []

  // Fall asleep buffer logic:
  // If 'wake-times' (Sleep Now/Start): We sleep at Ref Time + 15m. So wake up times are delayed by 15m.
  // If 'bed-times' (Finish): We need to sleep at Ref Time - Cycles. So we must be in bed (Ref Time - Cycles) - 15m.
  const buffer = includeFallAsleepTime.value ? 15 : 0
  const cyclesList = activeCycles.value

  if (type.value === 'wake-times') {
    // We start sleeping 'buffer' minutes after bed time
    const sleepStart = addMinutes(refDate, buffer)
    times = getIdealWakeUpTimes(sleepStart, cyclesList)
  } else {
    // We calculate when to sleep to wake up at refDate
    const sleepTimes = getIdealBedTimes(refDate, cyclesList)
    // We need to be in bed 'buffer' minutes before we need to sleep
    times = sleepTimes.map((date) => subtractMinutes(date, buffer))
  }

  // Map cycles to times
  return cyclesList.map((cycles, index) => {
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
  return type.value === 'wake-times' ? 'Best times to wake up' : 'Best times to sleep'
})

const referenceLabel = computed(() => {
  return type.value === 'wake-times' ? 'Bedtime' : 'Wake Up Time'
})

const formattedReferenceTime = computed(() => formatTime(new Date(referenceTime.value)))

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="result-view">
    <div class="content">
      <h2>{{ title }}</h2>
      <div class="selected-time-display">
        <span class="label">{{ referenceLabel }}</span>
        <span class="value">{{ formattedReferenceTime }}</span>
      </div>

      <div class="toggle-container">
        <label class="toggle-switch">
          <input type="checkbox" v-model="includeFallAsleepTime" />
          <span class="slider"></span>
        </label>
        <span class="toggle-label">Include 15m to fall asleep</span>
      </div>

      <TransitionGroup name="list" tag="div" class="results-list">
        <div
          v-for="item in calculatedTimes"
          :key="item.cycles"
          class="card result-card"
          :class="{ highlight: item.cycles === 5 || item.cycles === 6, warning: item.cycles <= 3 }"
        >
          <div class="time">{{ item.formatted }}</div>
          <div class="cycles">{{ item.label }}</div>
          <div v-if="item.cycles >= 5" class="badge">Recommended</div>
          <div v-else-if="item.cycles <= 3" class="badge warning">Zombie</div>
        </div>
      </TransitionGroup>

      <div class="expand-options">
        <button class="btn-link" @click="isBranyMode = !isBranyMode">
          {{ isBranyMode ? 'Show standard cycles only' : 'Brany mode (extra cycles)' }}
        </button>
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
  margin-top: 1.7rem;
  margin-bottom: 8rem;
}

.selected-time-display {
  display: flex;
  flex-direction: row;
  align-items: center; /* Changed from baseline for vertical centering */
  justify-content: center;
  gap: 0.6rem;
  margin-top: 0.6rem;
  margin-bottom: 1.4rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 1rem;
  border-radius: 20px;
  align-self: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.selected-time-display .label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  opacity: 0.8;
  margin-bottom: 0;
}

.selected-time-display .value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  text-shadow: none;
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
  margin-bottom: 0.8rem;
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

.result-card.warning {
  border-color: rgba(248, 113, 113, 0.8);
  background: rgba(248, 113, 113, 0.1);
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
  top: 0.9rem;
  right: 0.9rem;
  font-size: 0.55rem;
  background: var(--color-primary);
  color: #0f172a;
  padding: 0.15rem 0.4rem;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.8;
}

.badge.warning {
  background: #f87171;
  color: #450a0a;
}

.toggle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
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

.expand-options {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  margin-bottom: 0rem;
}

.btn-link {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: none; /* Changed from underline to none for sleeker look, maybe specific request? "subtle" */
  opacity: 0.6;
  transition: all 0.2s ease;
  font-family: inherit;
  letter-spacing: 0.02em;
}

.btn-link:hover {
  opacity: 1;
  color: #fff;
  text-decoration: underline;
}

.results-list {
  display: flex;
  flex-direction: column;
  position: relative;
}

/* List Transitions */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
