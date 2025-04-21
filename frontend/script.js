async function predictToday() {
    const companyName = document.getElementById('companyName').value.trim();
    if (!companyName) {
      alert('Please enter a company name.');
      return;
    }
  
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
  


  // 🔥 Yahoo - Today's Real Price
async function predictTodayYahoo() {
    const companyName = document.getElementById('companyName').value.trim();
    if (!companyName) {
      alert('Please enter a company name.');
      return;
    }
  
    try {
      const res = await fetch('/predict/yahoo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName })
      });
      const data = await res.json();
  
      document.getElementById('outputArea').innerHTML = `
        <div class="bg-white/20 p-4 rounded-xl">
          <h3 class="text-lg font-semibold mb-2">Yahoo: Today's Real Price for ${data.company}</h3>
          <pre class="whitespace-pre-wrap">${JSON.stringify(data.todayYahooPrediction, null, 2)}</pre>
        </div>
      `;
    } catch (error) {
      console.error(error);
      alert('Failed to fetch Yahoo today price.');
    }
  }
  
  // 🔥 Yahoo - Last 10 Days Real Prices
  async function predictLast10DaysYahoo() {
    const companyName = document.getElementById('companySymbol').value.trim();
    if (!companyName) {
      alert('Please enter a company symbol.');
      return;
    }
  
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
      alert('Failed to fetch Yahoo last 10 days.');
    }
  }