// ============================================================
//  DECISION PILOT — Decision Duel Mini-Game
// ============================================================

const GAME_QUESTIONS = [
  { left: { emoji: '☕', label: 'Coffee', hint: 'Quick energy boost' }, right: { emoji: '🍵', label: 'Tea', hint: 'Steady calm focus' }, category: 'Lifestyle', correct: null },
  { left: { emoji: '🚗', label: 'Own Car', hint: 'Freedom & comfort' }, right: { emoji: '🚇', label: 'Public Transit', hint: 'Save & stress-free' }, category: 'Transport', correct: null },
  { left: { emoji: '🌅', label: 'Wake up Early', hint: '5 AM Club' }, right: { emoji: '🌙', label: 'Night Owl', hint: 'Deep work at 2 AM' }, category: 'Habits', correct: null },
  { left: { emoji: '📱', label: 'iPhone', hint: 'Apple ecosystem' }, right: { emoji: '🤖', label: 'Android', hint: 'Open & flexible' }, category: 'Tech', correct: null },
  { left: { emoji: '🏠', label: 'Work from Home', hint: 'Zero commute' }, right: { emoji: '🏢', label: 'Office', hint: 'Team energy' }, category: 'Career', correct: null },
  { left: { emoji: '📚', label: 'Read Books', hint: 'Deep knowledge' }, right: { emoji: '🎧', label: 'Podcasts', hint: 'Learn while moving' }, category: 'Learning', correct: null },
  { left: { emoji: '💰', label: 'Save Money', hint: 'Secure future' }, right: { emoji: '✈️', label: 'Travel Now', hint: 'Live the moment' }, category: 'Finance', correct: null },
  { left: { emoji: '🧘', label: 'Yoga', hint: 'Mind & body' }, right: { emoji: '🏋️', label: 'Gym', hint: 'Pure strength' }, category: 'Health', correct: null },
  { left: { emoji: '🍕', label: 'Pizza', hint: 'Classic comfort' }, right: { emoji: '🍣', label: 'Sushi', hint: 'Fresh & light' }, category: 'Food', correct: null },
  { left: { emoji: '🎮', label: 'Gaming', hint: 'Adventure & thrill' }, right: { emoji: '🎨', label: 'Creative Art', hint: 'Express yourself' }, category: 'Hobby', correct: null },
  { left: { emoji: '🐕', label: 'Dog', hint: 'Loyal companion' }, right: { emoji: '🐈', label: 'Cat', hint: 'Independent & cool' }, category: 'Pets', correct: null },
  { left: { emoji: '🌆', label: 'City Life', hint: 'Fast & vibrant' }, right: { emoji: '🌳', label: 'Countryside', hint: 'Peaceful & slow' }, category: 'Lifestyle', correct: null },
  { left: { emoji: '📺', label: 'Netflix', hint: 'Binge weekend' }, right: { emoji: '📖', label: 'Read', hint: 'Grow your mind' }, category: 'Evening', correct: null },
  { left: { emoji: '🎵', label: 'Music', hint: 'Universal language' }, right: { emoji: '🤫', label: 'Silence', hint: 'Pure focus' }, category: 'Work style', correct: null },
  { left: { emoji: '🏊', label: 'Swimming', hint: 'Full body flow' }, right: { emoji: '🚴', label: 'Cycling', hint: 'Explore outdoors' }, category: 'Sport', correct: null },
];

class DecisionDuel {
  constructor() {
    this.questions = this.shuffle([...GAME_QUESTIONS]);
    this.currentIdx = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.results = [];
    this.totalQuestions = 10;
    this.timePerQuestion = 7; // seconds
    this.timer = null;
    this.timeLeft = this.timePerQuestion;
    this.answered = false;

    this.bindElements();
    this.startQuestion();
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  bindElements() {
    this.leftCard  = document.getElementById('game-card-left');
    this.rightCard = document.getElementById('game-card-right');
    this.scoreEl   = document.getElementById('game-score');
    this.streakEl  = document.getElementById('game-streak');
    this.timerEl   = document.getElementById('game-timer');
    this.timerBar  = document.getElementById('timer-bar-fill');
    this.feedbackEl = document.getElementById('game-feedback');
    this.progressEl = document.getElementById('game-progress');
    this.gameArea   = document.getElementById('game-play-area');
    this.gameOverCard = document.getElementById('game-over-card');
    this.finalScoreEl = document.getElementById('final-score');
    this.finalStreakEl = document.getElementById('final-streak');
    this.gradeEl = document.getElementById('final-grade');
    this.gradeTextEl = document.getElementById('grade-text');

    this.leftCard.addEventListener('click', () => this.choose('left'));
    this.rightCard.addEventListener('click', () => this.choose('right'));

    this.renderProgress();
  }

  renderProgress() {
    this.progressEl.innerHTML = '';
    for (let i = 0; i < this.totalQuestions; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      if (i < this.results.length) {
        dot.classList.add(this.results[i] ? 'correct' : 'wrong');
      }
      this.progressEl.appendChild(dot);
    }
  }

  startQuestion() {
    if (this.currentIdx >= this.totalQuestions) {
      this.showGameOver();
      return;
    }
    this.answered = false;
    this.timeLeft = this.timePerQuestion;

    const q = this.questions[this.currentIdx];
    this.renderCard(this.leftCard, q.left, 'left');
    this.renderCard(this.rightCard, q.right, 'right');

    // Set category
    this.leftCard.querySelector('.game-category-badge').textContent = q.category;
    this.rightCard.querySelector('.game-category-badge').textContent = q.category;

    // Reset styles
    this.leftCard.classList.remove('chosen-correct', 'chosen-wrong');
    this.rightCard.classList.remove('chosen-correct', 'chosen-wrong');

    this.startTimer();
    this.updateHUD();
  }

  renderCard(cardEl, data, side) {
    cardEl.querySelector('.game-card-emoji').textContent = data.emoji;
    cardEl.querySelector('.game-card-label').textContent = data.label;
    cardEl.querySelector('.game-card-hint').textContent  = data.hint;
  }

  startTimer() {
    clearInterval(this.timer);
    this.timerBar.classList.remove('urgent');
    this.timer = setInterval(() => {
      this.timeLeft -= 0.1;
      const pct = (this.timeLeft / this.timePerQuestion) * 100;
      this.timerBar.style.width = Math.max(0, pct) + '%';
      this.timerEl.textContent = Math.max(0, Math.ceil(this.timeLeft)) + 's';

      if (this.timeLeft <= 2) this.timerBar.classList.add('urgent');

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        if (!this.answered) this.timeOut();
      }
    }, 100);
  }

