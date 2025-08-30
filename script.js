(function(){


      window.addEventListener('load', () => {
  // Check if the device is likely mobile
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    alert('Better experience on desktop/laptop and good net. hihu');
  }
});


      const noBtn = document.getElementById('noBtn');
      const yesBtn = document.getElementById('yesBtn');
      const errorMsg = document.getElementById('errorMsg');
      const mainBlock = document.getElementById('mainBlock');
      const subBlock = document.getElementById('subBlock');
      const loader = document.getElementById('loader');
      const videoBox = document.getElementById('videoBox');
      const song = document.getElementById('song');
      const subQuestions = document.querySelectorAll(".sub-question");

      let currentQ = 0;
      let noClickCount = 0;
      let isNoDodging = false;

      // Video sources - you can replace these with your actual lyric videos
      const yesVideo = "yesBtn.mp4"; // Replace with your YES lyric video
      const noVideo = "noBtn.mp4";   // Replace with your NO lyric video

      // --- MAIN YES ---
      yesBtn.addEventListener("click", () => {
        if (isNoDodging) return; // Prevent clicking while no button is dodging
        mainBlock.classList.add("hidden");
        subBlock.classList.remove("hidden");
        showQuestion(0);
      });

      function showQuestion(index) {
        if(index < subQuestions.length){
          subQuestions[index].classList.remove("hidden");
        }
      }

      // --- SUB YES ---
      document.querySelectorAll(".sub-yes").forEach(btn => {
        btn.addEventListener("click", () => {
          if (isNoDodging) return; // Prevent clicking while no button is dodging
          
          const parent = btn.closest(".sub-question");
          parent.classList.add("hidden");
          currentQ++;

          if(currentQ < subQuestions.length){
            showQuestion(currentQ);
          } else {
            // all YES → loader → video
            subBlock.classList.add("hidden");
            loader.classList.remove("hidden");

            setTimeout(() => {
              loader.classList.add("hidden");
              showVideo(yesVideo);
            }, 1800);
          }
        });
      });

      // --- NO BUTTON DODGING LOGIC ---
      function setupNoDodging(btn) {
        let isTracking = false;

        function startCursorTracking() {
          if (isTracking) return;
          isTracking = true;

          function trackMouse(e) {
            const btnRect = btn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate distance between mouse and button center
            const distance = Math.sqrt(
              Math.pow(mouseX - btnCenterX, 2) + Math.pow(mouseY - btnCenterY, 2)
            );
            
            // If mouse is getting close (within 120px), dodge away INSTANTLY
            const dangerZone = 120;
            if (distance < dangerZone) {
              dodgeAwayFromCursor(btn, mouseX, mouseY);
            }
          }

          document.addEventListener('mousemove', trackMouse);
        }

        // Start tracking when button becomes visible
        const observer = new MutationObserver(() => {
          const subQuestion = btn.closest('.sub-question');
          const subBlock = btn.closest('#subBlock');
          
          if (subQuestion && !subQuestion.classList.contains('hidden') && subBlock && !subBlock.classList.contains('hidden')) {
            startCursorTracking();
          } else if (!btn.closest('.hidden')) {
            startCursorTracking();
          } else {
            // Stop tracking when hidden
            if (isTracking) {
              document.removeEventListener('mousemove', trackMouse);
              isTracking = false;
            }
          }
        });
        
        // Observe both the parent element and sub-question for class changes
        observer.observe(btn.parentElement, { attributes: true, attributeFilter: ['class'] });
        if (btn.closest('.sub-question')) {
          observer.observe(btn.closest('.sub-question'), { attributes: true, attributeFilter: ['class'] });
        }
        if (btn.closest('#subBlock')) {
          observer.observe(btn.closest('#subBlock'), { attributes: true, attributeFilter: ['class'] });
        }
        
        // Also start tracking immediately if button is already visible
        const subQuestion = btn.closest('.sub-question');
        const subBlock = btn.closest('#subBlock');
        
        if (subQuestion && !subQuestion.classList.contains('hidden') && subBlock && !subBlock.classList.contains('hidden')) {
          startCursorTracking();
        } else if (!btn.closest('.hidden')) {
          startCursorTracking();
        }

        btn.addEventListener("click", (e) => {
          // Allow clicking but make it challenging - need to be reasonably precise
          const btnRect = btn.getBoundingClientRect();
          const clickX = e.clientX;
          const clickY = e.clientY;
          const btnCenterX = btnRect.left + btnRect.width / 2;
          const btnCenterY = btnRect.top + btnRect.height / 2;
          
          const clickDistance = Math.sqrt(
            Math.pow(clickX - btnCenterX, 2) + Math.pow(clickY - btnCenterY, 2)
          );
          
          // More forgiving click area - within 25px of center (instead of 15px)
          if (clickDistance > 25) {
            e.preventDefault();
            // Small dodge when clicked imprecisely
            dodgeAwayFromCursor(btn, clickX, clickY);
            return false;
          }
          
          // Success! Button was clicked properly
          handleNoClick();
        });
      }

      function dodgeAwayFromCursor(btn, mouseX, mouseY) {
        const btnRect = btn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;
        
        // Calculate direction away from mouse
        const deltaX = btnCenterX - mouseX;
        const deltaY = btnCenterY - mouseY;
        
        // Normalize the direction
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normalizedX = distance > 0 ? deltaX / distance : Math.random() - 0.5;
        const normalizedY = distance > 0 ? deltaY / distance : Math.random() - 0.5;
        
        // Add some randomness but less chaotic
        const randomX = (Math.random() - 0.5) * 0.3;
        const randomY = (Math.random() - 0.5) * 0.3;
        
        // Move button away from cursor - shorter distance for better playability
        const dodgeDistance = Math.random() * 60 + 100; // Random distance 100-160px (reduced)
        const newX = (normalizedX + randomX) * dodgeDistance;
        const newY = (normalizedY + randomY) * dodgeDistance;
        
        // INSTANT movement - no transition
        btn.style.transition = 'none';
        btn.style.transform = `translate(${newX}px, ${newY}px) scale(${0.8 + Math.random() * 0.2})`;
        btn.style.zIndex = '1000';
        
        // Brief pause before next movement - gives player a chance
        setTimeout(() => {
          // Smaller secondary movement
          const newX2 = (Math.random() - 0.5) * 120; // Reduced movement range
          const newY2 = (Math.random() - 0.5) * 120;
          btn.style.transform = `translate(${newX2}px, ${newY2}px) scale(${0.85 + Math.random() * 0.15})`;
        }, 150 + Math.random() * 100); // Slightly longer pause
      }

      // --- MAIN NO ---
      setupNoDodging(noBtn);

      // --- SUB NO ---
      document.querySelectorAll(".sub-no").forEach(btn => {
        setupNoDodging(btn);
      });



      function handleNoClick() {
        noClickCount++;
        showError();

        // After any "No" click, show the rejection video
        setTimeout(() => {
          showVideo(noVideo);
        }, 2000);
      }

      function showError(){
        errorMsg.style.opacity = "1";
        setTimeout(() => {
          errorMsg.style.opacity = "0";
        }, 2000);
      }

      function showVideo(videoSrc) {
        song.src = videoSrc;
        videoBox.classList.remove("hidden");
        
        // Fade in the video
        setTimeout(() => {
          videoBox.classList.add("show");
          song.currentTime = 0;
          song.play().catch(() => console.warn("Autoplay blocked - user needs to click play"));
        }, 100);
      }

      // Close video on click (optional)
      videoBox.addEventListener("click", (e) => {
        if (e.target === videoBox) {
          videoBox.classList.remove("show");
          setTimeout(() => {
            videoBox.classList.add("hidden");
            song.pause();
          }, 2000);
        }
      });
    })();