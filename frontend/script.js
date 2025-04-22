async function predictToday() {

  document.getElementById('companySymbol').value="";
  document.getElementById('companyName').value="";
  document.getElementById('companySymbol1').value="";


    const companyName = document.getElementById('companyName1').value.trim();
    if (!companyName) {
      alert('Please enter a company name.');
      return;
    }

    const outputArea = document.getElementById('outputArea');

    // ✨ Show loading spinner immediately
    outputArea.innerHTML = `
      <div class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    `;
  
  
    try {
      const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName })
      });
      const data = await res.json();
  
      document.getElementById('outputArea').innerHTML = `
        <div class="bg-white/20 p-4 rounded-xl">
          <h3 class="text-lg font-semibold mb-2">Today's Prediction for ${data.company}</h3>
          <pre class="whitespace-pre-wrap">${JSON.stringify(data.todayPrediction, null, 2)}</pre>
        </div>
      `;
    } catch (error) {
      console.error(error);
      // alert('Failed to fetch prediction.');
      outputArea.innerHTML = `<p class="text-red-500 text-center">Failed to Gemini today price. Try again.</p>`;
    }
  }
  
  async function predictLast10Days() {

    document.getElementById('companySymbol').value="";
    document.getElementById('companyName1').value="";
    document.getElementById('companyName').value="";

    
    const companySymbol = document.getElementById('companySymbol1').value.trim();
    if (!companySymbol) {
      alert('Please enter a company symbol.');
      return;
    }
  
    try {
      const res = await fetch('/predictRange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companySymbol })
      });
      const data = await res.json();
  
      let html = `<div class="bg-white/20 p-4 rounded-xl">
        <h3 class="text-lg font-semibold mb-2">Last 10 Days for ${data.company}</h3>`;
  
      data.last10DaysPrediction.last10Days.forEach(day => {
        html += `<p><strong>${day.date}:</strong> $${day.closingPrice}</p>`;
      });
  
      html += '</div>';
      document.getElementById('outputArea').innerHTML = html;
    } catch (error) {
      console.error(error);
      // alert('Failed to fetch 10 days prediction.');

      outputArea.innerHTML = `<p class="text-red-500 text-center">Failed to Gemini 10 days price. Try again.</p>`;
    }
  }


  function getCurrencySymbol(currencyCode) {
    try {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
      });
      const parts = formatter.formatToParts(1);
      const currencySymbol = parts.find(part => part.type === 'currency').value;
      return currencySymbol;
    } catch (error) {
      return undefined;
    }
  }


  
  // 🔥 Yahoo - Today's Real Price
// 🔥 Yahoo - Today's Real Price (Beautified)
async function predictTodayYahoo() {
  document.getElementById('companySymbol').value="";
  document.getElementById('companyName1').value="";
  document.getElementById('companySymbol1').value="";

    const companyName = document.getElementById('companyName').value.trim();
    if (!companyName) {
      alert('Please enter a company name.');
      return;
    }

    const outputArea = document.getElementById('outputArea');

    // ✨ Show loading spinner immediately
    outputArea.innerHTML = `
      <div class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    `;
  
  
    try {
      const res = await fetch('/predict/yahoo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName })
      });
      const data = await res.json();
  
      const { todayYahooPrediction } = data;
  
      // Format the timestamp nicely
      const formattedDate = new Date(todayYahooPrediction.timestamp).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
  
      // Nicely structured output
      document.getElementById('outputArea').innerHTML = `
        <div class="bg-white/20 p-6 rounded-2xl shadow-md space-y-4">
          <h3 class="text-2xl font-bold">${todayYahooPrediction.companyName} (${todayYahooPrediction.symbol})</h3>
          <p class="text-lg">📈 <strong>Current Price:</strong> ${getCurrencySymbol(todayYahooPrediction.currency)}${todayYahooPrediction.marketPrice} ${todayYahooPrediction.currency}</p>
          <p class="text-sm">🕒 <strong>Timestamp:</strong> ${formattedDate}</p>
        </div>
      `;
  
    } catch (error) {
      console.error(error);
      // alert('Failed to fetch Yahoo today price.');

      outputArea.innerHTML = `<p class="text-red-500 text-center">Failed to Yahoo today price. Try again.</p>`;

    }
  }
  
  
  // 🔥 Yahoo - Last 10 Days Real Prices
  let stockChart; // 📊 Global Chart variable
  let fullDates = [];  // 🛡 Backup: All Dates
let fullPrices = []; // 🛡 Backup: All Prices

