<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const mode = computed(() => route.query.mode as 'wake' | 'bed')
const time = ref('') // HTML time input uses "HH:mm" 24h format

const title = computed(() => {
  return mode.value === 'wake' ? 'When do you want to wake up?' : 'When do you plan to go to bed?'
})

function calculate() {
  if (!time.value) return

  // Create a Date object for the selected time
  // The date part doesn't matter as much, but we need to handle "next day" logic if needed.
  // Actually, for just calculating cycles, we can just work with an arbitrary date + time.
  const [hours, minutes] = time.value.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  // If selecting wake up time (mode=wake), result should be bed times (type=bed-times)
  // If selecting bed time (mode=bed), result should be wake times (type=wake-times)

  const resultType = mode.value === 'wake' ? 'bed-times' : 'wake-times'

  router.push({
    name: 'result',
    query: {
      type: resultType,
      referenceTime: date.getTime().toString(),
    },
  })
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="input-view">
    <header>
      <button class="back-link" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back
      </button>
    </header>

    <div class="content">
      <h2>{{ title }}</h2>

      <div class="time-wrapper">
        <input type="time" v-model="time" required />
      </div>

      <button class="btn btn-primary" :disabled="!time" @click="calculate">Calculate</button>
    </div>
  </div>
</template>

<style scoped>
.input-view {
  display: flex;
  flex-direction: column;
  height: 100%;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(to right, #f8fafc, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
