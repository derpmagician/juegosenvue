<template>
  <div class="game-container">
    <canvas ref="gameCanvas" class="game-canvas" @click="handleClick"></canvas>
    <div class="game-info">
      <div class="score">Puntuación: {{ score }}</div>
      <div class="high-score">Máxima Puntuación: {{ highScore }}</div>
      <div class="time-left">Tiempo: {{ timeLeft }}s</div>
    </div>
    <div v-if="!isPlaying" class="start-screen">
      <h2>{{ gameOver ? '¡Juego Terminado!' : 'Point Catching' }}</h2>
      <p v-if="gameOver">Puntuación Final: {{ score }}</p>
      <button @click="startGame">{{ gameOver ? 'Jugar de Nuevo' : 'Comenzar' }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Referencias y variables del juego
const gameCanvas = ref(null);
const ctx = ref(null);
const isPlaying = ref(false);
const gameOver = ref(false);
const score = ref(0);
const highScore = ref(0);
const timeLeft = ref(60);

// Configuración del juego
const ballRadius = 15;
const ballSpeed = 1;
const gameTime = 60;
const arcRadius = ballRadius + 5;

// Nueva variable para la distancia entre bolas
const ballsDistance = ref(0);

// Estado de la pelota
const ball = ref({
  x: 0,
  y: 0,
  dx: ballSpeed,
  dy: ballSpeed
});

// Posición del mouse
const mousePos = ref({ x: 0, y: 0 });

// Game loop
let animationId = null;
let timerInterval = null;

// Inicialización del juego
const startGame = () => {
  isPlaying.value = true;
  gameOver.value = false;
  score.value = 0;
  timeLeft.value = gameTime;
  
  // Posición inicial aleatoria de la pelota
  const canvas = gameCanvas.value;
  ball.value = {
    x: Math.random() * (canvas.width - 2 * ballRadius) + ballRadius,
    y: Math.random() * (canvas.height - 2 * ballRadius) + ballRadius,
    dx: ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    dy: ballSpeed * (Math.random() > 0.5 ? 1 : -1)
  };

  // Iniciar temporizador
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) endGame();
  }, 1000);

  // Iniciar game loop
  gameLoop();
};

// Actualización del juego
const update = () => {
  const canvas = gameCanvas.value;

  // Actualizar posición de la pelota
  ball.value.x += ball.value.dx;
  ball.value.y += ball.value.dy;

  // Calcular la distancia entre la bola roja y el arco amarillo
  ballsDistance.value = Math.sqrt(
    Math.pow(ball.value.x - mousePos.value.x, 2) + 
    Math.pow(ball.value.y - mousePos.value.y, 2)
  );

  // Rebotar en los bordes
  if (ball.value.x - ballRadius <= 0 || ball.value.x + ballRadius >= canvas.width) {
    ball.value.dx *= -1;
  }
  if (ball.value.y - ballRadius <= 0 || ball.value.y + ballRadius >= canvas.height) {
    ball.value.dy *= -1;
  }
};

// Función para reposicionar la bola aleatoriamente
const repositionBall = () => {
  const canvas = gameCanvas.value;
  ball.value.x = Math.random() * (canvas.width - 2 * ballRadius) + ballRadius;
  ball.value.y = Math.random() * (canvas.height - 2 * ballRadius) + ballRadius;
  
  // Cambiar dirección aleatoriamente
  ball.value.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
  ball.value.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
};

// Manejo de clics
const handleClick = (event) => {
  if (!isPlaying.value) return;

  const rect = gameCanvas.value.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // Comprobar si el clic está dentro de la pelota
  const distance = Math.sqrt(
    Math.pow(clickX - ball.value.x, 2) + 
    Math.pow(clickY - ball.value.y, 2)
  );

  let pointsScored = false;

  // Verificar si el clic está dentro de la pelota
  if (distance < ballRadius) {
    score.value += 10; // Ganar 10 puntos por hacer clic en la bola roja
    pointsScored = true;
  } 
  
  // Verificar si las bolas están superpuestas
  if (ballsDistance.value < arcRadius + ballRadius) {
    score.value += 3; // Ganar 3 puntos adicionales si el arco amarillo toca la bola roja
    pointsScored = true;
  }

  // Actualizar highscore y reposicionar la bola si se ganaron puntos
  if (pointsScored) {
    if (score.value > highScore.value) {
      highScore.value = score.value;
    }
    repositionBall();
  }
};

// Renderizado
const draw = () => {
  const canvas = gameCanvas.value;
  const context = ctx.value;

  // Limpiar canvas
  context.fillStyle = '#1a1a1a';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar pelota
  context.beginPath();
  context.arc(ball.value.x, ball.value.y, ballRadius, 0, Math.PI * 2);
  context.fillStyle = '#FF5252';
  context.fill();
  context.closePath();

  // Dibujar arco que sigue al mouse
  context.beginPath();
  context.arc(mousePos.value.x, mousePos.value.y, arcRadius, 0, Math.PI * 2);
  context.strokeStyle = 'yellow'; // Color del borde
  context.lineWidth = 2; // Grosor del borde
  context.stroke();
  context.closePath();
};

// Game loop
const gameLoop = () => {
  if (!isPlaying.value) return;
  
  update();
  draw();
  animationId = requestAnimationFrame(gameLoop);
};

const endGame = () => {
  isPlaying.value = false;
  gameOver.value = true;
  if (timerInterval) clearInterval(timerInterval);
  if (animationId) cancelAnimationFrame(animationId);
};

// Lifecycle hooks
onMounted(() => {
  const canvas = gameCanvas.value;
  ctx.value = canvas.getContext('2d');
  
  // Configurar tamaño del canvas
  canvas.width = 800;
  canvas.height = 600;

  // Agregar event listener para el mouse
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mousePos.value.x = event.clientX - rect.left;
    mousePos.value.y = event.clientY - rect.top;
  });

  // Dibujar estado inicial
  draw();
});

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
  if (animationId) cancelAnimationFrame(animationId);
});
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #282c34;
  padding: 20px;
  min-height: 75vh;
}

.game-canvas {
  border: 2px solid var(--borde);
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(97, 218, 251, 0.3);
  cursor: crosshair;
}

.game-info {
  display: flex;
  justify-content: space-between;
  width: 600px;
  color: #ffffff;
  font-size: 20px;
  margin-bottom: 20px;
}

.start-screen {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(40, 44, 52, 0.9);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: #ffffff;
}

.start-screen h2 {
  color: var(--texto);
  margin-bottom: 10px;
}

.start-screen button {
  margin-top: 15px;
  padding: 10px 20px;
  font-size: 16px;
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