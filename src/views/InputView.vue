<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TimePicker from '../components/TimePicker.vue'

const route = useRoute()
const router = useRouter()

const mode = computed(() => route.query.mode as 'wake' | 'bed')
const time = ref('') // "HH:mm" format
const nativeInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  // Set default time to current time
  const now = new Date()
  time.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
})

const title = computed(() => {
  return mode.value === 'wake' ? 'When do you want to wake up?' : 'When do you plan to go to bed?'
})

function openNativePicker() {
  const el = nativeInput.value as any
  if (el) {
    if ('showPicker' in el) {
      el.showPicker()
    } else {
      el.focus()
      el.click()
    }
  }
}

function calculate() {
  if (!time.value) return

  // Create a Date object for the selected time
  // The date part doesn't matter as much, but we need to handle "next day" logic if needed.
  // Actually, for just calculating cycles, we can just work with an arbitrary date + time.
  const [hStr, mStr] = time.value.split(':')
  const hours = Number(hStr)
  const minutes = Number(mStr)
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
    <div class="content">
      <h2>{{ title }}</h2>

      <div class="time-wrapper">
        <!-- Hidden Native Input -->
        <input ref="nativeInput" type="time" v-model="time" required class="hidden-native-input" />

        <!-- Wheel Picker (Always Visible) -->
        <div @click="openNativePicker" class="picker-container">
          <TimePicker v-model="time" />
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" :disabled="!time" @click="calculate">Calculate</button>
        <button class="btn btn-secondary" @click="goBack">Back</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.time-wrapper {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.picker-container {
  width: 100%;
}

.hidden-native-input {
  position: absolute;
  pointer-events: none;
  opacity: 0;
  width: 1px;
  height: 1px;
  left: 50%;
  top: 50%;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
