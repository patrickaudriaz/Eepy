<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function sleepNow() {
  const now = new Date()
  // ISO string is safest for query params, but local time matters.
  // We can pass the timestamp.
  router.push({
    name: 'result',
    query: {
      type: 'wake-times', // We want to see wake times
      referenceTime: now.getTime().toString(),
    },
  })
}

function selectWakeUp() {
  // We want to select a wake up time, so we want to see bed times
  router.push({ name: 'input', query: { mode: 'wake' } })
}

function selectBedTime() {
  // We want to select a bed time, so we want to see wake times
  router.push({ name: 'input', query: { mode: 'bed' } })
}
</script>

<template>
  <div class="home-view">
    <div class="hero">
      <h1>eepy</h1>
      <p>Optimize your sleep cycles</p>
    </div>

    <nav class="menu">
      <button @click="sleepNow" class="btn btn-primary">
        Sleep Now
        <span class="subtext">Calculate wake up times for now</span>
      </button>

      <button @click="selectWakeUp" class="btn">
        Select Wake Up Time
        <span class="subtext">Find out when to go to bed</span>
      </button>

      <button @click="selectBedTime" class="btn">
        Select Bed Time
        <span class="subtext">Find out when to wake up</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.hero {
  margin-bottom: 3rem;
  text-align: center;
}

.hero h1 {
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.subtext {
  display: block;
  font-size: 0.8rem;
  font-weight: 400;
  opacity: 0.7;
  margin-top: 0.2rem;
}
</style>
