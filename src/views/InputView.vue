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
      <button class="back-link" @click="goBack">← Back</button>
    </header>

    <div class="content">
      <h2>{{ title }}</h2>

      <input type="time" v-model="time" required />

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
  color: var(--color-text);
  font-size: 1rem;
  padding: 0;
  width: auto;
  text-align: left;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
