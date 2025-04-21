async function predictToday() {
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
      alert('Failed to fetch prediction.');
    }
  }
  
  async function predictLast10Days() {
    const companySymbol = document.getElementById('companySymbol').value.trim();
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
      alert('Failed to fetch 10 days prediction.');
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
  async function predictLast10DaysYahoo() {
    const companyName = document.getElementById('companySymbol').value.trim();
    if (!companyName) {
      alert('Please enter a company symbol.');
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
      const res = await fetch('/predictRange/yahoo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName })
      });
      const data = await res.json();
  
      let html = `<div class="bg-white/20 p-4 rounded-xl">
        <h3 class="text-lg font-semibold mb-2">Yahoo: Last 10 Days Real Data for ${data.company}</h3>`;
  
      data.last10DaysYahooPrediction.last10Days.forEach(day => {
        html += `<p><strong>${day.date}:</strong> $${day.close}</p>`;
      });
  
      html += '</div>';
      document.getElementById('outputArea').innerHTML = html;
    } catch (error) {
      console.error(error);
      // alert('Failed to fetch Yahoo last 10 days.');

      outputArea.innerHTML = `<p class="text-red-500 text-center">Failed to get Yahoo's last 10 days. Try again.</p>`;

    }
  }