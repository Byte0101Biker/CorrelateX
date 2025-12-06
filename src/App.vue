<template>
  <main>
    <!-- Wykres -->
    <ChartView
      :windowSize="windowSize"
      :trendType="trendType"
      :showRegression="showRegression"
      :onDataReady="updateCorr"
    />

    <!-- Info o korelacji -->
    <CorrelationInfo :current="currentCorr" :avg="avgCorr" />

    <!-- Panel sterowania -->
    <ControlsPanel
      :windowSize="windowSize"
      :trendType="trendType"
      :showRegression="showRegression"
      @update-controls="updateControls"
    />

    <!-- Legenda i opis -->
    <LegendPanel />

    <!-- O sekcji projektu -->
    <AboutSection />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import ChartView from './components/ChartView.vue'
import CorrelationInfo from './components/CorrelationInfo.vue'
import ControlsPanel from './components/ControlsPanel.vue'
import LegendPanel from './components/LegendPanel.vue'
import AboutSection from './components/AboutSection.vue'

const windowSize = ref(30)
const trendType = ref('neutral')
const showRegression = ref(true)
const currentCorr = ref(0)
const avgCorr = ref(0)

// 🔹 aktualizacja z panelu sterowania
function updateControls({ windowSize: newWindow, trend, showRegression: regression }) {
  windowSize.value = newWindow
  trendType.value = trend
  showRegression.value = regression
}

// 🔹 aktualizacja z ChartView
function updateCorr({ corrSeries }) {
  if (!corrSeries || !corrSeries.length) {
    currentCorr.value = 0
    avgCorr.value = 0
    return
  }

  // Filtrujemy dane, by uniknąć nulli i NaN
  const valid = corrSeries.filter(v => typeof v === 'number' && !isNaN(v))
  if (!valid.length) return

  currentCorr.value = Number(valid.at(-1).toFixed(2))
  avgCorr.value = Number(
    (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2)
  )
}
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  padding-bottom: 40px;
}
</style>