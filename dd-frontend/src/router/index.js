import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";
import RecipeIns from "../pages/RecipeIns.vue";
import MyOrder from "../pages/MyOrder.vue";
import Admin from "../pages/Admin.vue";
import Category from "../pages/Category.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";

const history = createWebHashHistory(import.meta.env.BASE_URL);

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/recipe/:id", component: RecipeIns, name: "RecipeIns", props: true },
  { path: "/order/:id", component: MyOrder, name: "MyOrder" },
  { path: "/recipe/category/:id", component: Category, name: "Category" },
  { path: "/admin", component: Admin, name: "Admin" },
  { path: "/account/login", component: Login, name: "Login" },
  { path: "/account/signup", component: Register, name: "Register" },
];

const router = createRouter({
  history,
  routes,
});

export default router;
