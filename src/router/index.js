import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/components/Home";
import SingleRoom from "@/components/SingleRoom";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/room/:roomId",
      component: SingleRoom
    }
  ]
});
