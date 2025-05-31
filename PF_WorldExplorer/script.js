const app = document.getElementById('app');

// Initial render (Explore by default)
renderExplore();

document.getElementById('exploreBtn').addEventListener('click', renderExplore);
document.getElementById('quizBtn').addEventListener('click', renderQuiz);
document.getElementById('factQuizBtn').addEventListener('click', renderFactQuiz);
document.getElementById('leaderboardBtn').addEventListener('click', () => renderLeaderboard(false, 'flag'));

function renderExplore() {
  app.innerHTML = `
    <h2>Explore Countries</h2>
    <input type="text" id="searchInput" placeholder="Enter country name..." />
    <button id="searchBtn">Search</button>
    <div id="countryInfo"></div>
  `;

  document.getElementById('searchBtn').addEventListener('click', async () => {
    const name = document.getElementById('searchInput').value.trim();
    if (!name) return;

    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);
      const data = await res.json();

      if (data.status === 404 || !data.length) {
        document.getElementById('countryInfo').innerHTML = `<p>Country not found!</p>`;
        return;
      }

      const country = data[0];
      document.getElementById('countryInfo').innerHTML = `
        <h3>${country.name.common}</h3>
        <img src="${country.flags.svg}" width="150" />
        <p><strong>Capital:</strong> ${country.capital?.[0]}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(', ')}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      `;
    } catch (error) {
      document.getElementById('countryInfo').innerHTML = `<p>Error fetching data.</p>`;
    }
  });
}

function renderQuiz() {
  app.innerHTML = `
    <h2>Flag Quiz</h2>
    <div id="quizContainer">
      <p id="progressText"></p>
      <div id="progressBar"><div id="progressFill"></div></div>
      <div id="flagDisplay"></div>
      <div id="options"></div>
      <p id="result"></p>
      <button id="nextBtn">Next</button>
      <p>Score: <span id="score">0</span></p>
    </div>
  `;

  let currentScore = 0;
  let currentQuestion = 0;
  const maxQuestions = 10;
  let countries = [];

  fetch('https://restcountries.com/v3.1/all')
    .then(res => res.json())
    .then(data => {
      countries = data;
      loadQuestion();
    });

  function loadQuestion() {
    if (currentQuestion >= maxQuestions) {
      submitScore(currentScore, maxQuestions, "flag");
      return;
    }

    currentQuestion++;
    document.getElementById('result').textContent = '';
    document.getElementById('options').innerHTML = '';

    document.getElementById('progressText').textContent = `Question ${currentQuestion} of ${maxQuestions}`;
    const progressPercent = (currentQuestion / maxQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;

    const choices = [];
    while (choices.length < 4) {
      const random = countries[Math.floor(Math.random() * countries.length)];
      if (random.name && random.flags && !choices.includes(random)) {
        choices.push(random);
      }
    }

    const correct = choices[Math.floor(Math.random() * choices.length)];

    document.getElementById('flagDisplay').innerHTML = `
      <img src="${correct.flags.svg}" alt="Flag" width="200">
    `;

    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.textContent = choice.name.common;
      btn.addEventListener('click', () => {
        if (choice.name.common === correct.name.common) {
          document.getElementById('result').textContent = '✅ Correct!';
          currentScore++;
          document.getElementById('score').textContent = currentScore;
        } else {
          document.getElementById('result').textContent = `❌ Wrong! It's ${correct.name.common}`;
        }
        Array.from(document.getElementById('options').children).forEach(b => b.disabled = true);
      });
      document.getElementById('options').appendChild(btn);
    });
  }

  document.getElementById('nextBtn').addEventListener('click', () => {
    loadQuestion();
  });
}

