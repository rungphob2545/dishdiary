import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";
import RecipeIns from "../pages/RecipeIns.vue";
import MyOrder from "../pages/MyOrder.vue";
import Admin from "../pages/Admin.vue";
import Category from "../pages/Category.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Swal from "sweetalert2";

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

// Navigation Guard เพื่อตรวจสอบการเข้าถึงหน้าที่ไม่มีอยู่ใน route
router.beforeEach((to, from, next) => {
  // เช็คว่ามีเส้นทางที่ผู้ใช้พยายามเข้าถึงหรือไม่
  if (!to.matched.length) {
    // ถ้าไม่มีเส้นทางที่ตรงกับ URL ที่ผู้ใช้พยายามเข้าถึง
    // แสดงข้อความเตือนหรือทำการ redirect ไปยังหน้าอื่น ๆ ตามต้องการ
    Swal.fire({
      icon: "error",
      title: "ไม่พบหน้านี้",
      text: "ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา",
      confirmButtonText: "กลับสู่หน้าแรก",
      onClose: () => {
        router.push("/");
      },
    });

    next({ name: "Home" });
  } else {
    // ถ้ามีเส้นทางที่ตรงกับ URL ที่ผู้ใช้พยายามเข้าถึง
    // ให้ดำเนินการต่อไปตามปกติ
    next();
  }
});

export default router;
