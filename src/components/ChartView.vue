<template>
    <section class="chart-view">
      <div class="chart-container">
        <canvas ref="chartCanvas" class="chart"></canvas>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { Chart, registerables } from 'chart.js'
  import annotationPlugin from 'chartjs-plugin-annotation'
  import axios from 'axios'
  import { correlation } from '/src/utils/correlation.js'
  
  Chart.register(...registerables, annotationPlugin)
  
  const props = defineProps({
    windowSize: { type: Number, default: 30 },
    trendType: { type: String, default: 'neutral' },
    showRegression: { type: Boolean, default: true },
    onDataReady: Function
  })
  
  const chartCanvas = ref(null)
  let chartInstance = null
  let baseData = null
  
  onMounted(async () => {
    baseData = await fetchData()
    updateChart()
  })
  
  watch(() => [props.windowSize, props.trendType, props.showRegression], updateChart)
  
  // --- Dane z NBP (lub fallback) ---
  async function fetchData() {
    try {
      const response = await axios.get(
        'https://api.allorigins.win/get?url=' +
          encodeURIComponent('https://api.nbp.pl/api/exchangerates/rates/A/USD/last/60/?format=json')
      )
      const nbp = JSON.parse(response.data.contents)
      const usdpln = nbp.rates.map(r => r.mid)
      const labels = nbp.rates.map(r => r.effectiveDate)
      return { labels, usdpln }
    } catch {
      const labels = Array.from({ length: 60 }, (_, i) => `2025-01-${String(i + 1).padStart(2, '0')}`)
      const usdpln = labels.map((_, i) => 3.9 + Math.sin(i / 6) * 0.05)
      return { labels, usdpln }
    }
  }
  
  // --- Symulacja WIG20 wg trendu ---
  function generateWIG20(usdpln) {
    const base = 2400
    switch (props.trendType) {
      case 'long':  return usdpln.map((_, i) => base + i * 2 + Math.sin(i / 3) * 20)
      case 'short': return usdpln.map((_, i) => base - i * 2 + Math.sin(i / 3) * 20)
      default:      return usdpln.map((_, i) => base + Math.sin(i / 4) * 40 + (Math.random() - 0.5) * 20)
    }
  }
  
  // --- Korelacja ruchoma i etykiety ---
  function prepareData(labels, usdpln, wig20) {
    const corrSeries = []
    for (let i = props.windowSize - 1; i < usdpln.length; i++) {
      const x = usdpln.slice(i - props.windowSize + 1, i + 1)
      const y = wig20.slice(i - props.windowSize + 1, i + 1)
      const val = correlation(x, y)
      corrSeries.push(Number((val ?? 0).toFixed(3)))
    }
  
    // Etykiety dopasowane do liczby punktów korelacji
    const visibleLabels = labels.slice(props.windowSize - 1)
  
    // Regresja po KORELACJI (nie po USDPLN) – i tylko gdy ma sens (>=2 pkt)
    const regressionLine = (props.showRegression && corrSeries.length >= 2)
      ? calcLinearRegression(corrSeries)
      : []
  
    // Zgłoszenie do CorrelationInfo
    if (props.onDataReady) props.onDataReady({ corrSeries })
  
    return { labels: visibleLabels, corrSeries, regressionLine }
  }
  
  function updateChart() {
    if (!baseData) return
    const { labels, usdpln } = baseData
    const wig20 = generateWIG20(usdpln)
    const { labels: visibleLabels, corrSeries, regressionLine } = prepareData(labels, usdpln, wig20)
  
    if (chartInstance) chartInstance.destroy()
  
    chartInstance = new Chart(chartCanvas.value, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Punkty korelacji',
            data: corrSeries.map((v, i) => ({ x: visibleLabels[i], y: v })),
            backgroundColor: corrSeries.map(v => (v >= 0 ? 'rgba(0, 255, 136, 0.85)' : 'rgba(255, 85, 85, 0.85)')),
            borderColor: '#4dd0e1',
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false,
            yAxisID: 'y'
          },
          ...(props.showRegression && regressionLine.length
            ? [
                {
                  type: 'line',
                  label: 'Regresja korelacji',
                  // ważne: ta sama oś 'y' i te same x jak punkty
                  data: regressionLine.map((v, i) => ({ x: visibleLabels[i], y: v })),
                  borderColor: 'rgba(255, 99, 132, 0.9)',
                  borderDash: [5, 5],
                  borderWidth: 1.6,
                  tension: 0,
                  fill: false,
                  yAxisID: 'y'
                }
              ]
            : [])
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500, easing: 'easeOutCubic' },
        interaction: { mode: 'nearest', intersect: true },
        plugins: {
          legend: { position: 'top', labels: { color: '#ddd', boxWidth: 18 } },
          tooltip: {
            callbacks: { label: ctx => ` ${ctx.dataset.label.includes('Regresja') ? 'Trend' : 'Korelacja'}: ${ctx.parsed.y.toFixed(3)}` }
          }
        },
        scales: {
          x: {
            type: 'category',
            ticks: { color: '#aaa', maxRotation: 40, minRotation: 40 },
            grid: { color: 'rgba(255,255,255,0.05)' }
          },
          y: {
            min: -1,
            max: 1,
            ticks: { color: '#aaa' },
            title: { display: true, text: 'Korelacja', color: '#aaa' }
          }
          // usuwamy y2 — regresja jest na tej samej osi co korelacja
        }
      }
    })
  }
  
  // --- Regresja liniowa po serii y (korelacja) ---
  function calcLinearRegression(series) {
    const n = series.length
    if (n < 2) return series.slice() // brak sensownej regresji
  
    const x = [...Array(n).keys()]               // 0..n-1
    const meanX = x.reduce((a, b) => a + b, 0) / n
    const meanY = series.reduce((a, b) => a + b, 0) / n
  
    const num = x.map((xi, i) => (xi - meanX) * (series[i] - meanY)).reduce((a, b) => a + b, 0)
    const den = x.map(xi => (xi - meanX) ** 2).reduce((a, b) => a + b, 0) || 1e-12 // zabezpieczenie
    const slope = num / den
    const intercept = meanY - slope * meanX
  
    return x.map(xi => +(slope * xi + intercept).toFixed(3))
  }
  </script>
  
  <style scoped>
  .chart-view {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .chart-container {
    position: relative;
    width: 95vw;
    max-width: 1400px;
    height: 70vh;
    min-height: 500px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 0 25px rgba(77, 208, 225, 0.1);
    padding: 10px;
  }
  canvas.chart {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
  </style>