function renderFactQuiz() {
  app.innerHTML = `
    <h2>Fact Quiz</h2>
    <div id="factQuizContainer">
      <p id="factQuestion"></p>
      <div id="factOptions"></div>
      <p id="factResult"></p>
      <button id="nextFactBtn">Next</button>
      <p>Score: <span id="factScore">0</span></p>
    </div>
  `;

  let score = 0;
  let questionIndex = 0;
  const maxQuestions = 10;
  let countries = [];

  fetch('https://restcountries.com/v3.1/all')
    .then(res => res.json())
    .then(data => {
      countries = data;
      loadFactQuestion();
    });

  function loadFactQuestion() {
    if (questionIndex >= maxQuestions) {
      submitScore(score, maxQuestions, "fact");
      return;
    }

    questionIndex++;
    document.getElementById('factResult').textContent = '';
    document.getElementById('factOptions').innerHTML = '';

    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const questionType = ['capital', 'region', 'language'][Math.floor(Math.random() * 3)];

    let questionText = '';
    let correctAnswer = '';
    let allOptions = [];

    if (questionType === 'capital' && randomCountry.capital) {
      questionText = `What is the capital of ${randomCountry.name.common}?`;
      correctAnswer = randomCountry.capital[0];
      allOptions = countries
        .filter(c => c.capital && c.capital[0] !== correctAnswer)
        .slice(0, 10)
        .map(c => c.capital[0]);
    } else if (questionType === 'region') {
      questionText = `Which region is ${randomCountry.name.common} in?`;
      correctAnswer = randomCountry.region;
      allOptions = ['Europe', 'Asia', 'Africa', 'Americas', 'Oceania', 'Antarctic']
        .filter(r => r !== correctAnswer)
        .slice(0, 3);
    } else {
      const langs = randomCountry.languages ? Object.values(randomCountry.languages) : null;
      if (!langs || langs.length === 0) return loadFactQuestion();
      correctAnswer = langs[0];
      questionText = `Which language is spoken in ${randomCountry.name.common}?`;
      const usedLangs = new Set(langs);
      allOptions = countries
        .map(c => c.languages && Object.values(c.languages)[0])
        .filter(l => l && !usedLangs.has(l))
        .slice(0, 10);
    }

    const options = [...allOptions.slice(0, 3), correctAnswer].sort(() => Math.random() - 0.5);

    document.getElementById('factQuestion').textContent = questionText;

    options.forEach(option => {
      const btn = document.createElement('button');
      btn.textContent = option;
      btn.addEventListener('click', () => {
        if (option === correctAnswer) {
          document.getElementById('factResult').textContent = '✅ Correct!';
          score++;
          document.getElementById('factScore').textContent = score;
        } else {
          document.getElementById('factResult').textContent = `❌ Wrong! Answer: ${correctAnswer}`;
        }
        Array.from(document.getElementById('factOptions').children).forEach(b => b.disabled = true);
      });
      document.getElementById('factOptions').appendChild(btn);
    });
  }

  document.getElementById('nextFactBtn').addEventListener('click', () => {
    loadFactQuestion();
  });
}

function submitScore(score, total, mode = "flag") {
  const name = prompt(`Quiz complete! You scored ${score}/${total}. Enter your initials:`)?.substring(0, 3).toUpperCase();
  if (name) {
    const key = mode === "fact" ? 'factLeaderboard' : 'leaderboard';
    const scoreData = JSON.parse(localStorage.getItem(key)) || [];
    scoreData.push({ name, score });
    localStorage.setItem(key, JSON.stringify(scoreData));
    alert('Score submitted!');
    renderLeaderboard(true, mode);
  }
}

function renderLeaderboard(showRestart = false, mode = "flag") {
  const title = mode === "fact" ? "Fact Quiz Leaderboard" : "Flag Quiz Leaderboard";
  app.innerHTML = `
    <h2>${title}</h2>
    <div id="leaderboardToggle" class="leaderboard-tabs"></div>
    <div id="leaderboardList"></div>
  `;

  const flagTab = document.createElement('button');
  flagTab.textContent = '🏁 Flag Quiz';
  flagTab.className = mode === 'flag' ? 'active-tab' : '';
  flagTab.addEventListener('click', () => renderLeaderboard(showRestart, 'flag'));

  const factTab = document.createElement('button');
  factTab.textContent = '📘 Fact Quiz';
  factTab.className = mode === 'fact' ? 'active-tab' : '';
  factTab.addEventListener('click', () => renderLeaderboard(showRestart, 'fact'));

  const toggleContainer = document.getElementById('leaderboardToggle');
  toggleContainer.appendChild(flagTab);
  toggleContainer.appendChild(factTab);

  const key = mode === "fact" ? 'factLeaderboard' : 'leaderboard';
  const leaderboard = JSON.parse(localStorage.getItem(key)) || [];

  leaderboard.sort((a, b) => b.score - a.score);

  const list = leaderboard
    .slice(0, 10)
    .map((entry, index) => `<p>${index + 1}. ${entry.name} – ${entry.score}</p>`)
    .join('');

  document.getElementById('leaderboardList').innerHTML = leaderboard.length
    ? list
    : `<p>No scores yet.</p>`;

  const btnContainer = document.createElement('div');
  btnContainer.style.marginTop = '1rem';

  const backBtn = document.createElement('button');
  backBtn.textContent = 'Back to Home';
  backBtn.addEventListener('click', renderExplore);
  btnContainer.appendChild(backBtn);

  if (showRestart) {
    const restartBtn = document.createElement('button');
    restartBtn.textContent = mode === "fact" ? 'Restart Fact Quiz' : 'Restart Flag Quiz';
    restartBtn.addEventListener('click', () => {
      mode === "fact" ? renderFactQuiz() : renderQuiz();
    });
    btnContainer.appendChild(restartBtn);
  }

  document.getElementById('leaderboardList').appendChild(btnContainer);
}
