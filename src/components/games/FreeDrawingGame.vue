<template>
  <div class="drawing-app">
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
  </div>
  
  <div class="tutorial">
    <h2>Tutorial: Desarrollo Completo de la Aplicación de Dibujo</h2>
    
    <div class="tutorial-section">
      <h3>1. Importaciones y Configuración Inicial</h3>
      <pre><code>import { ref, onMounted, onBeforeUnmount } from 'vue';

// Referencias y variables reactivas
const canvas = ref(null);
const ctx = ref(null);
const isDrawing = ref(false);
const lastX = ref(0);
const lastY = ref(0);</code></pre>
      <p>
        - Importamos las funciones necesarias de Vue 3 Composition API.<br>
        - <code>ref()</code>: Crea referencias reactivas para las variables.<br>
        - <code>canvas</code>: Referencia al elemento canvas HTML.<br>
        - <code>ctx</code>: Contexto 2D del canvas para dibujar.<br>
        - <code>isDrawing</code>: Control del estado de dibujo.<br>
        - <code>lastX/lastY</code>: Coordenadas del último punto dibujado.
      </p>
    </div>

    <div class="tutorial-section">
      <h3>2. Configuración de Herramientas de Dibujo</h3>
      <pre><code>const currentColor = ref('#61dafb');
const colors = ref(['#61dafb', '#ff5733', '#33ff57', '#3357ff', '#ff33a1']);
const brushSize = ref(5);
const selectedBrush = ref('round');</code></pre>
      <p>
        - <code>currentColor</code>: Color actual del pincel.<br>
        - <code>colors</code>: Array de colores predefinidos.<br>
        - <code>brushSize</code>: Tamaño del pincel (1-50px).<br>
        - <code>selectedBrush</code>: Tipo de pincel (redondo/cuadrado).
      </p>
    </div>

    <div class="tutorial-section">
      <h3>3. Eventos de Dibujo</h3>
      <pre><code>const startDrawing = (event) => {
  isDrawing.value = true;
  [lastX.value, lastY.value] = getMousePosition(event);
};

const stopDrawing = () => {
  isDrawing.value = false;
  ctx.value.beginPath();
};</code></pre>
      <p>
        - <code>startDrawing</code>: Inicia el proceso de dibujo al presionar el mouse/touch.<br>
        - <code>stopDrawing</code>: Detiene el dibujo al soltar el mouse/touch.<br>
        - <code>beginPath()</code>: Reinicia el trazo para el siguiente dibujo.
      </p>
    </div>

    <div class="tutorial-section">
      <h3>4. Proceso Principal de Dibujo</h3>
      <pre><code>const draw = (event) => {
  if (!isDrawing.value) return;

  const [x, y] = getMousePosition(event);
  ctx.value.lineWidth = brushSize.value;
  ctx.value.lineCap = selectedBrush.value;
  ctx.value.strokeStyle = currentColor.value;

  ctx.value.beginPath();
  ctx.value.moveTo(lastX.value, lastY.value);
  ctx.value.lineTo(x, y);
  ctx.value.stroke();
  ctx.value.closePath();

  [lastX.value, lastY.value] = [x, y];
};</code></pre>
      <p>
        - Verifica si está en modo dibujo.<br>
        - Obtiene la posición actual del cursor.<br>
        - Configura el estilo de línea (grosor, tipo, color).<br>
        - Dibuja una línea desde el punto anterior al actual.<br>
        - Actualiza la última posición para el siguiente trazo.
      </p>
    </div>

    <div class="tutorial-section">
      <h3>5. Utilidades y Helpers</h3>
      <pre><code>const getMousePosition = (event) => {
  const rect = canvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x, y];
};</code></pre>
      <p>
        - Calcula las coordenadas exactas del cursor dentro del canvas.<br>
        - Considera la posición del canvas en la página.
      </p>
    </div>

    <div class="tutorial-section">
      <h3>6. Ciclo de Vida del Componente</h3>
      <pre><code>onMounted(() => {
  ctx.value = canvas.value.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas);
});</code></pre>
      <p>
        - <code>onMounted</code>: Inicializa el canvas y configura los listeners.<br>
        - <code>onBeforeUnmount</code>: Limpia los listeners al desmontar el componente.
      </p>
    </div>

    <div class="tutorial-section">
      <h3>7. Responsive Design</h3>
      <pre><code>const resizeCanvas = () => {
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight - 100;
};</code></pre>
      <p>
        - Ajusta el tamaño del canvas al tamaño de la ventana.<br>
        - Se ejecuta al montar el componente y en cada resize de la ventana.
      </p>
    </div>

    <div class="tutorial-section">
      <h3>8. Gestión de Herramientas</h3>
      <pre><code>const setColor = (color) => {
  currentColor.value = color;
};

const updateColor = () => {
  currentColor.value = currentColor.value;
};

const updateBrush = () => {
  // Lógica adicional para el pincel
};</code></pre>
      <p>
        - <code>setColor</code>: Actualiza el color del pincel.<br>
        - <code>updateColor</code>: Maneja cambios en el selector de color.<br>
        - <code>updateBrush</code>: Gestiona cambios en el tipo de pincel.
      </p>
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

.tutorial {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #1e2127;
  border-radius: 8px;
  color: #ffffff;
}

.tutorial-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #282c34;
  border-radius: 4px;
}

.tutorial-section h3 {
  color: #61dafb;
  margin-bottom: 1rem;
}

.tutorial-section pre {
  background-color: #1a1d23;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

.tutorial-section code {
  color: #98c379;
  font-family: monospace;
}

.tutorial-section p {
  margin-top: 1rem;
  color: #abb2bf;
  line-height: 1.5;
}
</style> 