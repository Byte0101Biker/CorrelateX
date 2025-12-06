<template>
    <section class="about">
      <h2>📘 Teoria i zastosowane wzory</h2>
  
      <div class="block">
        <h3>1️⃣ Współczynnik korelacji Pearsona</h3>
        <p>Określa siłę i kierunek zależności pomiędzy dwiema zmiennymi:</p>
        <pre>
  r = Σ((xᵢ - x̄)(yᵢ - ȳ)) / √[Σ(xᵢ - x̄)² · Σ(yᵢ - ȳ)²]
        </pre>
        <ul>
          <li><b>r ≈ +1</b> – silna dodatnia korelacja (zmienne rosną razem)</li>
          <li><b>r ≈ -1</b> – silna ujemna korelacja (zmienne rosną odwrotnie)</li>
          <li><b>r ≈ 0</b> – brak liniowej zależności</li>
        </ul>
      </div>
  
      <div class="block">
        <h3>2️⃣ Regresja liniowa (model trendu)</h3>
        <p>Służy do wyznaczenia prostej najlepiej dopasowanej do danych:</p>
        <pre>
  y = a·x + b
  
  a = Σ((xᵢ - x̄)(yᵢ - ȳ)) / Σ(xᵢ - x̄)²
  b = ȳ - a·x̄
        </pre>
        <p>
          Regresja pomaga określić trend danych, co umożliwia prognozowanie i
          identyfikację kierunku rynku.
        </p>
      </div>
  
      <div class="block">
        <h3>3️⃣ Strategia inwestycyjna</h3>
        <p>Wykorzystując korelację oraz kierunek regresji, inwestor może:</p>
        <ul>
          <li>✅ <b>Pozycja długa (Long)</b> – gdy korelacja dodatnia i trend rosnący</li>
          <li>🚫 <b>Pozycja krótka (Short)</b> – gdy korelacja ujemna i trend malejący</li>
        </ul>
      </div>
    </section>
  </template>
  
  <style scoped>
  .about {
    color: #ddd;
    font-family: 'Inter', sans-serif;
    margin: 40px auto;
    max-width: 900px;
    background: rgba(255, 255, 255, 0.03);
    border-left: 3px solid #4dd0e1;
    padding: 25px 30px;
    border-radius: 8px;
  }
  
  .about h2 {
    text-align: center;
    color: #fff;
    margin-bottom: 25px;
  }
  
  .block {
    margin-bottom: 30px;
  }
  
  .block h3 {
    color: #4dd0e1;
    margin-bottom: 8px;
  }
  
  .about pre {
    background: rgba(255, 255, 255, 0.05);
    padding: 10px;
    border-radius: 6px;
    color: #9be7ff;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    overflow-x: auto;
  }
  
  ul {
    list-style: none;
    padding-left: 0;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  b {
    color: #fff;
  }
  </style>