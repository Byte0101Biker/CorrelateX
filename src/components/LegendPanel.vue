<template>
  <aside class="legend">
    <h3>🧭 Opis elementów wykresu</h3>
    <ul>
      <li>📈 <b>Ruchoma korelacja</b> – siła zależności USD/PLN ↔ WIG20</li>
      <li>📊 <b>Regresja USDPLN</b> – trend kursu dolara</li>
      <li>🟩 <b>Long</b> – sugerowany wzrost WIG20</li>
      <li>🟥 <b>Short</b> – sugerowany spadek WIG20</li>
    </ul>
  </aside>
</template>

<style scoped>
.legend {
  margin: 20px auto;
  font-size: 14px;
  background: rgba(30, 30, 30, 0.9);
  padding: 20px;
  border-radius: 12px;
  max-width: 600px;
  color: #e0e0e0;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  margin-bottom: 8px;
}
</style>