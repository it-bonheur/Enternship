<template>
  <div class="game-container">
    <div class="player" :style="{ bottom: playerBottom + 'px' }"></div>
    <div class="obstacle" :style="{ left: obstacleX + 'px' }"></div>
    <div class="score">Score: {{ score }}</div>
    <div v-if="gameOver" class="game-over">Game Over!</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      score: 0,
      gameOver: false,
      obstacleX: 500,
      playerBottom: 0,
      isJumping: false,
      gameLoopId: null
    };
  },
  methods: {
    startGame() {
      this.gameLoop();
      window.addEventListener('keydown', this.handleKeyPress);
    },
    gameLoop() {
      if (this.gameOver) {
        cancelAnimationFrame(this.gameLoopId);
        return;
      }
      this.moveObstacle();
      this.checkCollision();
      this.gameLoopId = requestAnimationFrame(this.gameLoop);
    },
    moveObstacle() {
      this.obstacleX -= 5;
      if (this.obstacleX < -50) {
        this.obstacleX = 500; // Reset position
        this.incrementScore();
      }
    },
    handleKeyPress(e) {
      if (e.code === 'Space' && !this.isJumping) {
        this.jump();
      }
    },
    jump() {
      this.isJumping = true;
      let jumpHeight = 100;
      let jumpUpInterval = setInterval(() => {
        if (this.playerBottom >= jumpHeight) {
          clearInterval(jumpUpInterval);
          this.fall();
        } else {
          this.playerBottom += 10;
        }
      }, 20);
    },
    fall() {
      let fallInterval = setInterval(() => {
        if (this.playerBottom <= 0) {
          this.playerBottom = 0;
          this.isJumping = false;
          clearInterval(fallInterval);
        } else {
          this.playerBottom -= 10;
        }
      }, 20);
    },
    checkCollision() {
      // Assuming obstacle width of 50px and player size similar
      if (
        this.obstacleX < 50 && // obstacle is close
        this.obstacleX > 0 && // obstacle is in range
        this.playerBottom < 50 // player is not high enough
      ) {
        this.gameOver = true;
      }
    },
    incrementScore() {
      this.score++;
    }
  },
  mounted() {
    this.startGame();
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyPress);
    cancelAnimationFrame(this.gameLoopId);
  }
};
</script>

<style scoped>
.game-container {
  position: relative;
  width: 600px;
  height: 200px;
  background: #eee;
  overflow: hidden;
  border: 2px solid #000;
}
.player {
  position: absolute;
  bottom: 0;
  width: 30px;
  height: 30px;
  background: blue;
}
.obstacle {
  position: absolute;
  bottom: 0;
  width: 50px;
  height: 50px;
  background: red;
}
.score {
  position: absolute;
  top: 10px;
  left: 10px;
  font-weight: bold;
}
.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: red;
}
</style>