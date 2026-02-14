import { createApp } from "vue";
import autofit from "autofit.js";
import App from "./App.vue";
import "./styles/main.css";

autofit.init({
  dw: 812,
  dh: 375,
  el: "body",
  resize: true,
});

createApp(App).mount("#app");
