<template>
  <!-- WRAP EVERYTHING IN ONE DIV -->
  <div class="main-wrapper">
    
    <div class="game-container">
      <div class="score-board">Score: {{ currentScore }}</div>
      <div class="player" :style="{ bottom: playerY + 'px' }"></div>
      <div class="obstacle" :style="{ left: obstaclePosition.x + 'px' }"></div>

      <div v-if="gameOver" class="game-over-overlay">
        <h1>GAME OVER</h1>
        <button @click="resetGame">Restart</button>
      </div>
    </div>

    <!-- Move Leaderboard inside the wrapper -->
    <div class="leaderboard-section">
      <h3>Global Leaderboard</h3>
      <ul>
        <li v-for="item in highScores" :key="item.id">
          {{ item.title }}: {{ item.id * 15 }} pts
        </li>
      </ul>
    </div>

  </div>
</template>


<script>
import jumpSfx from '@/assets/jump.mp3';
import pointsSfx from '@/assets/points.mp3';
import backMusic from '@/assets/back.mp3';

import { mapGetters, mapActions } from 'vuex';
// 1. IMPORT the service we created
import { gameService } from '@/services/gameServices';

export default {
  data() {
    return {
      highScores: [], // 2. DATA to store API results
      gameOver: false,
      obstaclePosition: { x: 500 },
      playerY: 0,
      isJumping: false,
      animationFrame: null,
      sounds: {
        jump: new Audio(jumpSfx),
        points: new Audio(pointsSfx),
        bgm: new Audio(backMusic)
      }
    };
  },
  computed: {
    ...mapGetters(['currentScore'])
  },
  async mounted() {
    this.sounds.bgm.loop = true;
    this.sounds.bgm.volume = 1;
    this.gameLoop();

    // 3. FETCH high scores when game starts
    this.highScores = await gameService.fetchHighScores();

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') this.jump();
    });
  },
  methods: {
    ...mapActions(['addScore']),

    gameLoop() {
      if (this.gameOver) return;
      this.obstaclePosition.x -= 5;
      if (this.obstaclePosition.x < -40) {
        this.obstaclePosition.x = 500;
        this.incrementScore();
      }
      this.checkCollision();
      this.animationFrame = requestAnimationFrame(this.gameLoop);
    },

    jump() {
      if (this.isJumping || this.gameOver) return;
      this.sounds.jump.currentTime = 0;
      this.sounds.jump.play();
      if (this.sounds.bgm.paused) {
        this.sounds.bgm.play();
      }
      this.isJumping = true;
      let height = 0;
      const jumpInterval = setInterval(() => {
        if (height >= 150) {
          clearInterval(jumpInterval);
          const fallInterval = setInterval(() => {
            if (height <= 0) {
              clearInterval(fallInterval);
              this.isJumping = false;
            }
            height -= 5;
            this.playerY = height;
          }, 20);
        }
        height += 5;
        this.playerY = height;
      }, 20);
    },

    async checkCollision() { // 4. CHANGED to 'async' to handle API call
      const playerRect = { left: 50, right: 90, top: this.playerY + 40, bottom: this.playerY };
      const obsRect = { left: this.obstaclePosition.x, right: this.obstaclePosition.x + 40, top: 40, bottom: 0 };

      if (playerRect.right > obsRect.left && playerRect.left < obsRect.right && playerRect.bottom < obsRect.top) {
        this.gameOver = true;
        this.sounds.bgm.pause();
        cancelAnimationFrame(this.animationFrame);

        // 5. SUBMIT score after Game Over
        const playerName = prompt("Enter your name for the Leaderboard:");
        if (playerName) {
          await gameService.submitHighScore(playerName, this.currentScore);
          // Refresh list to show new (mocked) data
          this.highScores = await gameService.fetchHighScores();
        }
      }
    },

    incrementScore() {
      this.addScore();
      this.sounds.points.currentTime = 0;
      this.sounds.points.play();
    },

    resetGame() {
      this.gameOver = false;
      this.obstaclePosition.x = 500;
      this.playerY = 0;
      this.sounds.bgm.currentTime = 0;
      this.sounds.bgm.play();
      this.gameLoop();
    }
  },
  beforeUnmount() {
    this.sounds.bgm.pause();
    window.removeEventListener('keydown', this.jump);
  }
};
</script>


<style scoped>
.game-container {
  width: 500px;
  height: 200px;
  border-bottom: 2px solid black;
  margin: 50px auto;
  position: relative;
  overflow: hidden;
  background: #f0f0f0;
}
.player {
  width: 40px;
  height: 40px;
  background: blue;
  position: absolute;
  left: 50px;
}
.obstacle {
  width: 40px;
  height: 40px;
  background: red;
  position: absolute;
  bottom: 0;
}
.score-board {
  position: absolute;
  top: 10px;
  right: 10px;
  font-family: Arial, sans-serif;
  font-weight: bold;
}
.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
}
button:hover {
  background: #45a049;
}
</style>
