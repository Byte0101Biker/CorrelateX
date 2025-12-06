<template>
    <div class="correlation-info">
      <p>
        📊 <b>Współczynnik korelacji:</b>
        <span :style="{ color: color }">{{ formattedCurrent }}</span>
      </p>
      <p>
        📈 <b>Średnia korelacja:</b>
        <span>{{ formattedAvg }}</span>
      </p>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    current: {
      type: Number,
      default: 0
    },
    avg: {
      type: Number,
      default: 0
    }
  })
  
  const color = computed(() => {
    if (props.current > 0.3) return '#00ff88' // zielony – dodatnia korelacja
    if (props.current < -0.3) return '#ff5555' // czerwony – ujemna korelacja
    return '#f0e68c' // neutralna (żółta)
  })
  
  const formattedCurrent = computed(() => props.current?.toFixed(2))
  const formattedAvg = computed(() => props.avg?.toFixed(2))
  </script>
  
  <style scoped>
  .correlation-info {
    text-align: center;
    font-size: 17px;
    margin: 20px auto 30px;
    padding: 15px 25px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    border: 1px solid rgba(77, 208, 225, 0.3);
    color: #bfefff;
    width: fit-content;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.05);
    backdrop-filter: blur(6px);
  }
  
  .correlation-info p {
    margin: 6px 0;
  }
  
  .correlation-info b {
    color: #ffffff;
    font-weight: 600;
  }
  </style>