<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
// import PointCatchingCodeExample from '@/components/codeExamples/PointCatchingCodeExample.vue';
import FreeDrawingCodeExample from '@/components/codeExamples/FreeDrawingCodeExample.vue';
// import PongCodeExample from '@/components/codeExamples/PongCodeExample.vue';
// import SnakeCodeExample from '@/components/codeExamples/SnakeCodeExample.vue';
// import MastermindCodeExample from '@/components/codeExamples/MastermindCodeExample.vue';

const currentCode = ref(null);
const route = useRoute();

const loadCode = () => {
	const code = route.query.code;

	if (code === 'freeDrawing') {
		currentCode.value = FreeDrawingCodeExample;
	} else if (code === 'pong') {
		currentCode.value = PongCodeExample;
	} else if (code === 'snake') {
		currentCode.value = SnakeCodeExample;
	} else if (code === 'pointCatching') {
		currentCode.value = PointCatchingCodeExample;
	} else if (code === 'mastermind') {
		currentCode.value = MastermindCodeExample;
	}
};

loadCode();

watch(route, () => {
	loadCode();
});
</script>

<template>
	<div class="code-view">
		<component :is="currentCode" />
	</div>
</template>

<style>
.code-view {
	padding: 20px;
	background-color: #282c34;
	min-height: 75vh;
	color: var(--letras);
}

/* Estilos para los bloques de código */
.code-block {
	background-color: #1e1e1e;
	border-radius: 8px;
	padding: 20px;
	margin: 20px 0;
	overflow-x: auto;
}

/* Estilos para las pestañas de archivos */
.file-tabs {
	display: flex;
	gap: 10px;
	margin-bottom: 20px;
	overflow-x: auto;
	padding-bottom: 10px;
}

.file-tab {
	padding: 8px 16px;
	background-color: #363636;
	border: none;
	border-radius: 4px;
	color: var(--letras);
	cursor: pointer;
	transition: background-color 0.3s;
}

.file-tab.active {
	background-color: var(--boton);
	color: #282c34;
}

/* Estilos para la documentación */
.documentation {
	max-width: 800px;
	margin: 0 auto;
}

.documentation h2 {
	color: var(--boton);
	margin: 30px 0 15px;
}

.documentation h3 {
	color: var(--texto);
	margin: 20px 0 10px;
}

.documentation p {
	line-height: 1.6;
	margin-bottom: 15px;
}

.documentation ul {
	padding-left: 20px;
	margin-bottom: 15px;
}

.documentation li {
	margin-bottom: 8px;
}

/* Estilos para resaltado de sintaxis */
.code-block pre {
	margin: 0;
	padding: 15px;
	border-radius: 6px;
	background-color: #1a1a1a;
}

.code-block code {
	font-family: 'Fira Code', monospace;
	font-size: 14px;
	line-height: 1.5;
}

/* Estilos para las secciones de ejemplo */
.example-section {
	margin: 30px 0;
	padding: 20px;
	background-color: #363636;
	border-radius: 8px;
}

.example-section h4 {
	color: var(--boton);
	margin-bottom: 15px;
}

/* Estilos para los botones de copiar código */
.copy-button {
	position: absolute;
	top: 10px;
	right: 10px;
	padding: 6px 12px;
	background-color: var(--boton);
	color: #282c34;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s;
}

.copy-button:hover {
	background-color: var(--boton-o);
}

/* Estilos para los mensajes de información */
.info-box {
	padding: 15px;
	margin: 15px 0;
	border-left: 4px solid var(--boton);
	background-color: #363636;
	border-radius: 0 4px 4px 0;
}

/* Estilos responsivos */
@media (max-width: 768px) {
	.code-view {
		padding: 10px;
	}

	.documentation {
		padding: 0 10px;
	}

	.code-block {
		margin: 10px 0;
		padding: 15px;
	}
}
</style>