  timeOut() {
    this.answered = true;
    this.streak = 0;
    this.results.push(false);
    this.showFeedback('⏰');
    this.renderProgress();
    this.updateHUD();
    setTimeout(() => {
      this.currentIdx++;
      this.startQuestion();
    }, 900);
  }

  choose(side) {
    if (this.answered) return;
    this.answered = true;
    clearInterval(this.timer);

    const q = this.questions[this.currentIdx];
    // In this game, any choice is "correct" — it's about decisiveness!
    // We award points for speed and streak
    const speedBonus = Math.floor(this.timeLeft * 10);
    const correct = true; // Every choice is valid — decisive wins!

    this.score += 10 + speedBonus;
    this.streak++;
    this.maxStreak = Math.max(this.maxStreak, this.streak);
    this.results.push(correct);

    const chosenCard = side === 'left' ? this.leftCard : this.rightCard;
    chosenCard.classList.add('chosen-correct');
    this.showFeedback('✅');

    if (this.streak >= 3) {
      this.showCombo(this.streak);
    }

    this.renderProgress();
    this.updateHUD();

    setTimeout(() => {
      this.currentIdx++;
      this.startQuestion();
    }, 800);
  }

  showFeedback(emoji) {
    this.feedbackEl.textContent = emoji;
    this.feedbackEl.classList.remove('show');
    void this.feedbackEl.offsetWidth;
    this.feedbackEl.classList.add('show');
    setTimeout(() => this.feedbackEl.classList.remove('show'), 700);
  }

  showCombo(streak) {
    const div = document.createElement('div');
    div.className = 'combo-flash';
    div.textContent = `🔥 ${streak}x Combo!`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 900);
  }

  updateHUD() {
    this.scoreEl.textContent  = `Score: ${this.score}`;
    this.streakEl.textContent = `Streak: ${this.streak} 🔥`;
    this.timerEl.textContent  = Math.max(0, Math.ceil(this.timeLeft)) + 's';
  }

  showGameOver() {
    clearInterval(this.timer);
    this.gameArea.style.display = 'none';
    this.gameOverCard.classList.add('show');

    this.finalScoreEl.textContent = this.score;
    this.finalStreakEl.textContent = `Best Streak: ${this.maxStreak} 🔥`;

    const correct = this.results.filter(Boolean).length;
    const grade = correct >= 9 ? '🏆 Decisive Master' :
                  correct >= 7 ? '⚡ Quick Thinker' :
                  correct >= 5 ? '🎯 Getting There' : '🐢 Keep Practicing';
    const gradeText = correct >= 9 ? 'You make decisions instantly — a true pilot!' :
                      correct >= 7 ? 'Sharp and fast. Just a bit more confidence!' :
                      correct >= 5 ? 'Warming up. Practice builds decisiveness!' :
                      'Hesitation is the enemy of progress. Try again!';

    this.gradeEl.textContent     = grade;
    this.gradeTextEl.textContent = gradeText;

    // Animate score counting
    this.animateCount(this.finalScoreEl, 0, this.score, 800);
  }

  animateCount(el, from, to, duration) {
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(from + (to - from) * progress);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  restart() {
    this.questions = this.shuffle([...GAME_QUESTIONS]);
    this.currentIdx = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.results = [];
    this.answered = false;

    this.gameOverCard.classList.remove('show');
    this.gameArea.style.display = '';

    this.renderProgress();
    this.startQuestion();
  }
}

// Exposed to window for HTML calls
window.DecisionDuel = DecisionDuel;
