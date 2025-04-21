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


  async function hello() {
    const userName = document.getElementById('aiAgent').value.trim();
    if (!userName) {
      alert('Please enter your name.');
      return;
    }
  
    try {
      const res = await fetch('/hello', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: userName })  // you are sending companyName, it's okay
      });
      const data = await res.json();
  
      const agentName = data.todayPrediction.agent || 'Agent';
      const serviceName = data.todayPrediction.service || 'Service';
  
      document.getElementById('outputArea').innerHTML = `
        <div class="bg-white/20 p-6 rounded-xl text-center">
          <h2 class="text-2xl font-semibold mb-2">👋 Hello ${userName}!</h2>
          <p class="text-lg">I am <span class="font-bold">${agentName}</span>, and I will provide you <span class="font-bold">${serviceName}</span> service.</p>
        </div>
      `;
    } catch (error) {
      console.error(error);
      alert('Failed to call AI Agent.');
    }
  }
  






  async function leo() {
    const movieName = document.getElementById('aiAgentLeo').value.trim();
    if (!movieName) {
      alert('Please enter your movie name.');
      return;
    }
  
    try {
      const res = await fetch('/leo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieName: movieName })  // you are sending companyName, it's okay
      });
      const data = await res.json();
  
      const agentName = data.movieResult.agent || 'Agent';
      const synopsis = data.movieResult.synopsis || 'Service';
  
      document.getElementById('outputArea').innerHTML = `
        <div class="bg-white/20 p-6 rounded-xl text-center">
          <h2 class="text-2xl font-semibold mb-2">👋 Summary of ${movieName}!</h2>
          <p class="text-lg">I am <span class="font-normal">${agentName}</span> <br><br> <span class="font-bold">${synopsis}</span></p>
        </div>
      `;
    } catch (error) {
      console.error(error);
      alert('Failed to call AI Agent.');
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