async function predictLast10DaysYahoo() {
  document.getElementById('companyName').value = "";
  document.getElementById('companyName1').value = "";
  document.getElementById('companySymbol1').value = "";

  const companyName = document.getElementById('companySymbol').value.trim();
  if (!companyName) {
    alert('Please enter a company symbol.');
    return;
  }

  const outputArea = document.getElementById('outputArea');

  outputArea.innerHTML = `
    <div class="flex justify-center items-center h-48">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  `;

  try {
    const res = await fetch('/predictRange/yahoo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName })
    });

    const data = await res.json();
    const priceData = data.last10DaysYahooPrediction.last10Days;

    // 📄 Backup full original data
    fullDates = priceData.map(day => day.date);
    fullPrices = priceData.map(day => day.close);

    let html = `
      <div class="bg-white/20 p-4 rounded-xl">
        <h3 class="text-lg font-semibold mb-4">📈 Yahoo: Last 10 Days Real Data for ${data.last10DaysYahooPrediction.companyName}</h3>

        <div class="grid grid-cols-2 gap-2 text-sm mb-4">
    `;

    // priceData.forEach(day => {
    //   html += `<p><strong>${day.date}:</strong> $${day.close}</p>`;
    // });

    html += `
        </div>

        <div class="mt-6">
          <canvas id="lineChart" height="160"></canvas>
        </div>

        <div class="mt-4 flex flex-wrap gap-2 justify-center text-xs font-semibold">
  <button class="filter-btn px-3 py-1 bg-green-600 hover:bg-black rounded-full" onclick="filterChart('1W', this)">1W</button>
  <button class="filter-btn px-3 py-1 bg-green-600 hover:bg-black rounded-full" onclick="filterChart('10D', this)">10D</button>
  <button class="filter-btn px-3 py-1 bg-green-600 hover:bg-black rounded-full" onclick="filterChart('1M', this)">1M</button>
  <button class="filter-btn px-3 py-1 bg-green-600 hover:bg-black rounded-full" onclick="filterChart('6M', this)">6M</button>
  <button class="filter-btn px-3 py-1 bg-green-600 hover:bg-black rounded-full" onclick="filterChart('1Y', this)">1Y</button>
  <button class="filter-btn px-3 py-1 bg-green-600 hover:bg-black rounded-full" onclick="filterChart('5Y', this)">5Y</button>
  <button class="filter-btn px-3 py-1 bg-green-600 hover:bg-black rounded-full" onclick="filterChart('10Y', this)">10Y</button>
  <button class="filter-btn px-3 py-1 bg-black hover:bg-black rounded-full" onclick="filterChart('ALL', this)">ALL</button>
</div>

     <br><br>
    `;

    priceData.forEach(day => {
      html += `<p><strong>${day.date}:</strong> ${getCurrencySymbol(data.last10DaysYahooPrediction.currency)}${day.close}</p>`;
    });

    html +=' </div>';

    outputArea.innerHTML = html;

    const ctx = document.getElementById('lineChart').getContext('2d');
    stockChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: fullDates,
        datasets: [{
          label: `Stock Price (${getCurrencySymbol(data.last10DaysYahooPrediction.currency)}) - ${data.last10DaysYahooPrediction.companyName}`,
          data: fullPrices,
          fill: false,
          borderColor: '#66BB6A',
          backgroundColor: '#66BB6A',
          tension: 0.3,
          pointBackgroundColor: 'white',
          pointBorderColor: '#43A047',
          pointHoverBackgroundColor: '#43A047',
          pointHoverBorderColor: 'white',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return `Price: ${getCurrencySymbol(data.last10DaysYahooPrediction.currency)}${context.parsed.y}`;
              }
            }
          },
          legend: {
            labels: {
              color: 'white'
            }
          }
        },
        scales: {
          x: {
            ticks: { color: 'white' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          y: {
            ticks: { color: 'white' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });

  } catch (error) {
    console.error(error);
    outputArea.innerHTML = `<p class="text-red-500 text-center">❌ Failed to get Yahoo's last 10 days. Try again.</p>`;
  }
}



function filterChart(range, button) {
  if (!stockChart) return;

  const now = new Date();

  let filteredDates = [];
  let filteredPrices = [];

  fullDates.forEach((label, index) => {
    const date = new Date(label);
    let include = false;
    switch (range) {
      case '1W':
        include = (now - date) <= (7 * 24 * 60 * 60 * 1000);
        break;
      case '10D':
        include = (now - date) <= (10 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        include = (now - date) <= (30 * 24 * 60 * 60 * 1000);
        break;
      case '6M':
        include = (now - date) <= (182 * 24 * 60 * 60 * 1000);
        break;
      case '1Y':
        include = (now - date) <= (365 * 24 * 60 * 60 * 1000);
        break;
      case '5Y':
        include = (now - date) <= (5 * 365 * 24 * 60 * 60 * 1000);
        break;
      case '10Y':
        include = (now - date) <= (10 * 365 * 24 * 60 * 60 * 1000);
        break;
      case 'ALL':
        include = true;
        break;
    }

    if (include) {
      filteredDates.push(label);
      filteredPrices.push(fullPrices[index]);
    }
  });

  stockChart.data.labels = filteredDates;
  stockChart.data.datasets[0].data = filteredPrices;
  stockChart.update();

 // 🧠 Now handle button highlighting:
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.classList.remove('bg-black');
  btn.classList.add('bg-green-600');
});

button.classList.remove('bg-green-600');
button.classList.add('bg-black');

}


  
  