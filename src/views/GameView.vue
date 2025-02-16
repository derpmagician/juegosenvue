<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'; // Importa useRoute
//import PointCatchingGame from '@/components/games/PointCatchingGame.vue'; // Importa el juego de caza de puntos
import FreeDrawingGame from '../components/games/FreeDrawingGame.vue'; // Importa el juego de dibujo libre
//import PongGame from '@/components/games/PongGame.vue'; // Importa el juego de Pong
import SnakeGame from '../components/games/SnakeGame.vue'; // Importa el juego de Snake
console.log("Juegos")

const currentGame = ref(null);
const route = useRoute(); // Obtiene la ruta actual

const loadGame = () => {
	const game = route.query.game; // Obtiene el juego de los parámetros de consulta

	if (game === 'freeDrawing') {
		currentGame.value = FreeDrawingGame;
	} else if (game === 'snake') {
		currentGame.value = SnakeGame;
	}
};

// Cargar el juego al crear el componente
loadGame();

// Observa cambios en el objeto de ruta
watch(route, () => {
	loadGame(); // Llama a loadGame para actualizar el componente
});
</script>

<template>
	<div>
		<component :is="currentGame" />
	</div>
</template>

<style scoped>
/* Estilos para GameView */
</style>