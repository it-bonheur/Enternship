<template>
  <div class="game-container">
    
    <!-- Score -->
    <h2>Score: {{ score }}</h2>

    <!-- Game Over -->
    <h1 v-if="gameOver" class="game-over">
      Game Over
    </h1>

    <!-- Player -->
    <div
      class="player"
      :style="{ bottom: playerY + 'px' }"
    ></div>

    <!-- Obstacle -->
    <div
      class="obstacle"
      :style="{ left: obstaclePosition + 'px' }"
    ></div>

  </div>
</template>

<script>
export default {
  name: "JumpGame",

  data() {
    return {
      score: 0,
      gameOver: false,

      obstaclePosition: 500,

      playerY: 0,
      isJumping: false,

      animationId: null
    };
  },

  methods: {

    // Main Game Loop
    gameLoop() {

      if (this.gameOver) return;

      // Move obstacle left
      this.obstaclePosition -= 5;

      // Reset obstacle position
      if (this.obstaclePosition < -50) {
        this.obstaclePosition = 500;

        // Increase score
        this.incrementScore();
      }

      // Check collision
      this.checkCollision();

      // Repeat loop
      this.animationId = requestAnimationFrame(this.gameLoop);
    },

    // Jump Function
    jump() {

      if (this.isJumping || this.gameOver) return;

      this.isJumping = true;

      this.playerY = 120;

      setTimeout(() => {
        this.playerY = 0;
        this.isJumping = false;
      }, 500);
    },

    // Collision Detection
    checkCollision() {

      const playerLeft = 50;
      const obstacleLeft = this.obstaclePosition;

      // Simple collision condition
      if (
        obstacleLeft < 100 &&
        obstacleLeft > 20 &&
        this.playerY < 50
      ) {
        this.gameOver = true;

        cancelAnimationFrame(this.animationId);
      }
    },

    // Increment Score
    incrementScore() {
      this.score++;
    },

    // Keyboard Event
    handleKeyPress(event) {
      if (event.code === "Space") {
        this.jump();
      }
    }
  },

  mounted() {

    // Start game loop
    this.gameLoop();

    // Add keyboard listener
    window.addEventListener("keydown", this.handleKeyPress);
  },

  beforeUnmount() {

    // Remove event listener
    window.removeEventListener("keydown", this.handleKeyPress);

    cancelAnimationFrame(this.animationId);
  }
};
</script>

<style scoped>

.game-container {
  width: 600px;
  height: 300px;
  border: 2px solid black;
  position: relative;
  overflow: hidden;
  background: #f0f0f0;
}

.player {
  width: 50px;
  height: 50px;
  background: blue;
  position: absolute;
  left: 50px;
}

.obstacle {
  width: 50px;
  height: 50px;
  background: red;
  position: absolute;
  bottom: 0;
}

.game-over {
  color: red;
  text-align: center;
}

</style>