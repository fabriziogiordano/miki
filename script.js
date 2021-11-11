(async () => {
  // Array con le azioni
  const stocks = ["tsla", "aapl", "fb", "amzn", "msft", "nflx", "goog"];

  // Container per tutti i grafici
  const chartsDiv = document.getElementById("charts");

  let chartContainerHtml = "";
  for (const symbol of stocks) {
    // Crea un container per ogni azione
    chartContainerHtml += `
    <div class="chartContainer">
        <h1>${symbol}</h1>
        <div id="chart-${symbol}"></div>
    </div>
    `;
  }
  chartsDiv.innerHTML = chartContainerHtml;

  // Instanzia i grafici
  const allChartsMap = new Map();
  Promise.all(
    stocks.map(async (symbol) => {
      const chartInstance = await createCharts(symbol);
      allChartsMap.set(symbol, chartInstance);
      return { symbol, chart: chartInstance };
    })
  ).then((/*allCharts*/) => {
    //console.log(allCharts);
    window.allCharts = allChartsMap;
    console.log("All charts are loaded");
  });
})();

// Singola funzione che carica i dati e crea il grafico
async function createCharts(symbol) {
  console.log(`Loading ${symbol.toUpperCase()}`);

  const el = document.getElementById(`chart-${symbol}`);
  const chart = LightweightCharts.createChart(el, window.chartOptions);
  const candleSeries = chart.addCandlestickSeries();
  const response = await fetch(
    "https://api.cryptomike.io/v1.0/api/td?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9&" + `ticker=${symbol}`
  );

  let data = await response.json();
  data.map((single_candle) => {
    return {
      ...single_candle,
      time: single_candle.time * 1000,
    };
  });
  data = data.slice(-300).slice(0, 299);
  candleSeries.setData(data);
  console.log(`Loaded ${symbol.toUpperCase()}`);
  return chart;
}
