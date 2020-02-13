import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import { MdSwitch, MdButton, MdField } from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

Vue.use(MdSwitch);
Vue.use(MdButton);
Vue.use(MdField);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
