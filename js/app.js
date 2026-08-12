document.addEventListener('DOMContentLoaded', () => {
  // 偵測是否為行動裝置
  const isMobile = window.innerWidth <= 480 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // ==========================================
  // 1. DOM ELEMENTS
  // ==========================================
  const magazineSection = document.getElementById('magazine-section');
  const bgMusic = document.getElementById('bg-music');
  const btnMusicToggle = document.getElementById('btn-music-toggle');
  
  if (isMobile) {
    if (bgMusic) bgMusic.remove(); // 手機版移除音樂標籤以防請求與播放限制
    if (btnMusicToggle) btnMusicToggle.style.display = 'none'; // 手機版隱藏音樂按鈕
  } else {
    if (bgMusic) {
      bgMusic.src = "assets/eternal_vows.webm";
      bgMusic.volume = 0.18; // 設置背景音樂音量為 18% (柔和背景音)
    }
  }
  
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
  
  let guestName = '';
  let currentPageIndex = 0;
  
  // ==========================================
  // 2. PARSE GUEST NAME FROM URL
  // ==========================================
  // 支援從網址 URL 帶入賓客姓名，例如：?name=王小明 或 ?to=李華
  const urlParams = new URLSearchParams(window.location.search);
  const guestNameParam = urlParams.get('name') || urlParams.get('to') || '貴賓';
  guestName = guestNameParam;
  
  rsvpName.value = ''; // 預設空值，由賓客自行填寫
  
  // ==========================================
  // 3. LOADING SEQUENCE (Fake Timer)
  // ==========================================
  function startLoadingSequence() {
    const loadingPercentage = document.getElementById('loading-percentage');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const loadingSection = document.getElementById('loading-section');
    
    let progress = 0;
    const duration = 2000; // 模擬 2.0 秒的載入時間
    const interval = 30;
    const steps = duration / interval;
    const increment = 100 / steps;
    
    const loadingTimer = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadingTimer);
        
        // 載入完成，交接至雜誌頁
        setTimeout(() => {
          loadingSection.style.transition = 'opacity 1s ease-in-out';
          loadingSection.style.opacity = '0';
          
          magazineSection.classList.add('active');
          updatePagesLayout();
          
          playBackgroundMusic();
          
          setTimeout(() => {
            loadingSection.classList.remove('active');
            loadingSection.style.display = 'none';
          }, 1000);
        }, 500); // 100% 後稍微停留 0.5 秒
      }
      
      // 更新文字與進度條
      if (loadingPercentage) {
        loadingPercentage.textContent = `${Math.floor(progress)}%`;
      }
      if (progressBarFill) {
        progressBarFill.style.width = `${progress}%`;
      }
    }, interval);
  }
  
  // 網頁載入後稍等 0.2 秒開始動畫
  setTimeout(startLoadingSequence, 500);
  
  // ==========================================
  // 4. MUSIC CONTROL
  // ==========================================
  function playBackgroundMusic() {
    if (isMobile || !bgMusic || !document.getElementById('bg-music')) return; // 手機版或音樂標籤被移除時不執行播放
    
    bgMusic.play()
      .then(() => {
        if (btnMusicToggle) {
          btnMusicToggle.classList.add('playing');
          btnMusicToggle.setAttribute('title', '靜音');
        }
      })
      .catch(err => {
        console.log("Music auto-play was blocked or failed:", err);
      });
  }
  
  if (btnMusicToggle) {
    btnMusicToggle.addEventListener('click', () => {
      if (isMobile || !bgMusic || !document.getElementById('bg-music')) return;
      
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
  }

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
  
  let isFlipping = false;

  function goToPage(index) {
    if (isFlipping) return; // 當動畫還沒完成時，拒絕下一次滑動/翻頁觸發，防止快速連擊導致樣式異常
    
    if (index >= 0 && index < pages.length && index !== currentPageIndex) {
      isFlipping = true;
      const oldIndex = currentPageIndex;
      const direction = index > oldIndex ? 'forward' : 'backward';
      
      // 在觸發翻頁的書頁上加上動畫類以觸發 3D 抬起特效
      if (direction === 'forward') {
        pages[oldIndex].classList.add('flip-forward');
      } else {
        pages[index].classList.add('flip-backward');
      }
      
      currentPageIndex = index;
      updatePagesLayout();
            // 動態調整滑動提示
        if (swipeHint) {
          const textSpan = swipeHint.querySelector('span:first-child');
          const arrowSpan = swipeHint.querySelector('.arrow');
          
          if (currentPageIndex === pages.length - 1) {
            // 最後一頁提示向右滑動
            textSpan.textContent = '向右滑動翻頁';
            arrowSpan.textContent = '←';
          } else {
            // 其他頁提示向左滑動
            textSpan.textContent = '向左滑動翻頁';
            arrowSpan.textContent = '➔';
          }
        }
      
      // 依據翻頁方向（下一頁 1.8 秒，上一頁 1.2 秒）動態移除動畫類別，還原靜態樣式
      const animDuration = direction === 'forward' ? 1800 : 1200;
      setTimeout(() => {
        if (direction === 'forward') {
          pages[oldIndex].classList.remove('flip-forward');
        } else {
          pages[index].classList.remove('flip-backward');
        }
      }, animDuration);

      // 當翻動頁面已翻轉過垂直中線、從畫面中不可見時即可提早解鎖（下一頁 900ms，上一頁 700ms），大幅提升連續操作的流暢度
      const unlockDuration = direction === 'forward' ? 900 : 700;
      setTimeout(() => {
        isFlipping = false; // 提早解鎖
      }, unlockDuration);
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
    const deltaX = touchEndX - touchStartX;
    const swipeThresholdLeft = 45;   // 向左滑動 (下一頁) 門檻 (px)
    const swipeThresholdRight = 25;  // 向右滑動 (上一頁) 門檻 (px)，降低以使觸發更靈敏
    
    if (deltaX < -swipeThresholdLeft) {
      // 向左滑動 -> 下一頁
      goToPage(currentPageIndex + 1);
    } else if (deltaX > swipeThresholdRight) {
      // 向右滑動 -> 上一頁
      goToPage(currentPageIndex - 1);
    }
  }
  
  // 支援鍵盤左右鍵翻頁
  document.addEventListener('keydown', (e) => {
    const activeElement = event.target;
    const isInputArea = activeElement.tagName === 'INPUT' || 
                        activeElement.tagName === 'TEXTAREA' || 
                        activeElement.tagName === 'SELECT' ||
                        activeElement.isContentEditable;
    if (isInputArea) {
        return; 
    }
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
    const groupBlessing = document.getElementById('group-blessing');
    const groupChildrenRow = document.getElementById('group-children-row');
    const rsvpChildren = document.getElementById('rsvp-children');
    const groupBabyChair = document.getElementById('group-baby-chair');
    
    // 初始化隱藏祝福欄位 (一開始預設不顯示，直到選了不克出席)
    if (groupBlessing) groupBlessing.style.display = 'none';
    
    rsvpAttend.addEventListener('change', (e) => {
      if (e.target.value === 'no') {
        groupGuestsCount.style.display = 'none';
        if (groupChildrenRow) groupChildrenRow.style.display = 'none';
        if (groupDiet) groupDiet.style.display = 'none';
        if (groupBlessing) groupBlessing.style.display = 'block';
      } else {
        groupGuestsCount.style.display = 'block';
        if (groupChildrenRow) groupChildrenRow.style.display = 'flex';
        if (groupDiet) groupDiet.style.display = 'block';
        if (groupBlessing) groupBlessing.style.display = 'none';
      }
    });
    
    // 兒童人數變更時的處理
    if (rsvpChildren && groupBabyChair) {
      rsvpChildren.addEventListener('change', (e) => {
        const numChildren = parseInt(e.target.value, 10);
        const babyChairSelect = document.getElementById('rsvp-baby-chair');
        
        if (numChildren === 0) {
          groupBabyChair.style.display = 'none';
          babyChairSelect.innerHTML = '<option value="0" selected>0 張</option>'; // reset
        } else {
          groupBabyChair.style.display = 'block';
          // 重新產生選項，最多不超過兒童數量
          const currentChairVal = parseInt(babyChairSelect.value, 10) || 0;
          babyChairSelect.innerHTML = '';
          for (let i = 0; i <= numChildren; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i} 張`;
            if (i === currentChairVal && currentChairVal <= numChildren) {
              option.selected = true;
            } else if (i === 0 && currentChairVal > numChildren) {
              // 如果原本選的數量大於現在的兒童數，重設為 0
              option.selected = true;
            }
            babyChairSelect.appendChild(option);
          }
        }
      });
    }
  
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = rsvpName.value.trim();
    const phone = document.getElementById('rsvp-phone').value.trim();
    const attend = rsvpAttend.value;
    const blessingEl = document.getElementById('rsvp-blessing');
    const blessing = blessingEl ? blessingEl.value.trim() : '';
    
    // 1. 建立 FormData 用於傳送至 Google 表單
    const formData = new FormData();
    formData.append('entry.698832185', name);
    formData.append('entry.1159994414', phone);
    
    // 對應出席意願
    const attendText = attend === 'yes' ? '馨香出席' : '祝賀滿滿 (不克出席)';
    formData.append('entry.1842321988', attendText);
    
    // 對應出席人數與備註/祝福
    let combinedNotes = [];
    if (attend === 'yes') {
      const guestsVal = document.getElementById('rsvp-guests').value;
      const childrenVal = document.getElementById('rsvp-children') ? document.getElementById('rsvp-children').value : '0';
      const chairVal = document.getElementById('rsvp-baby-chair') ? document.getElementById('rsvp-baby-chair').value : '0';
      
      let adultsText = guestsVal === '5' ? '5人以上' : `${guestsVal}人`;
      let childrenText = childrenVal === '0' ? '' : ` / 兒童:${childrenVal}人`;
      let chairText = (childrenVal !== '0' && chairVal !== '0') ? `(需${chairVal}張兒童椅)` : '';
      
      let guestsText = `大人:${adultsText}${childrenText}${chairText}`;
      
      formData.append('entry.347691862', guestsText);
      
      const diet = document.getElementById('rsvp-diet').value.trim();
      if (diet) combinedNotes.push(`備註：${diet}`);
    } else {
      formData.append('entry.347691862', '');
    }
    
    if (blessing) combinedNotes.push(`給我們的話：${blessing}`);
    
    // 將備註與祝福合併傳送到同一個欄位 (2057224347)
    formData.append('entry.2057224347', combinedNotes.join(' / '));
    
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
      const childrenVal = document.getElementById('rsvp-children') ? document.getElementById('rsvp-children').value : '0';
      
      let adultsText = guestsVal === '5' ? '5位以上大人' : `${guestsVal}位大人`;
      let childrenText = childrenVal === '0' ? '' : `，${childrenVal}位兒童`;
      
      successMessage.innerHTML = `親愛的 <strong>${name}</strong>，<br>已為你登記 <strong>${adultsText}${childrenText}</strong> 出席！<br>期待婚宴當天與你相聚，共度這份幸福 💍`;
    } else {
      successMessage.innerHTML = `親愛的 <strong>${name}</strong>，<br>已收到你無法出席的回覆，<br>謝謝你的祝福與心意 ❤️<br>期待未來有機會與你相聚！ 🌸`;
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
        // 將原本的表單替換為感謝文字
        rsvpForm.innerHTML = '<div style="text-align: center; padding: 60px 0; color: var(--gold-dark); font-size: 1.3rem; font-family: var(--font-cn-serif); letter-spacing: 2px; line-height: 1.8;">已完成回覆，<br>謝謝你的心意！</div>';
        // 依照你的要求，停留在當前頁面，不再跳回第一頁
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
  
  // 啟動灑花效果 (依據使用者要求取消)
  // startPetals();

  // ==========================================
  // 10. PHOTO CAROUSEL SYSTEM (PAGE 3)
  // ==========================================
  const carousel = document.querySelector('.carousel-container');
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    const dots = Array.from(carousel.querySelectorAll('.carousel-dots .dot'));
    let currentSlideIndex = 0;
    let carouselTimer = null;

    function showSlide(index) {
      // 範圍循環
      if (index >= slides.length) {
        currentSlideIndex = 0;
      } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
      } else {
        currentSlideIndex = index;
      }

      // 切換 slides
      slides.forEach((slide, idx) => {
        if (idx === currentSlideIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // 切換 dots
      dots.forEach((dot, idx) => {
        if (idx === currentSlideIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function nextSlide() {
      showSlide(currentSlideIndex + 1);
    }

    function prevSlide() {
      showSlide(currentSlideIndex - 1);
    }

    // 啟動與重新啟動自動輪播
    function startAutoPlay() {
      stopAutoPlay();
      carouselTimer = setInterval(nextSlide, 4500); // 4.5 秒自動切換下一張
    }

    function stopAutoPlay() {
      if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
      }
    }

    // 事件監聽與阻止冒泡 (重要：防止點選輪播箭頭與圓點導致整個 flipbook 翻頁)
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
      startAutoPlay(); // 點選後重設自動輪播計時器
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
      startAutoPlay();
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(dot.getAttribute('data-index'), 10);
        showSlide(index);
        startAutoPlay();
      });
    });

    // 當手機滑動輪播圖區域時，阻止冒泡以防止觸發 flipbook 翻頁
    carousel.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      stopAutoPlay();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      e.stopPropagation();
      startAutoPlay();
    }, { passive: true });

    // 初始啟動自動輪播
    startAutoPlay();
  }
});
