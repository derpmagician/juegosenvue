<template>
  <div class="drawing-app">
    <div class="tutorial-button">
      <button @click="showTutorial = true">Tutorial</button>
    </div>
    <div class="controls">
      <!-- Selector de color -->
      <div class="color-picker">
        <input type="color" v-model="currentColor" @input="updateColor" />
        <button v-for="color in colors" :key="color" :style="{ backgroundColor: color }" @click="setColor(color)"></button>
      </div>
      
      <!-- Control deslizante para el tamaño del pincel -->
      <div class="brush-size">
        <label for="brushSize">Tamaño del pincel: {{ brushSize }}</label>
        <input type="range" id="brushSize" v-model="brushSize" min="1" max="50" />
      </div>
      
      <!-- Selector de tipo de pincel -->
      <div class="brush-type">
        <label for="brushType">Tipo de pincel:</label>
        <select v-model="selectedBrush" @change="updateBrush">
          <option value="round">Redondo</option>
          <option value="square">Cuadrado</option>
        </select>
      </div>
    </div>
    
    <!-- Canvas para dibujar -->
    <canvas ref="canvas" class="drawing-canvas" 
            @mousedown="startDrawing" 
            @mouseup="stopDrawing" 
            @mousemove="draw" 
            @touchstart="startDrawing" 
            @touchend="stopDrawing" 
            @touchmove="draw"></canvas>

    <!-- Modal de Tutorial -->
    <div v-if="showTutorial" class="tutorial-modal">
      <div class="tutorial-content">
        <h2>Tutorial de Dibujo Libre</h2>
        <ul>
          <li>🎨 Usa el selector de color o los botones predefinidos para cambiar el color</li>
          <li>📏 Ajusta el tamaño del pincel con el control deslizante</li>
          <li>✏️ Cambia entre pincel redondo y cuadrado</li>
          <li>🖱️ Haz clic y arrastra para dibujar</li>
          <li>📱 También funciona con pantalla táctil</li>
        </ul>
        <button @click="showTutorial = false">Cerrar</button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Referencias y variables reactivas
const canvas = ref(null);
const ctx = ref(null);
const isDrawing = ref(false);
const lastX = ref(0);
const lastY = ref(0);
const currentColor = ref('#61dafb'); // Color inicial
const colors = ref(['#61dafb', '#ff5733', '#33ff57', '#3357ff', '#ff33a1']); // Colores predefinidos
const brushSize = ref(5); // Tamaño inicial del pincel
const selectedBrush = ref('round'); // Tipo de pincel seleccionado
const showTutorial = ref(false);

// Función para iniciar el dibujo
const startDrawing = (event) => {
  isDrawing.value = true;
  [lastX.value, lastY.value] = getMousePosition(event);
};

// Función para detener el dibujo
const stopDrawing = () => {
  isDrawing.value = false;
  ctx.value.beginPath(); // Reinicia el trazo
};

// Función para dibujar en el canvas
const draw = (event) => {
  if (!isDrawing.value) return; // No dibujar si no se está presionando el ratón

  const [x, y] = getMousePosition(event);
  ctx.value.lineWidth = brushSize.value; // Grosor de la línea basado en el tamaño del pincel
  ctx.value.lineCap = selectedBrush.value; // Estilo de la línea basado en el tipo de pincel
  ctx.value.strokeStyle = currentColor.value; // Color de la línea

  ctx.value.beginPath();
  ctx.value.moveTo(lastX.value, lastY.value);
  ctx.value.lineTo(x, y);
  ctx.value.stroke();
  ctx.value.closePath();

  [lastX.value, lastY.value] = [x, y]; // Actualiza la posición anterior
};

// Función para obtener la posición del ratón
const getMousePosition = (event) => {
  const rect = canvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x, y];
};

// Configura el canvas al montar el componente
onMounted(() => {
  ctx.value = canvas.value.getContext('2d'); // Obtiene el contexto 2D del canvas
  resizeCanvas(); // Ajusta el tamaño del canvas
  window.addEventListener('resize', resizeCanvas); // Escucha cambios en el tamaño de la ventana
});

// Limpia el evento al desmontar el componente
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas); // Elimina el listener al desmontar
});

// Ajusta el tamaño del canvas
const resizeCanvas = () => {
  canvas.value.width = window.innerWidth; // Ancho del canvas
  canvas.value.height = window.innerHeight - 100; // Altura del canvas
};

// Función para establecer el color seleccionado
const setColor = (color) => {
  currentColor.value = color; // Cambia el color actual
};

// Función para actualizar el color desde el selector
const updateColor = () => {
  currentColor.value = currentColor.value; // Actualiza el color actual
};

// Función para actualizar el tipo de pincel
const updateBrush = () => {
  // Aquí puedes agregar lógica adicional si es necesario
};
</script>

<style scoped>
.drawing-app {
  display: flex;
  flex-direction: column; /* Cambia a columna para el selector de color */
  align-items: center;
  height: 100vh; /* Altura completa de la ventana */
  background-color: #282c34; /* Color de fondo */
}

.controls {
  margin-bottom: 10px; /* Espacio entre los controles y el canvas */
}

.color-picker {
  display: flex;
  align-items: center;
}

.color-picker button {
  width: 30px;
  height: 30px;
  border: none;
  margin-right: 5px;
  cursor: pointer;
  border-radius: 50%; /* Botones redondeados */
}

.brush-size {
  display: flex;
  align-items: center;
  margin-left: 20px; /* Espacio entre el selector de color y el tamaño del pincel */
}

.brush-type {
  display: flex;
  align-items: center;
  margin-left: 20px; /* Espacio entre el tamaño del pincel y el tipo de pincel */
}

.drawing-canvas {
  border: 1px solid #61dafb; /* Borde del canvas */
  touch-action: none; /* Desactiva el comportamiento táctil predeterminado */
}

.tutorial-button {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.tutorial-button button {
  background-color: var(--boton);
  color: #282c34;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.tutorial-button button:hover {
  background-color: #4fa8d3;
}

.tutorial-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.tutorial-content {
  background-color: #282c34;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  color: #ffffff;
}

.tutorial-content h2 {
  color: #61dafb;
  margin-bottom: 20px;
}

.tutorial-content ul {
  list-style-type: none;
  padding: 0;
}

.tutorial-content li {
  margin: 15px 0;
  font-size: 16px;
}

.tutorial-content button {
  margin-top: 20px;
  padding: 8px 16px;
  background-color: var(--boton);
  color: #282c34;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.tutorial-content button:hover {
  background-color: #4fa8d3;
}
</style> 