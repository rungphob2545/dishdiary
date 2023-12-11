import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";
import RecipeIns from "../pages/RecipeIns.vue";
import MyOrder from "../pages/MyOrder.vue";
import Admin from "../pages/Admin.vue";

const history = createWebHashHistory(import.meta.env.BASE_URL);

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/recipe/:id", component: RecipeIns, name: "RecipeIns", props: true },
  { path: "/order/:id", component: MyOrder, name: "MyOrder" },
  { path: "/admin", component: Admin, name: "Admin" },
];

const router = createRouter({
  history,
  routes,
});

export default router;
