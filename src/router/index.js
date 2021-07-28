import { createRouter, createWebHistory } from "vue-router";
import Overview from "@/views/Overview.vue";

const routes = [
  {
    path: "/",
    name: "Overview",
    component: Overview,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
