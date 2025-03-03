<template>
  <div :class="{ 'mobile': isMobile }">

  </div>
</template>

<script>
import { useDevice } from '@/composables/useDevice';

export default {
  setup() {
    const { isMobile } = useDevice();
    return { isMobile };
  },
};
</script>

<style>
.mobile {
  /* Estilos específicos para dispositivos móviles */
  background-color: lightblue;

}
</style> 