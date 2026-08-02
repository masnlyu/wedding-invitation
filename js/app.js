document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. DOM ELEMENTS
  // ==========================================
  const envelopeSection = document.getElementById('envelope-section');
  const magazineSection = document.getElementById('magazine-section');
  
  const envelope3D = document.getElementById('envelope-3d');
  const coverGuestName = document.getElementById('cover-guest-name');
  const waxSealContainer = document.getElementById('wax-seal-container');
  const waxSeal = document.getElementById('wax-seal');
  
  const bgMusic = document.getElementById('bg-music');
  bgMusic.volume = 0.18; // 設置背景音樂音量為 18% (柔和背景音)
  const btnMusicToggle = document.getElementById('btn-music-toggle');
  
  const magazineBook = document.getElementById('magazine-book');
  const pages = Array.from(document.querySelectorAll('.magazine-page'));
  const btnPrevPage = document.getElementById('btn-prev-page');
  const btnNextPage = document.getElementById('btn-next-page');
  
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpName = document.getElementById('rsvp-name');
  const rsvpAttend = document.getElementById('rsvp-attend');
  const groupGuestsCount = document.getElementById('group-guests-count');
  const groupDiet = document.getElementById('group-diet');
  const successModal = document.getElementById('success-modal');
  const successMessage = document.getElementById('success-message');
  
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  const petalContainer = document.getElementById('petal-container');
  const swipeHint = document.getElementById('swipe-hint');
  
  let guestName = '貴賓';
  let currentPageIndex = 0;
  
  // ==========================================
  // 2. PARSE GUEST NAME FROM URL
  // ==========================================
  // 支援從網址 URL 帶入賓客姓名，例如：?name=王小明 或 ?to=李華
  const urlParams = new URLSearchParams(window.location.search);
  const guestNameParam = urlParams.get('name') || urlParams.get('to') || '貴賓';
  guestName = guestNameParam;
  if (coverGuestName) {
    coverGuestName.textContent = guestName;
  }
  rsvpName.value = guestName; // 自動填入 RSVP 表單的姓名
  
  // ==========================================
  // 3. ENVELOPE OPENING & EXTRACT CARDS
  // ==========================================
  waxSeal.addEventListener('click', () => {
    // 1. 火漆印章淡出
    waxSealContainer.classList.add('fade-out');
    
    // 2. 嘗試播放背景音樂 (獲得使用者點擊手勢)
    playBackgroundMusic();
    
    // 3. 打開信封
    setTimeout(() => {
      envelope3D.classList.add('open');
    }, 300);
    
    // 4. 信封打開後，直接淡出並切換到雜誌封面頁 (縮短等待時間)
    setTimeout(() => {
      envelopeSection.classList.remove('active');
      magazineSection.classList.add('active');
      updatePagesLayout();
    }, 1200); // 1.2秒內完成掀蓋與流暢轉場
  });
  
  // ==========================================
  // 4. MUSIC CONTROL
  // ==========================================
  function playBackgroundMusic() {
    bgMusic.play()
      .then(() => {
        btnMusicToggle.classList.add('playing');
        btnMusicToggle.setAttribute('title', '靜音');
      })
      .catch(err => {
        console.log("Music auto-play was blocked or failed:", err);
      });
  }
  
  btnMusicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      btnMusicToggle.classList.add('playing');
      btnMusicToggle.setAttribute('title', '靜音');
    } else {
      bgMusic.pause();
      btnMusicToggle.classList.remove('playing');
      btnMusicToggle.setAttribute('title', '播放音樂');
    }
  });

  // ==========================================
  // 5. MAGAZINE SLIDE SYSTEM (DECK CONTROLLER)
  // ==========================================
  
  function updatePagesLayout() {
    pages.forEach((page, i) => {
      page.classList.remove('active', 'prev', 'next');
      if (i === currentPageIndex) {
        page.classList.add('active');
      } else if (i < currentPageIndex) {
        page.classList.add('prev');
      } else {
        page.classList.add('next');
      }
    });
    
    // 更新箭頭按鈕狀態
    btnPrevPage.disabled = (currentPageIndex === 0);
    btnNextPage.disabled = (currentPageIndex === pages.length - 1);
  }
  
  function goToPage(index) {
    if (index >= 0 && index < pages.length) {
      currentPageIndex = index;
      updatePagesLayout();
      
      // 當翻到最後一頁 (RSVP) 時隱藏滑動提示，其他頁面顯示
      if (swipeHint) {
        if (currentPageIndex === pages.length - 1) {
          swipeHint.classList.remove('show');
        } else {
          swipeHint.classList.add('show');
        }
      }
    }
  }
  
  btnPrevPage.addEventListener('click', () => {
    goToPage(currentPageIndex - 1);
  });
  
  btnNextPage.addEventListener('click', () => {
    goToPage(currentPageIndex + 1);
  });
  
  // 初始化呼叫
  updatePagesLayout();
  
  // ==========================================
  // 6. SWIPE GESTURE SUPPORT (MOBILE)
  // ==========================================
  let touchStartX = 0;
  let touchEndX = 0;
  
  magazineBook.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  magazineBook.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  }, { passive: true });
  
  function handleSwipeGesture() {
    const swipeThreshold = 50; // 滑動門檻 (px)
    const deltaX = touchEndX - touchStartX;
    
    if (deltaX < -swipeThreshold) {
      // 向左滑動 -> 下一頁
      goToPage(currentPageIndex + 1);
    } else if (deltaX > swipeThreshold) {
      // 向右滑動 -> 上一頁
      goToPage(currentPageIndex - 1);
    }
  }
  
  // 支援鍵盤左右鍵翻頁
  document.addEventListener('keydown', (e) => {
    if (magazineSection.classList.contains('active')) {
      if (e.key === 'ArrowRight') {
        goToPage(currentPageIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        goToPage(currentPageIndex - 1);
      }
    }
  });

  // ==========================================
  // 7. LIGHTBOX (ZOOM PHOTO)
  // ==========================================
  window.openLightbox = function(src) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    // 強制重繪以實現動畫
    lightbox.offsetHeight;
    lightbox.classList.add('active');
  };
  
  window.closeLightbox = function() {
    lightbox.classList.remove('active');
    setTimeout(() => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
    }, 400);
  };
  
  // ==========================================
  // 8. RSVP FORM INTERACTIONS & CONFETTI
  // ==========================================
  
  // 當選擇不克出席時，動態隱藏出席人數與飲食禁忌，保持介面簡潔
  rsvpAttend.addEventListener('change', (e) => {
    if (e.target.value === 'no') {
      groupGuestsCount.style.display = 'none';
      groupDiet.style.display = 'none';
    } else {
      groupGuestsCount.style.display = 'block';
      groupDiet.style.display = 'block';
    }
  });
  
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = rsvpName.value.trim();
    const phone = document.getElementById('rsvp-phone').value.trim();
    const attend = rsvpAttend.value;
    const blessing = document.getElementById('rsvp-blessing').value.trim();
    
    // 1. 建立 FormData 用於傳送至 Google 表單
    const formData = new FormData();
    formData.append('entry.698832185', name);
    formData.append('entry.1159994414', phone);
    
    // 對應出席意願
    const attendText = attend === 'yes' ? '馨香出席' : '祝賀滿滿 (不克出席)';
    formData.append('entry.1842321988', attendText);
    
    // 對應出席人數與飲食需求
    if (attend === 'yes') {
      const guestsVal = document.getElementById('rsvp-guests').value;
      let guestsText = '1人';
      if (guestsVal === '2') guestsText = '2人';
      else if (guestsVal === '3') guestsText = '3人';
      else if (guestsVal === '4') guestsText = '4人';
      else if (guestsVal === '5') guestsText = '5人以上';
      
      const diet = document.getElementById('rsvp-diet').value.trim();
      
      formData.append('entry.347691862', guestsText);
      formData.append('entry.2057224347', diet);
    } else {
      formData.append('entry.347691862', '');
      formData.append('entry.2057224347', '');
    }
    
    formData.append('entry.1566488222', blessing);
    
    // 2. 送出至 Google 表單 (no-cors 模式)
    fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSdfwVYmMdzB_6i3ceT3kzmkTyNyYhEd_ibhX8DcWrjQ6n54ZQ/formResponse', {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
    .then(() => {
      console.log('RSVP submitted successfully to Google Form.');
    })
    .catch((err) => {
      console.error('Error submitting RSVP:', err);
    });

    // 3. 顯示前端成功彈窗
    if (attend === 'yes') {
      const guestsVal = document.getElementById('rsvp-guests').value;
      successMessage.innerHTML = `親愛的 <strong>${name}</strong>，<br>已為您登記 <strong>${guestsVal} 位</strong> 出席！<br>期待在婚宴上與您共同見證這份幸福 💍`;
    } else {
      successMessage.innerHTML = `親愛的 <strong>${name}</strong>，<br>已收到您的祝賀！<br>雖然您不克前往，但您的溫馨祝福我們已深深刻在心裡 🌸`;
    }
    
    successModal.style.display = 'flex';
    setTimeout(() => {
      successModal.classList.add('active');
    }, 50);
    
    // 觸發粒子拉炮效果
    createConfettiBurst();
  });
  
  window.closeSuccessModal = function() {
    successModal.classList.remove('active');
    setTimeout(() => {
      successModal.style.display = 'none';
      rsvpForm.reset();
      // 重置欄位顯示狀態
      groupGuestsCount.style.display = 'block';
      groupDiet.style.display = 'block';
      // 返回第一頁封面
      goToPage(0);
    }, 400);
  };
  
  // 純前端粒子噴灑效果 (Confetti)
  function createConfettiBurst() {
    const particleCount = 60;
    const colors = ['#C5A059', '#EADCB9', '#9B1C31', '#fcc9d5', '#5B5750'];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = `${Math.random() * 8 + 4}px`;
      particle.style.height = `${Math.random() * 12 + 6}px`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = '50vw';
      particle.style.top = '50vh';
      particle.style.borderRadius = '2px';
      particle.style.zIndex = '300';
      particle.style.pointerEvents = 'none';
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 15 + 10;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity - 5; // 給予向上的初速
      let posX = window.innerWidth / 2;
      let posY = window.innerHeight / 2;
      
      document.body.appendChild(particle);
      
      function updateParticle() {
        vy += 0.5; // 重力加速度
        vx *= 0.98; // 空氣阻力
        posX += vx;
        posY += vy;
        
        particle.style.transform = `translate3d(${posX - window.innerWidth / 2}px, ${posY - window.innerHeight / 2}px, 0) rotate(${posX}deg)`;
        
        if (posY < window.innerHeight && posX > 0 && posX < window.innerWidth) {
          requestAnimationFrame(updateParticle);
        } else {
          particle.remove();
        }
      }
      
      requestAnimationFrame(updateParticle);
    }
  }

  // ==========================================
  // 9. FLOATING FLOWER PETALS (INFINITE LOOP)
  // ==========================================
  function startPetals() {
    const petalCount = 18;
    for (let i = 0; i < petalCount; i++) {
      createPetal();
    }
  }

  function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    const size = Math.random() * 8 + 8;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    
    resetPetalPosition(petal);
    
    // 隨機動畫延遲與速度
    petal.style.animationDuration = `${Math.random() * 6 + 6}s`;
    petal.style.animationDelay = `${Math.random() * 8}s`;
    
    petalContainer.appendChild(petal);
    
    // 當動畫跑完一個循環，重新給予位置
    petal.addEventListener('animationiteration', () => {
      resetPetalPosition(petal);
    });
  }
  
  function resetPetalPosition(petal) {
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.top = `-20px`;
    petal.style.opacity = Math.random() * 0.5 + 0.3;
  }
  
  // 啟動花瓣飄落
  startPetals();
});
