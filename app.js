document.getElementById("startBtn").addEventListener("click", startVisualization);

const denominations = [25, 10, 5, 1]; // You can change this to [10, 5, 2, 1] for INR

function startVisualization() {
  const algo = document.getElementById("algorithm").value;
  const amount = parseInt(document.getElementById("amount").value);
  const visual = document.getElementById("visual");
  const result = document.getElementById("result");

  visual.innerHTML = "";
  result.innerHTML = "";

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid positive amount.");
    return;
  }

  if (algo === "greedy") {
    greedyVisualization(amount, visual, result);
  } else {
    dpVisualization(amount, visual, result);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function greedyVisualization(amount, visual, result) {
  let remaining = amount;
  let steps = [];
  result.innerHTML = `<p>🔹 Using <b>Greedy Choice</b> Algorithm...</p>`;

  for (let coin of denominations) {
    while (remaining >= coin) {
      remaining -= coin;
      steps.push(coin);
      showCoin(visual, coin);
      await delay(450);
    }
  }

  result.innerHTML += `<p>Coins used: ${steps.join(", ")}</p>`;
  result.innerHTML += `<p>Total coins = ${steps.length}</p>`;
}

async function dpVisualization(amount, visual, result) {
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
    showCoin(visual, coin);
    await delay(450);
  }

  result.innerHTML += `<p>Coins used: ${resCoins.join(", ")}</p>`;
  result.innerHTML += `<p>Total coins = ${resCoins.length}</p>`;
}

function showCoin(visual, value) {
  const coin = document.createElement("div");
  coin.classList.add("coin");
  coin.innerHTML = `<svg width="40" height="40" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="200" fill="#ffca28" stroke="#f57f17" stroke-width="12"/>
      <text x="50%" y="55%" text-anchor="middle" fill="#6d4c41" font-size="130" font-family="Arial" dy=".3em">${value}</text>
    </svg>`;
  visual.appendChild(coin);
  setTimeout(() => coin.classList.add("used"), 150);
}
