<template>
    <section class="controls">
      <h3>⚙️ Panel sterowania</h3>
  
      <!-- Ustawienie wygładzania -->
      <div class="control">
        <label for="windowRange">
          🎚️ <b>Wygładzanie korelacji:</b>
          <small>(im mniejsza wartość, tym bardziej zmienny wykres)</small>
        </label>
        <input
          id="windowRange"
          type="range"
          min="5"
          max="60"
          step="5"
          v-model.number="localWindow"
          @input="emitUpdate"
        />
        <span>{{ localWindow }} dni</span>
      </div>
  
      <!-- Symulacja trendu -->
      <div class="control">
        <label for="trendSelect">📈 Typ trendu symulacji:</label>
        <select id="trendSelect" v-model="trend" @change="emitUpdate">
          <option value="neutral">🔸 Neutralny</option>
          <option value="long">📊 Wzrostowy (Long)</option>
          <option value="short">📉 Spadkowy (Short)</option>
        </select>
      </div>
  
      <!-- Regresja -->
      <div class="control checkbox">
        <label>
          <input type="checkbox" v-model="showRegression" @change="emitUpdate" />
          🔍 Pokaż linię regresji USD/PLN
        </label>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    windowSize: { type: Number, default: 30 },
    trendType: { type: String, default: 'neutral' },
    showRegression: { type: Boolean, default: true }
  })
  
  const emits = defineEmits(['update-controls'])
  
  const localWindow = ref(props.windowSize)
  const trend = ref(props.trendType)
  const showRegression = ref(props.showRegression)
  
  function emitUpdate() {
    emits('update-controls', {
      windowSize: localWindow.value,
      trend: trend.value,
      showRegression: showRegression.value
    })
  }
  
  watch(props, () => {
    localWindow.value = props.windowSize
    trend.value = props.trendType
    showRegression.value = props.showRegression
  })
  </script>
  
  <style scoped>
  .controls {
    margin: 30px auto;
    padding: 20px;
    max-width: 480px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(77, 208, 225, 0.3);
    color: #cdefff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
    backdrop-filter: blur(8px);
  }
  
  .controls h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #fff;
  }
  
  .control {
    margin-bottom: 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .control label {
    font-weight: 500;
    display: flex;
    flex-direction: column;
    color: #e0f7fa;
  }
  
  .control small {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 2px;
  }
  
  .control input[type='range'] {
    accent-color: #4dd0e1;
    width: 100%;
  }
  
  .control select {
    padding: 6px 10px;
    background: #1e1e1e;
    border: 1px solid rgba(77, 208, 225, 0.4);
    color: #bfefff;
    border-radius: 6px;
  }
  
  .control.checkbox {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
  }
  
  input[type='checkbox'] {
    accent-color: #4dd0e1;
    transform: scale(1.2);
  }
  </style>