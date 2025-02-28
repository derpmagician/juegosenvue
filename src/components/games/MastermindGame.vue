<template>
  <div class="mastermind-container">
    <div class="game-info">
      <div class="attempts">Intentos: {{ attempts }}/{{ maxAttempts }}</div>
      <div v-if="gameOver" class="game-over">
        <h2>{{ won ? '¡Felicitaciones!' : 'Juego Terminado' }}</h2>
        <p>{{ won ? 'Has descubierto el código!' : 'El código era:' }}</p>
        <div class="code-display">
          <div v-for="(color, index) in secretCode" 
               :key="index" 
               class="peg" 
               :style="{ backgroundColor: color }">
          </div>
        </div>
        <button @click="startGame">Jugar de Nuevo</button>
      </div>
    </div>

    <div class="game-board">
      <!-- Tablero de intentos -->
      <div class="attempts-board">
        <div v-for="(attempt, rowIndex) in attemptsHistory" 
             :key="rowIndex" 
             class="attempt-row">
          <!-- Colores intentados -->
          <div class="pegs">
            <div v-for="(color, pegIndex) in attempt.colors" 
                 :key="pegIndex" 
                 class="peg"
                 :style="{ backgroundColor: color }">
            </div>
          </div>
          <!-- Pistas -->
          <div class="hints">
            <div v-for="(hint, hintIndex) in attempt.hints" 
                 :key="hintIndex" 
                 class="hint"
                 :class="hint">
            </div>
          </div>
        </div>
      </div>

      <!-- Fila actual de selección -->
      <div class="current-row" v-if="!gameOver">
        <div class="pegs">
          <div v-for="(color, index) in currentAttempt" 
               :key="index" 
               class="peg"
               :style="{ backgroundColor: color || '#666' }"
               @click="selectPegIndex(index)">
          </div>
        </div>
      </div>

      <!-- Selector de colores -->
      <div class="color-selector">
        <div v-for="color in availableColors" 
             :key="color" 
             class="color-option"
             :style="{ backgroundColor: color }"
             @click="selectColor(color)">
        </div>
        <button class="check-button" 
                @click="checkAttempt" 
                :disabled="!isAttemptComplete">
          Verificar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Configuración del juego
const codeLength = 4;
const maxAttempts = 20;
const availableColors = [
  '#ff0000', // rojo
  '#00ff00', // verde
  '#0000ff', // azul
  '#ffff00', // amarillo
  '#ff00ff', // magenta
  '#00ffff'  // cyan
];

// Estado del juego
const secretCode = ref([]);
const attemptsHistory = ref([]);
const currentAttempt = ref(Array(codeLength).fill(null));
const selectedPegIndex = ref(0);
const attempts = ref(0);
const gameOver = ref(false);
const won = ref(false);

// Computed properties
const isAttemptComplete = computed(() => {
  return currentAttempt.value.every(color => color !== null);
});

// Inicialización del juego
const startGame = () => {
  // Generar código secreto aleatorio
  secretCode.value = Array(codeLength).fill(0).map(() => {
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  });
  
  // Reiniciar estado del juego
  attemptsHistory.value = [];
  currentAttempt.value = Array(codeLength).fill(null);
  selectedPegIndex.value = 0;
  attempts.value = 0;
  gameOver.value = false;
  won.value = false;
};

// Selección de colores y posiciones
const selectPegIndex = (index) => {
  selectedPegIndex.value = index;
};

const selectColor = (color) => {
  currentAttempt.value[selectedPegIndex.value] = color;
  selectedPegIndex.value = (selectedPegIndex.value + 1) % codeLength;
};

// Verificación del intento
const checkAttempt = () => {
  if (!isAttemptComplete.value) return;

  const hints = [];
  const secretCodeCopy = [...secretCode.value];
  const attemptCopy = [...currentAttempt.value];

  // Verificar posiciones exactas (negro)
  for (let i = 0; i < codeLength; i++) {
    if (attemptCopy[i] === secretCodeCopy[i]) {
      hints.push('black');
      secretCodeCopy[i] = null;
      attemptCopy[i] = null;
    }
  }

  // Verificar colores correctos en posición incorrecta (blanco)
  for (let i = 0; i < codeLength; i++) {
    if (attemptCopy[i] !== null) {
      const colorIndex = secretCodeCopy.indexOf(attemptCopy[i]);
      if (colorIndex !== -1) {
        hints.push('white');
        secretCodeCopy[colorIndex] = null;
      }
    }
  }

  // Guardar el intento y sus pistas
  attemptsHistory.value.push({
    colors: [...currentAttempt.value],
    hints: hints.sort() // Ordenar para no dar pistas sobre la posición
  });

  attempts.value++;

  // Verificar victoria
  if (hints.length === codeLength && hints.every(hint => hint === 'black')) {
    gameOver.value = true;
    won.value = true;
  } else if (attempts.value >= maxAttempts) {
    gameOver.value = true;
  }

  // Reiniciar intento actual
  currentAttempt.value = Array(codeLength).fill(null);
  selectedPegIndex.value = 0;
};

// Iniciar juego al montar el componente
startGame();
</script>

<style scoped>
.mastermind-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #282c34;
  min-height: 75vh;
}

.game-board {
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.attempt-row {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.pegs {
  display: flex;
  gap: 10px;
}

.peg {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #444;
  cursor: pointer;
}

.hints {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  margin-left: 20px;
}

.hint {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid #444;
}

.hint.black {
  background-color: #000;
}

.hint.white {
  background-color: #fff;
}

.color-selector {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding: 10px;
  background-color: #333;
  border-radius: 5px;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #444;
  transition: transform 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.check-button {
  padding: 0 20px;
  background-color: var(--boton);
  border: none;
  border-radius: 5px;
  color: #282c34;
  cursor: pointer;
  font-weight: bold;
}

.check-button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.game-info {
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
}

.game-over {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(40, 44, 52, 0.95);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.code-display {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: var(--boton);
  border: none;
  border-radius: 4px;
  color: #282c34;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #4fa8d3;
}
</style> 