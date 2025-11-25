const canvas = document.getElementById("gameCanvas");
      const ctx = canvas.getContext("2d");

      // Audio context for sound effects
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      let balloons = [];
      let boats = [];
      let score = 0;
      let level = 1;
      let lives = 3;
      let gameRunning = false;
      let animationId;
      let spawnInterval;
      let boatSpawnInterval;
      let easterEggTimer = 0;
      let lastEasterEgg = 0;

      // Carregar imagem do barco
      const boatImage = new Image();
      boatImage.src = "assets/images/barco.svg";

      // Carregar imagem do Pennywise para easter egg
      const pennywiseImage = new Image();
      pennywiseImage.src = "assets/images/pennywise.svg";

      // Sound effect for popping balloons
      function playPopSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);

        // Add a second tone for richness
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.frequency.value = 400;
        oscillator2.type = "triangle";

        gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.15
        );

        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.15);
      }

      // Sound effect for hitting paper boat (error sound)
      function playErrorSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 200;
        oscillator.type = "sawtooth";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }

      // Sinister laugh sound effect
      function playLaughSound() {
        const duration = 1.5;
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator1.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(
          150,
          audioContext.currentTime + duration
        );
        oscillator1.type = "sawtooth";

        oscillator2.frequency.setValueAtTime(310, audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(
          155,
          audioContext.currentTime + duration
        );
        oscillator2.type = "square";

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.4);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration
        );

        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + duration);
        oscillator2.stop(audioContext.currentTime + duration);
      }

      // Easter Egg: Pennywise appearing
      function showPennywise() {
        const pennywiseEl = document.createElement("div");
        pennywiseEl.style.position = "fixed";
        pennywiseEl.style.top = "50%";
        pennywiseEl.style.left = "50%";
        pennywiseEl.style.transform = "translate(-50%, -50%)";
        pennywiseEl.style.width = "400px";
        pennywiseEl.style.height = "400px";
        pennywiseEl.style.zIndex = "200";
        pennywiseEl.style.opacity = "0";
        pennywiseEl.style.transition = "opacity 0.5s";
        pennywiseEl.style.pointerEvents = "none";
        pennywiseEl.style.background = "transparent";

        const img = document.createElement("img");
        img.src = "assets/images/pennywise.svg";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        img.style.filter = "drop-shadow(0 0 30px rgba(255, 0, 0, 0.8))";

        pennywiseEl.appendChild(img);
        document.body.appendChild(pennywiseEl);

        setTimeout(() => {
          pennywiseEl.style.opacity = "1";
        }, 10);

        setTimeout(() => {
          pennywiseEl.style.opacity = "0";
          setTimeout(() => {
            pennywiseEl.remove();
          }, 500);
        }, 2000);

        playLaughSound();
      }

      // Easter Egg: Red Eyes appearing
      function showRedEyes() {
        const eyeX1 = canvas.width / 2 - 30;
        const eyeX2 = canvas.width / 2 + 30;
        const eyeY = canvas.height / 2;

        let opacity = 0;
        let phase = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = (currentTime - startTime) / 1000;

          if (elapsed < 0.5) {
            // Fade in
            opacity = elapsed * 2;
          } else if (elapsed < 2.5) {
            // Stay visible with glow
            opacity = 1;
            phase = elapsed * 10;
          } else if (elapsed < 3) {
            // Fade out
            opacity = (3 - elapsed) * 2;
          } else {
            return;
          }

          ctx.save();
          ctx.globalAlpha = opacity;

          // Glow effect
          const glowSize = 40 + Math.sin(phase) * 10;
          const gradient1 = ctx.createRadialGradient(
            eyeX1,
            eyeY,
            5,
            eyeX1,
            eyeY,
            glowSize
          );
          gradient1.addColorStop(0, "#ff0000");
          gradient1.addColorStop(0.5, "rgba(255, 0, 0, 0.3)");
          gradient1.addColorStop(1, "rgba(255, 0, 0, 0)");

          ctx.fillStyle = gradient1;
          ctx.fillRect(
            eyeX1 - glowSize,
            eyeY - glowSize,
            glowSize * 2,
            glowSize * 2
          );

          const gradient2 = ctx.createRadialGradient(
            eyeX2,
            eyeY,
            5,
            eyeX2,
            eyeY,
            glowSize
          );
          gradient2.addColorStop(0, "#ff0000");
          gradient2.addColorStop(0.5, "rgba(255, 0, 0, 0.3)");
          gradient2.addColorStop(1, "rgba(255, 0, 0, 0)");

          ctx.fillStyle = gradient2;
          ctx.fillRect(
            eyeX2 - glowSize,
            eyeY - glowSize,
            glowSize * 2,
            glowSize * 2
          );

          // Eyes
          ctx.fillStyle = "#ff0000";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#ff0000";

          ctx.beginPath();
          ctx.arc(eyeX1, eyeY, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(eyeX2, eyeY, 12, 0, Math.PI * 2);
          ctx.fill();

          // Pupils
          ctx.fillStyle = "#000000";
          ctx.shadowBlur = 0;

          ctx.beginPath();
          ctx.arc(eyeX1, eyeY, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(eyeX2, eyeY, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          if (gameRunning) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }

      // Easter Egg: Scary message
      function showScaryMessage() {
        const messages = [
          "Duck and cover, kiddos...",
          "Do you want a balloon?",
          "You'll float too",
          "Hiya, Georgie",
        ];

        const message = messages[Math.floor(Math.random() * messages.length)];

        const messageEl = document.createElement("div");
        messageEl.style.position = "fixed";
        messageEl.style.top = "50%";
        messageEl.style.left = "50%";
        messageEl.style.transform = "translate(-50%, -50%)";
        messageEl.style.fontFamily = "'Creepster', cursive";
        messageEl.style.fontSize = "3em";
        messageEl.style.color = "#ff0000";
        messageEl.style.textShadow = "0 0 20px #ff0000, 0 0 40px #ff0000";
        messageEl.style.zIndex = "200";
        messageEl.style.opacity = "0";
        messageEl.style.transition = "opacity 0.5s";
        messageEl.style.pointerEvents = "none";
        messageEl.textContent = message;

        document.body.appendChild(messageEl);

        setTimeout(() => {
          messageEl.style.opacity = "1";
        }, 10);

        setTimeout(() => {
          messageEl.style.opacity = "0";
          setTimeout(() => {
            messageEl.remove();
          }, 500);
        }, 3000);
      }

      // Easter Egg: Screen flash
      function screenFlash() {
        const flash = document.createElement("div");
        flash.style.position = "fixed";
        flash.style.top = "0";
        flash.style.left = "0";
        flash.style.width = "100%";
        flash.style.height = "100%";
        flash.style.backgroundColor = "#ff0000";
        flash.style.zIndex = "199";
        flash.style.opacity = "0";
        flash.style.transition = "opacity 0.1s";
        flash.style.pointerEvents = "none";

        document.body.appendChild(flash);

        setTimeout(() => {
          flash.style.opacity = "0.7";
        }, 10);

        setTimeout(() => {
          flash.style.opacity = "0";
          setTimeout(() => {
            flash.remove();
          }, 100);
        }, 100);
      }

      // Trigger random easter eggs
      function triggerEasterEgg() {
        const now = Date.now();
        // Aumenta o tempo mínimo entre easter eggs conforme o nível
        const minTimeBetween = Math.max(20000 - (level * 1000), 10000); // 20s no início, mínimo 10s
        if (now - lastEasterEgg < minTimeBetween) return;

        lastEasterEgg = now;

        const easterEggs = [
          () => {
            showRedEyes();
            playLaughSound();
          },
          () => {
            showScaryMessage();
            playLaughSound();
          },
          () => {
            screenFlash();
            shakeScreen();
            playLaughSound();
          },
          () => {
            showRedEyes();
            setTimeout(() => {
              showScaryMessage();
            }, 1500);
            playLaughSound();
          },
          () => {
            showScaryMessage();
            playLaughSound();
          },
          () => {
            showScaryMessage();
            setTimeout(() => {
              screenFlash();
            }, 1000);
            playLaughSound();
          },
          () => {
            showScaryMessage();
            shakeScreen();
            playLaughSound();
          },
        ];

        const randomEgg =
          easterEggs[Math.floor(Math.random() * easterEggs.length)];
        randomEgg();
      }

      class Balloon {
        constructor() {
          this.radius = 25 + Math.random() * 15;
          this.x =
            Math.random() * (canvas.width - this.radius * 2) + this.radius;
          this.y = canvas.height + this.radius;
          // Velocidade aumenta gradualmente: 1.0 no nível 1, +0.3 por nível
          this.speed = 1.0 + (level - 1) * 0.3 + Math.random() * 0.5;
          this.swingSpeed = 0.02 + Math.random() * 0.03;
          this.swingAmplitude = 20 + Math.random() * 30;
          this.swingOffset = Math.random() * Math.PI * 2;
          this.alpha = 0.9 + Math.random() * 0.1;
          this.stringLength = 80 + Math.random() * 40;

          // Definir tipo de balão com probabilidades diferentes
          const rand = Math.random();
          if (rand < 0.60) {
            // 60% - Balão Vermelho (comum)
            this.type = 'red';
            this.points = 1;
            this.colors = {
              light: '#ff4444',
              medium: '#cc0000',
              dark: '#8b0000',
              knot: '#660000'
            };
          } else if (rand < 0.85) {
            // 25% - Balão Amarelo (raro)
            this.type = 'yellow';
            this.points = 3;
            this.colors = {
              light: '#ffff44',
              medium: '#ffcc00',
              dark: '#ff9900',
              knot: '#cc6600'
            };
          } else if (rand < 0.95) {
            // 10% - Balão Roxo (épico)
            this.type = 'purple';
            this.points = 5;
            this.colors = {
              light: '#dd44ff',
              medium: '#9900cc',
              dark: '#6600aa',
              knot: '#440088'
            };
          } else {
            // 5% - Balão Dourado (lendário)
            this.type = 'golden';
            this.points = 10;
            this.colors = {
              light: '#ffdd44',
              medium: '#ffaa00',
              dark: '#cc8800',
              knot: '#996600'
            };
          }
        }

        update(deltaTime) {
          this.y -= this.speed;
          this.swingOffset += this.swingSpeed;
        }

        draw() {
          const swingX = Math.sin(this.swingOffset) * this.swingAmplitude;
          const balloonX = this.x + swingX;

          // Efeito de brilho para balões raros
          if (this.type === 'golden' || this.type === 'purple') {
            const glowIntensity = 0.3 + Math.sin(Date.now() * 0.005) * 0.2;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.colors.medium;
          }

          // String
          ctx.strokeStyle = `rgba(100, 100, 100, ${this.alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(balloonX, this.y + this.radius);
          ctx.lineTo(balloonX, this.y + this.radius + this.stringLength);
          ctx.stroke();

          // Balloon shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.beginPath();
          ctx.ellipse(
            balloonX + 3,
            this.y + 3,
            this.radius,
            this.radius * 1.1,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Balloon gradient com cores personalizadas
          const gradient = ctx.createRadialGradient(
            balloonX - this.radius * 0.3,
            this.y - this.radius * 0.3,
            this.radius * 0.1,
            balloonX,
            this.y,
            this.radius
          );
          gradient.addColorStop(0, this.colors.light);
          gradient.addColorStop(0.4, this.colors.medium);
          gradient.addColorStop(1, this.colors.dark);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(
            balloonX,
            this.y,
            this.radius,
            this.radius * 1.1,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Resetar shadow
          ctx.shadowBlur = 0;

          // Shine effect
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.beginPath();
          ctx.ellipse(
            balloonX - this.radius * 0.4,
            this.y - this.radius * 0.4,
            this.radius * 0.3,
            this.radius * 0.5,
            -0.5,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Balloon knot com cor personalizada
          ctx.fillStyle = this.colors.knot;
          ctx.beginPath();
          ctx.ellipse(balloonX, this.y + this.radius, 5, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Indicador de pontos para balões especiais
          if (this.points > 1) {
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeText(`+${this.points}`, balloonX, this.y);
            ctx.fillText(`+${this.points}`, balloonX, this.y);
          }
        }

        isClicked(mouseX, mouseY) {
          const swingX = Math.sin(this.swingOffset) * this.swingAmplitude;
          const balloonX = this.x + swingX;

          // Área de clique aumentada em 50% para melhor responsividade
          const clickRadius = this.radius * 1.5;
          const distance = Math.sqrt(
            Math.pow(mouseX - balloonX, 2) + Math.pow(mouseY - this.y, 2)
          );

          // Também aceita cliques na corda
          const stringClicked =
            Math.abs(mouseX - balloonX) < 10 &&
            mouseY >= this.y + this.radius &&
            mouseY <= this.y + this.radius + this.stringLength;

          return distance < clickRadius || stringClicked;
        }

        getX() {
          return this.x + Math.sin(this.swingOffset) * this.swingAmplitude;
        }

        isOffScreen() {
          return this.y + this.radius < -50;
        }
      }

      class PaperBoat {
        constructor() {
          this.width = 50 + Math.random() * 20;
          this.height = 35 + Math.random() * 15;
          this.x = Math.random() * (canvas.width - this.width);
          this.y = canvas.height + this.height;
          // Velocidade dos barcos aumenta mais devagar: 0.8 base + 0.2 por nível
          this.speed = 0.8 + (level - 1) * 0.2 + Math.random() * 0.3;
          this.swingSpeed = 0.015 + Math.random() * 0.02;
          this.swingAmplitude = 15 + Math.random() * 20;
          this.swingOffset = Math.random() * Math.PI * 2;
          this.rotation = Math.random() * 0.2 - 0.1;
        }

        update() {
          this.y -= this.speed;
          this.swingOffset += this.swingSpeed;
        }

        draw() {
          const swingX = Math.sin(this.swingOffset) * this.swingAmplitude;
          const boatX = this.x + swingX;

          ctx.save();
          ctx.translate(boatX + this.width / 2, this.y);
          ctx.rotate(this.rotation + Math.sin(this.swingOffset) * 0.08);

          // Desenhar imagem do barco (sem fundo - SVG transparente)
          if (boatImage.complete) {
            ctx.drawImage(
              boatImage,
              -this.width / 2,
              -this.height / 2,
              this.width,
              this.height
            );
          }

          ctx.restore();
        }

        isClicked(mouseX, mouseY) {
          const swingX = Math.sin(this.swingOffset) * this.swingAmplitude;
          const boatX = this.x + swingX;
          const centerX = boatX + this.width / 2;
          const centerY = this.y;

          // Área de clique retangular ao redor da imagem do barco
          return (
            mouseX >= centerX - this.width / 2 - 5 &&
            mouseX <= centerX + this.width / 2 + 5 &&
            mouseY >= centerY - this.height / 2 - 5 &&
            mouseY <= centerY + this.height / 2 + 5
          );
        }

        isOffScreen() {
          return this.y + this.height < -50;
        }
      }

      function startGame() {
        document.getElementById("startScreen").style.display = "none";
        document.getElementById("gameCanvas").style.display = "block";
        document.getElementById("stats").style.display = "flex";

        score = 0;
        level = 1;
        lives = 3;
        balloons = [];
        boats = [];
        gameRunning = true;
        easterEggTimer = 0;
        lastEasterEgg = Date.now();

        // Iniciar áudio de fundo em loop
        const backgroundAudio = document.getElementById("backgroundAudio");
        backgroundAudio.volume = 0.3; // Volume mais baixo para não incomodar
        backgroundAudio.play().catch(error => {
          console.log("Autoplay bloqueado pelo navegador:", error);
        });

        updateStats();
        gameLoop();
        spawnBalloons();
        spawnBoats();
      }

      function spawnBalloons() {
        if (!gameRunning) return;

        // Spawn rate diminui gradualmente: 1200ms no nível 1, até 400ms em níveis altos
        const spawnRate = Math.max(1200 - (level - 1) * 80, 400);

        spawnInterval = setInterval(() => {
          if (gameRunning) {
            balloons.push(new Balloon());
          }
        }, spawnRate);
      }

      function spawnBoats() {
        if (!gameRunning) return;

        // Barcos aparecem menos frequentemente: 3000ms no nível 1, até 1500ms em níveis altos
        const boatSpawnRate = Math.max(3000 - (level - 1) * 150, 1500);

        boatSpawnInterval = setInterval(() => {
          if (gameRunning && Math.random() > 0.4) {
            // 60% chance de spawnar
            boats.push(new PaperBoat());
          }
        }, boatSpawnRate);
      }

      function gameLoop() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw balloons
        for (let i = balloons.length - 1; i >= 0; i--) {
          balloons[i].update();
          balloons[i].draw();

          // Check if balloon escaped
          if (balloons[i].isOffScreen()) {
            balloons.splice(i, 1);
            loseLife();
          }
        }

        // Update and draw boats
        for (let i = boats.length - 1; i >= 0; i--) {
          boats[i].update();
          boats[i].draw();

          // Remove boats that are off screen (no penalty)
          if (boats[i].isOffScreen()) {
            boats.splice(i, 1);
          }
        }

        // Easter egg trigger (random chance every frame, aumenta com o nível)
        easterEggTimer++;
        // Chance aumenta gradualmente com o nível: 0.1% no nível 1, até 0.5% em níveis altos
        const easterEggChance = Math.min(0.001 + (level * 0.0001), 0.005);
        if (easterEggTimer > 300 && Math.random() < easterEggChance) {
          triggerEasterEgg();
          easterEggTimer = 0;
        }

        animationId = requestAnimationFrame(gameLoop);
      }

      function loseLife() {
        lives--;
        updateStats();
        shakeScreen();
        createBloodDrips();

        if (lives <= 0) {
          endGame();
        }
      }

      function updateStats() {
        document.getElementById("score").textContent = score;
        document.getElementById("level").textContent = level;

        let heartsDisplay = "";
        for (let i = 0; i < lives; i++) {
          heartsDisplay += "❤️";
        }
        for (let i = lives; i < 3; i++) {
          heartsDisplay += "🖤";
        }
        document.getElementById("lives").textContent = heartsDisplay;
      }

      function shakeScreen() {
        document.body.classList.add("shake");
        setTimeout(() => {
          document.body.classList.remove("shake");
        }, 500);
      }

      function createBloodDrips() {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const drip = document.createElement("div");
            drip.className = "blood-drip";
            drip.style.left = Math.random() * 100 + "%";
            drip.style.top = "0";
            document.body.appendChild(drip);

            setTimeout(() => {
              drip.remove();
            }, 3000);
          }, i * 100);
        }
      }

      function createPopEffect(x, y, balloonColor = '#cc0000') {
        // Blood splatter effect com cor do balão
        for (let i = 0; i < 15; i++) {
          const angle = (Math.PI * 2 * i) / 15;
          const velocity = 2 + Math.random() * 4;
          const size = 3 + Math.random() * 5;

          let particleX = x;
          let particleY = y;
          let vx = Math.cos(angle) * velocity;
          let vy = Math.sin(angle) * velocity;

          const animateParticle = () => {
            ctx.fillStyle = balloonColor;
            ctx.globalAlpha = 0.8 - Math.random() * 0.3;
            ctx.beginPath();
            ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;

            particleX += vx;
            particleY += vy;
            vy += 0.2; // Gravity

            if (particleY < canvas.height) {
              requestAnimationFrame(animateParticle);
            }
          };

          animateParticle();
        }
      }

      function showPointsGained(x, y, points, color) {
        const pointsText = document.createElement("div");
        pointsText.style.position = "fixed";
        pointsText.style.left = x + "px";
        pointsText.style.top = y + "px";
        pointsText.style.fontFamily = "'Creepster', cursive";
        pointsText.style.fontSize = points > 5 ? "3em" : "2em";
        pointsText.style.color = color;
        pointsText.style.textShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
        pointsText.style.zIndex = "150";
        pointsText.style.pointerEvents = "none";
        pointsText.style.transform = "translate(-50%, -50%)";
        pointsText.style.transition = "all 1s ease-out";
        pointsText.textContent = `+${points}`;

        document.body.appendChild(pointsText);

        setTimeout(() => {
          pointsText.style.top = (y - 100) + "px";
          pointsText.style.opacity = "0";
          pointsText.style.transform = "translate(-50%, -50%) scale(1.5)";
        }, 10);

        setTimeout(() => {
          pointsText.remove();
        }, 1000);
      }

      function handleInteraction(e) {
        if (!gameRunning) return;

        e.preventDefault(); // Prevenir comportamento padrão no mobile

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Suporte para touch e mouse
        let clientX, clientY;
        if (e.type === "touchstart" || e.type === "touchend") {
          const touch = e.touches[0] || e.changedTouches[0];
          clientX = touch.clientX;
          clientY = touch.clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }

        const mouseX = (clientX - rect.left) * scaleX;
        const mouseY = (clientY - rect.top) * scaleY;

        // Feedback visual imediato
        createClickFeedback(mouseX, mouseY);

        // Check if clicked on a boat first (penalty)
        let closestBoat = null;
        let closestBoatDist = Infinity;

        for (let i = 0; i < boats.length; i++) {
          if (boats[i].isClicked(mouseX, mouseY)) {
            const boatX =
              boats[i].x +
              boats[i].width / 2 +
              Math.sin(boats[i].swingOffset) * boats[i].swingAmplitude;
            const dist = Math.sqrt(
              Math.pow(mouseX - boatX, 2) + Math.pow(mouseY - boats[i].y, 2)
            );
            if (dist < closestBoatDist) {
              closestBoatDist = dist;
              closestBoat = i;
            }
          }
        }

        if (closestBoat !== null) {
          playErrorSound();
          boats.splice(closestBoat, 1);
          score = Math.max(0, score - 5);
          shakeScreen();
          canvas.style.borderColor = "#ff0000";
          setTimeout(() => {
            canvas.style.borderColor = "#8b0000";
          }, 100);
          updateStats();
          return;
        }

        // Find closest balloon to click position
        let closestBalloon = null;
        let closestDistance = Infinity;

        for (let i = 0; i < balloons.length; i++) {
          if (balloons[i].isClicked(mouseX, mouseY)) {
            const balloonX = balloons[i].getX();
            const dist = Math.sqrt(
              Math.pow(mouseX - balloonX, 2) +
                Math.pow(mouseY - balloons[i].y, 2)
            );
            if (dist < closestDistance) {
              closestDistance = dist;
              closestBalloon = i;
            }
          }
        }

        if (closestBalloon !== null) {
          const balloon = balloons[closestBalloon];
          const balloonScreenX = balloon.getX();
          const balloonScreenY = balloon.y;

          // Converter coordenadas do canvas para coordenadas da tela
          const rect = canvas.getBoundingClientRect();
          const screenX = rect.left + (balloonScreenX * rect.width / canvas.width);
          const screenY = rect.top + (balloonScreenY * rect.height / canvas.height);

          createPopEffect(balloonScreenX, balloonScreenY, balloon.colors.medium);
          playPopSound();

          // Mostrar pontos ganhos
          showPointsGained(screenX, screenY, balloon.points, balloon.colors.light);

          // Adicionar pontos baseado no tipo do balão
          score += balloon.points;
          balloons.splice(closestBalloon, 1);

          // Level up every 10 points
          if (score % 10 === 0) {
            level++;
            // Reiniciar spawn intervals com novos valores baseados no nível
            clearInterval(spawnInterval);
            clearInterval(boatSpawnInterval);
            spawnBalloons();
            spawnBoats();

            // Mostrar easter egg do Pennywise a cada 10 acertos
            showPennywise();

            canvas.style.borderColor = "#ff0000";
            setTimeout(() => {
              canvas.style.borderColor = "#8b0000";
            }, 200);
          }

          updateStats();
        }
      }

      // Adicionar listeners para mouse e touch
      canvas.addEventListener("click", handleInteraction);
      canvas.addEventListener("touchstart", handleInteraction);

      function createClickFeedback(x, y) {
        // Efeito visual de clique rápido
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = elapsed / 200; // 200ms de duração

          if (progress < 1) {
            ctx.save();
            ctx.globalAlpha = 1 - progress;
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, 10 + progress * 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }

      function endGame() {
        gameRunning = false;
        clearInterval(spawnInterval);
        clearInterval(boatSpawnInterval);
        cancelAnimationFrame(animationId);

        // Pausar áudio de fundo
        const backgroundAudio = document.getElementById("backgroundAudio");
        backgroundAudio.pause();
        backgroundAudio.currentTime = 0;

        document.getElementById("finalScore").textContent = score;
        document.getElementById("finalLevel").textContent = level;
        document.getElementById("gameOver").style.display = "block";

        shakeScreen();
        createBloodDrips();
      }

      function restartGame() {
        document.getElementById("gameOver").style.display = "none";
        document.getElementById("gameCanvas").style.display = "none";
        document.getElementById("stats").style.display = "none";
        document.getElementById("startScreen").style.display = "block";
      }

      // Adjust canvas size on window resize
      function resizeCanvas() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          canvas.width = window.innerWidth - 20;
          canvas.height = window.innerHeight - 250;
        } else {
          canvas.width = Math.min(800, window.innerWidth - 40);
          canvas.height = Math.min(600, window.innerHeight - 200);
        }
      }

      window.addEventListener("resize", resizeCanvas);
      window.addEventListener("orientationchange", resizeCanvas);

      // Inicializar tamanho do canvas
      resizeCanvas();