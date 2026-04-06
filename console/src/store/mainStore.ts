import { defineStore } from "pinia";
export const useMainStore = defineStore("main", {
    state: () => ({
        token: null as string | null,
    }),
    getters: {
        authenticated: (state) => !!state.token,
    },
});
