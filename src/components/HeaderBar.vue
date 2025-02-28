<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleGameSelect = (event) => {
  const game = event.target.value;
  router.push(`/game?game=${game}`);
};

const handleCodeSelect = (event) => {
  const code = event.target.value;
  router.push(`/code?code=${code}`);
};

const goHome = () => {
  router.push('/home');
};
</script>

<template>
  <div class="header-bar">
    <button class="home-button" @click="goHome">
      🏠 Home
    </button>
    <div class="select-container">
      <select @change="handleGameSelect" class="game-select">
        <option value="" disabled selected>Juegos</option>
        <optgroup label="Juegos">
          <option value="pointCatching">Point Catching</option>
          <option value="pong">Pong</option>
          <option value="snake">Snake</option>
          <option value="mastermind">Mastermind</option>
        </optgroup>
        <optgroup label="Apps">
          <option value="freeDrawing">Free Drawing</option>
        </optgroup>
      </select>
    </div>
    <div class="select-container">
      <select @change="handleCodeSelect" class="game-select">
        <option value="" disabled selected>Codigos</option>
        <optgroup label="Codigos">
          <option value="pointCatching">Point Catching</option>
          <option value="pong">Pong</option>
          <option value="snake">Snake</option>
          <option value="mastermind">Mastermind</option>
        </optgroup>
        <optgroup label="Apps">
          <option value="freeDrawing">Free Drawing</option>
        </optgroup>
      </select>
    </div>
  </div>
</template>

<style scoped>
.header-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #282c34;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  gap: 20px;
}

.home-button {
  padding: 8px 16px;
  font-size: 16px;
  background-color: var(--boton);
  color: #282c34;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
}

.home-button:hover {
  background-color: var(--boton-o);
}

.select-container {
  position: relative;
  width: 200px;
}

.game-select {
  width: 100%;
  padding: 8px 12px;
  font-size: 16px;
  border: 2px solid var(--borde);
  border-radius: 5px;
  background-color: #282c34;
  color: var(--letras);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.select-container::after {
  content: '▼';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--letras);
  pointer-events: none;
}

.game-select:hover {
  border-color: var(--boton);
}

.game-select:focus {
  outline: none;
  border-color: var(--boton);
  box-shadow: 0 0 5px rgba(97, 218, 251, 0.3);
}

.game-select option,
.game-select optgroup {
  background-color: #282c34;
  color: var(--letras);
}

.game-select option:hover {
  background-color: var(--boton);
}

.game-select optgroup {
  font-weight: bold;
  color: var(--boton);
}
</style>