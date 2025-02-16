<script setup>

</script>

<template>
  <div class="header-bar">
    <div class="links">
      <div class="button-container">
        <router-link to="/home">Home</router-link>
        <router-link to="/game?game=freeDrawing">FreeDrawing</router-link>
        <router-link to="/game?game=snake">Snake</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #282c34; /* Color de fondo oscuro */
  padding: 1rem 2rem; /* Espaciado interno */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra sutil */
}

.links {
  display: flex;
  gap: 1.5rem; /* Espacio entre los enlaces */
}

.button-container {
  display: flex;
  align-items: center;
}

a{
  color: #61dafb; /* Color de texto */
  text-decoration: none; /* Sin subrayado */
  padding: 0.5rem 1rem; /* Espaciado interno */
  border-radius: 5px; /* Bordes redondeados */
  transition: background-color 0.3s, color 0.3s; /* Transición suave */
}

a:hover {
  background-color: rgba(97, 218, 251, 0.2); /* Color de fondo al pasar el mouse */
  color: #ffffff; /* Color de texto al pasar el mouse */
}
</style>