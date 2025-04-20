// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/image",
  ],

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "Workout Log",
      link: [{ rel: "icon", type: "image/svg-xml", href: "/logo.svg" }],
    },
  },
});
