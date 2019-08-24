import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

axios.interceptors.request.use(
  config => {
    config.headers.Authorization = "Bearer " + process.env.VUE_APP_MY_TOKEN;
    config.headers.Accept = "application/json";
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
