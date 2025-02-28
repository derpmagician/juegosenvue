<template>
  <div class="snake-container">
    <canvas ref="gameCanvas" class="snake-canvas"></canvas>
    <div class="game-info">
      <div class="score">Puntuación: {{ score }}</div>
      <div class="high-score">Máxima Puntuación: {{ highScore }}</div>
    </div>
    <div v-if="gameOver" class="game-over">
      <h2>¡Juego Terminado!</h2>
      <p>Puntuación Final: {{ score }}</p>
      <button @click="startGame">Jugar de Nuevo</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Referencias y variables del juego
const gameCanvas = ref(null);
const ctx = ref(null);
const gameOver = ref(true);
const score = ref(0);
const highScore = ref(0);

// Configuración del juego
const gridSize = 20;
const tileCount = 20;
const initialSpeed = 240;

// Estado del juego
const snake = ref([
  { x: 10, y: 10 } // Posición inicial de la serpiente
]);
const food = ref({ x: 15, y: 15 }); // Posición inicial de la comida
const direction = ref({ x: 0, y: 0 }); // Dirección inicial
const speed = ref(initialSpeed);
const isStarted = ref(false); // Nueva variable para controlar si el juego ha comenzado
let gameLoop = null;

// Inicialización del juego
const startGame = () => {
  gameOver.value = false;
  isStarted.value = false;
  score.value = 0;
  snake.value = [{ x: 10, y: 10 }];
  direction.value = { x: 0, y: 0 };
  speed.value = initialSpeed;
  spawnFood();
  draw();
};

// Generar nueva posición para la comida
const spawnFood = () => {
  food.value = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
  // Evitar que la comida aparezca sobre la serpiente
  const isOnSnake = snake.value.some(segment => 
    segment.x === food.value.x && segment.y === food.value.y
  );
  if (isOnSnake) spawnFood();
};

// Control del juego
const handleKeyDown = (e) => {
  if (gameOver.value) return;

  let newDirection = { x: 0, y: 0 };
  switch (e.key) {
    case 'ArrowUp':
      if (direction.value.y === 0) newDirection = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.value.y === 0) newDirection = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.value.x === 0) newDirection = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.value.x === 0) newDirection = { x: 1, y: 0 };
      break;
    default:
      return;
  }

  // Si es un movimiento válido
  if (newDirection.x !== 0 || newDirection.y !== 0) {
    direction.value = newDirection;
    
    // Iniciar el juego si aún no ha comenzado
    if (!isStarted.value) {
      isStarted.value = true;
      if (gameLoop) clearInterval(gameLoop);
      gameLoop = setInterval(update, speed.value);
    }
  }
};

// Actualización del juego
const update = () => {
  if (gameOver.value || !isStarted.value) return;

  // Mover la serpiente
  const head = { ...snake.value[0] };
  head.x += direction.value.x;
  head.y += direction.value.y;

  // Comprobar colisiones con los bordes
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    endGame();
    return;
  }

  // Comprobar colisiones con la serpiente
  if (snake.value.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  // Añadir nueva cabeza
  snake.value.unshift(head);

  // Comprobar si come
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10;
    if (score.value > highScore.value) {
      highScore.value = score.value;
    }
    spawnFood();
    // Aumentar velocidad
    if (speed.value > 50) {
      speed.value -= 5;
      clearInterval(gameLoop);
      gameLoop = setInterval(update, speed.value);
    }
  } else {
    // Si no come, eliminar la cola
    snake.value.pop();
  }
};

const endGame = () => {
  gameOver.value = true;
  clearInterval(gameLoop);
};

// Renderizado
const draw = () => {
  const canvas = gameCanvas.value;
  const context = ctx.value;

  // Limpiar canvas
  context.fillStyle = '#1a1a1a';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar serpiente
  context.fillStyle = '#4CAF50';
  snake.value.forEach(segment => {
    context.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  });

  // Dibujar comida
  context.fillStyle = '#FF5252';
  context.fillRect(
    food.value.x * gridSize,
    food.value.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );

  // Solicitar siguiente frame
  requestAnimationFrame(draw);
};

// Lifecycle hooks
onMounted(() => {
  const canvas = gameCanvas.value;
  ctx.value = canvas.getContext('2d');
  
  // Configurar tamaño del canvas
  canvas.width = gridSize * tileCount;
  canvas.height = gridSize * tileCount;

  // Agregar event listener
  window.addEventListener('keydown', handleKeyDown);

  // Iniciar renderizado
  draw();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  if (gameLoop) clearInterval(gameLoop);
});
</script>

<style scoped>
.snake-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #282c34;
  padding: 20px;
  min-height: 75vh;
}

.snake-canvas {
  border: 2px solid #61dafb;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(97, 218, 251, 0.3);
}

.game-info {
  display: flex;
  justify-content: space-between;
  width: 400px;
  color: #ffffff;
  font-size: 20px;
  margin-bottom: 20px;
}

.game-over {
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

.game-over h2 {
  color: var(--boton);
  margin-bottom: 10px;
}

.game-over button {
  margin-top: 15px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.game-over button:hover {
  background-color: #45a049;
}
</style> 