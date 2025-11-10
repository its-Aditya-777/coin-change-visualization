document.getElementById("startBtn").addEventListener("click", startVisualization);

document.getElementById("compareBtn").addEventListener("click", compareBoth);

// const denominations = [25, 10, 5, 1]; // You can change this to [10, 5, 2, 1] for INR
function getDenominations() {
  const system = document.getElementById("coinSystem").value;
  return system === "canonical" ? [25, 10, 5, 1] : [4, 3, 1];
}


function startVisualization() {
  const algo = document.getElementById("algorithm").value;
  const amount = parseInt(document.getElementById("amount").value);
  const visual = document.getElementById("visual");
  const result = document.getElementById("result");
  const denominations = getDenominations();

  visual.innerHTML = "";
  result.innerHTML = "";

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid positive amount.");
    return;
  }

  if (algo === "greedy") {
    greedyVisualization(amount, visual, result, denominations);
  } else {
    dpVisualization(amount, visual, result, denominations);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function greedyVisualization(amount, visual, result, denominations){
  let remaining = amount;
  let steps = [];
  result.innerHTML = `<p>🔹 Using <b>Greedy Choice</b> Algorithm...</p>`;

  for (let coin of denominations) {
    while (remaining >= coin) {
      remaining -= coin;
      steps.push(coin);
      showCoin(visual, coin,"greedy");
      await delay(450);
    }
  }
  result.innerHTML += `<h4>🔹 By Greedy Choice (Local Optimization) </h4>`;
  result.innerHTML += `<p>Coins used: ${steps.join(", ")}</p>`;
  result.innerHTML += `<p>Total coins = ${steps.length}</p>`;
  result.innerHTML += `<p><b>Local Choice:</b> Greedy picks the largest coin available at each step.</p>`;
  result.innerHTML += `<p><b>Note:</b> Works optimally only for <u>canonical</u> systems like [1,5,10,25].</p>`;

}

async function dpVisualization(amount, visual, result, denominations){
  result.innerHTML = `<p>🔸 Using <b>Dynamic Programming</b> (Optimal) Approach...</p>`;
  let dp = new Array(amount + 1).fill(Infinity);
  let parent = new Array(amount + 1).fill(-1);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (let coin of denominations) {
      if (i - coin >= 0 && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        parent[i] = coin;
      }
    }
  }

  let resCoins = [];
  let temp = amount;
  while (temp > 0 && parent[temp] !== -1) {
    resCoins.push(parent[temp]);
    temp -= parent[temp];
  }

  for (let coin of resCoins) {
    showCoin(visual, coin,"dp");
    await delay(450);
  }

  result.innerHTML += `<h4>🔸 By Dynamic Programming (Global Optimization)</h4>`;
  result.innerHTML += `<p>Coins used: ${resCoins.join(", ")}</p>`;
  result.innerHTML += `<p>Total coins = ${resCoins.length}</p>`;
  result.innerHTML += `<p><b>Global Optimization:</b> DP explores all subproblems to find the minimum number of coins.</p>`;
  result.innerHTML += `<p><b>Note:</b> Always optimal — even for <u>non-canonical</u> systems like [1,3,4].</p>`;

}

function showCoin(visual, value, algoType) {
  const coin = document.createElement("div");
  coin.classList.add("coin");
  coin.classList.add(algoType); // <-- new: color based on algorithm

  coin.innerHTML = `<svg width="40" height="40" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="200" stroke-width="12"/>
      <text x="50%" y="55%" text-anchor="middle" fill="#4e342e" font-size="130" font-family="Arial" dy=".3em">${value}</text>
    </svg>`;

  visual.appendChild(coin);
  setTimeout(() => coin.classList.add("used"), 150);
}

async function compareBoth() {
  const amount = parseInt(document.getElementById("amount").value);
  const system = document.getElementById("coinSystem").value;
  const visual = document.getElementById("visual");
  const result = document.getElementById("result");
  const denominations = getDenominations();

  visual.innerHTML = "";
  result.innerHTML = "";

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid positive amount.");
    return;
  }

  // Create two separate visual containers side by side
  const leftPanel = document.createElement("div");
  const rightPanel = document.createElement("div");
  leftPanel.classList.add("half-panel");
  rightPanel.classList.add("half-panel");
  visual.appendChild(leftPanel);
  visual.appendChild(rightPanel);

  const leftTitle = document.createElement("h3");
  leftTitle.textContent = "🟡 Greedy Choice (Local)";
  const rightTitle = document.createElement("h3");
  rightTitle.textContent = "🟢 Dynamic Programming (Global)";
  leftPanel.appendChild(leftTitle);
  rightPanel.appendChild(rightTitle);

  // Run both algorithms simultaneously
  greedyVisualization(amount, leftPanel, result, denominations);
  dpVisualization(amount, rightPanel, result, denominations);

  result.innerHTML = `
    <p>🔍 <b>Comparison Summary</b></p>
    <p>🟡 Greedy — makes local optimal choices at each step (fast but may fail for non-canonical).</p>
    <p>🟢 DP — finds the global optimum by exploring all subproblems.</p>
  `;
}
