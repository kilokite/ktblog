<template>
    <v-app>
        <v-app-bar>
            <v-btn icon="mdi-menu" @click="drawer = !drawer"></v-btn>
            <v-toolbar-title class="brand-logo-title">
                <img
                    class="brand-logo"
                    :src="logoSrc"
                    alt=""
                    width="138"
                    height="37"
                />
            </v-toolbar-title>
            <slot name="bar" />
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" expand-on-hover :permanent="!isMobile" :rail="!isMobile"
            :temporary="isMobile">
            <slot name="drawer" />
        </v-navigation-drawer>
        <v-main>
            <div class="main">
                <slot />
                <router-view v-slot="{ Component }">
                    <transition name="slide-fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </v-main>
        <Auth v-if="!mainStore.authenticated" />
    </v-app>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useTheme } from 'vuetify';
import Auth from '../compose/Auth.vue';
import { useMainStore } from '../../store/mainStore';
import logoLight from '../../../../share_assets/logo.svg?url';
import logoDark from '../../../../share_assets/logo_dark.svg?url';

const mainStore = useMainStore();
const theme = useTheme();
const logoSrc = computed(() =>
    theme.global.current.value.dark ? logoDark : logoLight,
);

const drawer = ref(false);
const isMobile = ref(false);
onMounted(() => {
    isMobile.value = window.innerWidth < 1000;
    addEventListener('resize', () => {
        isMobile.value = window.innerWidth < 1000;
    });
});
</script>

<style scoped>
.main {
    padding: 10px;
}

.brand-logo-title {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    overflow: visible;
}

.brand-logo {
    display: block;
    height: 28px;
    width: auto;
}
</style>