document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const introScreen = document.getElementById('intro-screen');
  const animationScreen = document.getElementById('animation-screen');
  const weddingScreen = document.getElementById('wedding-screen');
  
  const guestNameInput = document.getElementById('guest-name');
  const btnOpenInvite = document.getElementById('btn-open-invite');
  const displayGuestName = document.getElementById('display-guest-name');
  
  const drawingSvg = document.getElementById('drawing-svg');
  const quoteContainer = document.getElementById('quote-container');
  const btnSkipAnim = document.getElementById('btn-skip-anim');
  
  const cardContainer = document.querySelector('.card-container');
  const myCard = document.getElementById('my-card');
  const waxSeal = document.getElementById('wax-seal');
  
  const bgMusic = document.getElementById('bg-music');
  bgMusic.volume = 0.15; // 降低背景音樂音量至 15% (較柔和)
  const btnPlayMusic = document.getElementById('btn-play-music');
  const petalContainer = document.getElementById('petal-container');
  
  let guestName = '貴賓';
  let animationTimer = null;
  let quoteTimers = [];

  // ==========================================
  // PAGE TRANSITION LOGIC
  // ==========================================
  
  // Transition: Intro -> Animation
  btnOpenInvite.addEventListener('click', () => {
    const inputVal = guestNameInput.value.trim();
    if (!inputVal) {
      alert('請輸入您的姓名，讓我們為您呈上專屬邀請卡 💖');
      guestNameInput.focus();
      return;
    }
    
    guestName = inputVal;
    displayGuestName.textContent = guestName;
    
    // Start playing background music (user gesture is captured here, ensuring playback)
    playMusic();
    
    // Transition Screen
    fadeScreen(introScreen, animationScreen, () => {
      startSvgAnimation();
    });
  });

  // Skip Animation Button
  btnSkipAnim.addEventListener('click', () => {
    skipAnimation();
  });

  // Helper: Fade between screens
  function fadeScreen(fromScreen, toScreen, callback) {
    fromScreen.classList.remove('active');
    setTimeout(() => {
      toScreen.classList.add('active');
      if (callback) callback();
    }, 800); // Match CSS screen fade transition duration
  }

  // ==========================================
  // SVG ANIMATION LOGIC
  // ==========================================
  
  function startSvgAnimation() {
    // Quote texts to display during drawing
    const quotes = [
      { text: "遇見你，是故事的開始...", time: 0 },
      { text: "相知相惜，許下相守的約定...", time: 2500 },
      { text: "今天，誠摯邀請您參與我們的幸福起點 💍", time: 4800 }
    ];
    
    // Reset SVG animation state
    drawingSvg.style.display = 'block';
    
    // Play quotes
    quotes.forEach((q) => {
      const timer = setTimeout(() => {
        showQuote(q.text);
      }, q.time);
      quoteTimers.push(timer);
    });

    // Auto transition to main card after drawing completes
    animationTimer = setTimeout(() => {
      transitionToCard();
    }, 7000); // 7 seconds total animation time
  }

  function showQuote(text) {
    quoteContainer.innerHTML = `<p class="quote-line">${text}</p>`;
    // Force reflow
    quoteContainer.offsetHeight;
    quoteContainer.querySelector('.quote-line').classList.add('show');
  }

  function skipAnimation() {
    // Clear all pending animation timers
    clearTimeout(animationTimer);
    quoteTimers.forEach(timer => clearTimeout(timer));
    quoteTimers = [];
    
    transitionToCard();
  }

  function transitionToCard() {
    fadeScreen(animationScreen, weddingScreen, () => {
      // Initialize petal generation on wedding screen
      startPetals();
    });
  }

  // ==========================================
  // 3D CARD INTERACTION LOGIC
  // ==========================================
  
  // Open / Close Card on click
  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent card body click from firing
    openCard();
  });

  myCard.addEventListener('click', () => {
    if (myCard.classList.contains('open-flap')) {
      closeCard();
    } else {
      openCard();
    }
  });

  function openCard() {
    cardContainer.classList.add('open-layout');
    myCard.classList.add('open-flap');
  }

  function closeCard() {
    // 同步移除排版位移與封面翻折狀態，使其順暢地移動/縮放回原位並合上
    cardContainer.classList.remove('open-layout');
    myCard.classList.remove('open-flap');
  }

  // ==========================================
  // BACKGROUND MUSIC LOGIC
  // ==========================================
  
  function playMusic() {
    bgMusic.play()
      .then(() => {
        btnPlayMusic.classList.add('playing');
        btnPlayMusic.setAttribute('title', '靜音');
      })
      .catch((error) => {
        console.log("Music play blocked or failed: ", error);
      });
  }

  function toggleMusic() {
    if (bgMusic.paused) {
      bgMusic.play();
      btnPlayMusic.classList.add('playing');
      btnPlayMusic.setAttribute('title', '靜音');
    } else {
      bgMusic.pause();
      btnPlayMusic.classList.remove('playing');
      btnPlayMusic.setAttribute('title', '播放音樂');
    }
  }

  btnPlayMusic.addEventListener('click', () => {
    toggleMusic();
  });

  // ==========================================
  // FLOATING FLOWER PETALS (MICRO-ANIMATION)
  // ==========================================
  
  function startPetals() {
    const petalCount = 25;
    for (let i = 0; i < petalCount; i++) {
      createPetal();
    }
  }

  function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // Random size between 8px and 16px
    const size = Math.random() * 8 + 8;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    
    // Random positions and delays
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.top = `-20px`;
    petal.style.opacity = Math.random() * 0.6 + 0.3;
    
    // Speed variations (animation duration between 6s and 12s)
    const duration = Math.random() * 6 + 6;
    petal.style.animationDuration = `${duration}s`;
    
    // Delay start
    petal.style.animationDelay = `${Math.random() * 8}s`;
    
    petalContainer.appendChild(petal);
    
    // Remove and recreate petal when animation ends to keep it looping infinitely
    petal.addEventListener('animationiteration', () => {
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.opacity = Math.random() * 0.6 + 0.3;
    });
  }
});
