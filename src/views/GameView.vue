<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import PointCatchingGame from '@/components/games/PointCatchingGame.vue';
import FreeDrawingGame from '@/components/games/FreeDrawingGame.vue';
import PongGame from '@/components/games/PongGame.vue';
import SnakeGame from '@/components/games/SnakeGame.vue';
import MastermindGame from '@/components/games/MastermindGame.vue';

const currentGame = ref(null);
const route = useRoute(); // Obtiene la ruta actual

const loadGame = () => {
	const game = route.query.game; // Obtiene el juego de los parámetros de consulta

	if (game === 'freeDrawing') {
		currentGame.value = FreeDrawingGame;
	} else if (game === 'pong') {
		currentGame.value = PongGame;
	} else if (game === 'snake') {
		currentGame.value = SnakeGame;
	} else if (game === 'pointCatching') {
		currentGame.value = PointCatchingGame;
	} else if (game === 'mastermind') {
		currentGame.value = MastermindGame;
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