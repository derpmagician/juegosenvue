import { ref, onMounted } from 'vue';

export function useDevice() {
    const isMobile = ref(false);

    const checkDevice = () => {
        isMobile.value = /Mobi|Android/i.test(navigator.userAgent);
    };

    onMounted(() => {
        checkDevice();
    });

    return {
        isMobile,
    };
} 