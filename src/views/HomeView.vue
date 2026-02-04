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
      <div class="logo">😴</div>
      <h1>mimir</h1>
      <p>Optimize your sleep cycles</p>
    </div>

    <nav class="menu">
      <button @click="sleepNow" class="btn btn-primary">
        <div>Sleep Now</div>
        <span class="subtext">Calculate wake up times for now</span>
      </button>

      <button @click="selectWakeUp" class="btn">
        <div>Select Wake Up Time</div>
        <span class="subtext">Find out when to go to bed</span>
      </button>

      <button @click="selectBedTime" class="btn">
        <div>Select Bed Time</div>
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

.logo {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

.hero h1 {
  font-size: 3.5rem;
  background: linear-gradient(to right, #818cf8, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.hero p {
  color: var(--color-text-muted);
  font-size: 1.1rem;
}

.subtext {
  display: block;
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.7;
  margin-top: 0.4rem;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(20px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
