<template>
  <div class="pong-container">
    <canvas ref="gameCanvas" class="pong-canvas"></canvas>
    <div class="score">
      <span>Jugador: {{ playerScore }}</span>
      <span>CPU: {{ cpuScore }}</span>
    </div>
    <div v-if="!isPlaying" class="start-screen">
      <button @click="startGame">Iniciar Juego</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Referencias y variables del juego
const gameCanvas = ref(null);
const ctx = ref(null);
const isPlaying = ref(false);
const playerScore = ref(0);
const cpuScore = ref(0);

// Configuración del juego
const paddleHeight = 100;
const paddleWidth = 10;
const ballSize = 10;
const paddleSpeed = 6;
const initialBallSpeed = 3;

// Estado del juego
const player = ref({
  y: 0,
  speed: 0
});

const cpu = ref({
  y: 0,
  speed: 3
});

const ball = ref({
  x: 0,
  y: 0,
  speedX: 0,
  speedY: 0
});

// Inicialización del juego
const initGame = () => {
  const canvas = gameCanvas.value;
  player.value.y = canvas.height / 2 - paddleHeight / 2;
  cpu.value.y = canvas.height / 2 - paddleHeight / 2;
  resetBall();
};

const resetBall = () => {
  const canvas = gameCanvas.value;
  ball.value = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speedX: initialBallSpeed * (Math.random() > 0.5 ? 1 : -1),
    speedY: initialBallSpeed * (Math.random() * 2 - 1)
  };
};

// Control del jugador
const handleKeyDown = (e) => {
  if (e.key === 'ArrowUp') {
    player.value.speed = -paddleSpeed;
  } else if (e.key === 'ArrowDown') {
    player.value.speed = paddleSpeed;
  }
};

const handleKeyUp = (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    player.value.speed = 0;
  }
};

// Lógica de actualización
const update = () => {
  if (!isPlaying.value) return;

  // Actualizar posición del jugador
  player.value.y += player.value.speed;
  player.value.y = Math.max(0, Math.min(gameCanvas.value.height - paddleHeight, player.value.y));

  // IA simple para la CPU
  const cpuCenter = cpu.value.y + paddleHeight / 2;
  const ballCenter = ball.value.y;
  if (cpuCenter < ballCenter - 35) {
    cpu.value.y += cpu.value.speed;
  } else if (cpuCenter > ballCenter + 35) {
    cpu.value.y -= cpu.value.speed;
  }

  // Actualizar posición de la pelota
  ball.value.x += ball.value.speedX;
  ball.value.y += ball.value.speedY;

  // Colisiones con las paredes
  if (ball.value.y <= 0 || ball.value.y >= gameCanvas.value.height) {
    ball.value.speedY *= -1;
  }

  // Colisiones con las paletas
  if (checkPaddleCollision(player.value.y, 0) || 
      checkPaddleCollision(cpu.value.y, gameCanvas.value.width - paddleWidth)) {
    ball.value.speedX *= -1.1; // Aumentar velocidad gradualmente
  }

  // Puntuación
  if (ball.value.x <= 0) {
    cpuScore.value++;
    resetBall();
  } else if (ball.value.x >= gameCanvas.value.width) {
    playerScore.value++;
    resetBall();
  }
};

const checkPaddleCollision = (paddleY, paddleX) => {
  return ball.value.x >= paddleX &&
         ball.value.x <= paddleX + paddleWidth &&
         ball.value.y >= paddleY &&
         ball.value.y <= paddleY + paddleHeight;
};

// Renderizado
const draw = () => {
  const canvas = gameCanvas.value;
  const context = ctx.value;

  // Limpiar canvas
  context.fillStyle = '#000000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar paletas
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, player.value.y, paddleWidth, paddleHeight);
  context.fillRect(canvas.width - paddleWidth, cpu.value.y, paddleWidth, paddleHeight);

  // Dibujar pelota
  context.beginPath();
  context.arc(ball.value.x, ball.value.y, ballSize, 0, Math.PI * 2);
  context.fill();

  // Dibujar línea central
  context.setLineDash([5, 15]);
  context.beginPath();
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.strokeStyle = '#FFFFFF';
  context.stroke();
};

// Game loop
let animationId = null;
const gameLoop = () => {
  update();
  draw();
  animationId = requestAnimationFrame(gameLoop);
};

// Controles del juego
const startGame = () => {
  isPlaying.value = true;
  playerScore.value = 0;
  cpuScore.value = 0;
  initGame();
  gameLoop();
};

// Lifecycle hooks
onMounted(() => {
  const canvas = gameCanvas.value;
  ctx.value = canvas.getContext('2d');
  
  // Configurar tamaño del canvas
  canvas.width = 800;
  canvas.height = 600;

  // Agregar event listeners
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  initGame();
  draw();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>

<style scoped>
.pong-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #282c34;
  padding: 20px;
  min-height: 75vh;
}

.pong-canvas {
  border: 2px solid var(--borde);
  margin-bottom: 20px;
}

.score {
  display: flex;
  justify-content: space-between;
  width: 300px;
  color: #ffffff;
  font-size: 24px;
  margin-bottom: 20px;
}

.start-screen {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.start-screen button {
  padding: 10px 20px;
  font-size: 18px;
  background-color: var(--boton);
  border: none;
  border-radius: 4px;
  color: #282c34;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-screen button:hover {
  background-color: var(--boton-o);
}
</style> 