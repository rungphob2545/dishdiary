import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";
import RecipeIns from "../pages/RecipeIns.vue";

const history = createWebHashHistory(import.meta.env.BASE_URL);

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/recipe/:id", component: RecipeIns, name: "RecipeIns", props: true },
];

const router = createRouter({
  history,
  routes,
});

export default router;
