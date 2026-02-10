<script setup lang="ts">
import { useRouter } from 'vue-router'
import { addMinutes, formatTime } from '../utils/sleep'

const router = useRouter()

// Standard power nap durations
const naps = [
  { duration: 20, label: 'Power Nap', desc: 'Boost alertness (20m)' },
  { duration: 90, label: 'Full Cycle', desc: 'Creative boost (90m)' },
]

function getWakeTime(minutes: number) {
  // Add minutes + 15m to fall asleep roughly? Usually naps are "set alarm for X minutes".
  // Let's assume the user sets a timer for X minutes total.
  // Or we tell them "Wake up at: HH:MM"
  const now = new Date()
  // Often with naps you just want to set an alarm.
  // But let's stick to the app's pattern: telling time.
  // We'll add a small buffer or just assumes raw time. Let's start with raw duration from now.
  return formatTime(addMinutes(now, minutes))
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="nap-view">
    <div class="content">
      <h2>Take a Nap</h2>
      <div class="nap-list">
        <div v-for="nap in naps" :key="nap.duration" class="card nap-card">
          <div class="nap-info">
            <div class="nap-label">{{ nap.label }}</div>
            <div class="nap-desc">{{ nap.desc }}</div>
          </div>
          <div class="nap-time">
            <span class="sub">Set alarm for</span>
            <div class="time-val">{{ getWakeTime(nap.duration) }}</div>
          </div>
        </div>
      </div>

      <div class="info-box">
        <p>⚠️ Avoid napping for 30-60 minutes to prevent sleep inertia (groggy feeling).</p>
      </div>

      <div class="actions">
        <!-- Reusing btn-secondary but maybe we want a "Home" button consistency? -->
        <button class="btn btn-primary" @click="goBack">Home</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nap-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* justify-content: center; Removed to match ResultView top alignment */
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

.nap-list {
  display: flex;
  flex-direction: column;
  margin-top: 1.3rem;
}

.nap-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  /* background: rgba(255, 255, 255, 0.05); Removed to use main.css .card background */
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.nap-label {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.2rem;
}

.nap-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.nap-time {
  text-align: right;
}

.nap-time .sub {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 0.2rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.time-val {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
  text-shadow: 0 0 20px rgba(129, 140, 248, 0.4);
  line-height: 1;
}

.info-box {
  margin-top: 1rem;
  padding: 1rem;
  /* Match .result-card.warning style */
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.4);
  /* color: #fca5a5; */
  border-radius: 12px;
  color: #f87171;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
}

.actions {
  margin-top: 2rem;
  margin-bottom: 8rem;
}
</style>
