//save the theme to the localstorage so that every time we refresh the page we have the selected theme
import { create } from "zustand";


export const usethemeStore = create((set) =>({
    theme:localStorage.getItem("chat-theme") || "coffee",
    setTheme:(theme)=> {
        localStorage.setItem("chat-theme",theme);
        set({theme});
    },

}))