import { defineStore } from "pinia";
export const useMainStore = defineStore("main", {
    state: () => ({
        token: localStorage.getItem("token") as string | null,
    }),
    getters: {
        authenticated: (state) => !!state.token,
    },
    actions: {
        setToken(token: string | null) {
            this.token = token;
            if (token) localStorage.setItem("token", token);
            else localStorage.removeItem("token");
        },
    },
});
