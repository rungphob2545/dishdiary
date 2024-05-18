import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";
import RecipeIns from "../pages/RecipeIns.vue";
import MyOrder from "../pages/MyOrder.vue";
import Admin from "../pages/Admin.vue";
import Category from "../pages/Category.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Recipe from "../pages/Recipe.vue";
import Swal from "sweetalert2";
import Cart from "../pages/Cart.vue";
import UserProfile from "../pages/UserProfile.vue";
import MyRecipe from "../pages/MyRecipe.vue";

const history = createWebHashHistory(import.meta.env.BASE_URL);

const routes = [
  {
    path: "/",
    component: Home,
    name: "Home",
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/recipe",
    component: Recipe,
    name: "Recipe",
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/recipe/:id",
    component: RecipeIns,
    name: "RecipeIns",
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/order/:id",
    component: MyOrder,
    name: "MyOrder",
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/recipe/category/:id",
    component: Category,
    name: "Category",
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/recipe/admin",
    component: Admin,
    name: "Admin",
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/account/login",
    component: Login,
    name: "Login",
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/account/profile",
    component: UserProfile,
    name: "userProfile",
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/account/cart",
    component: Cart,
    name: "cart",
    meta: {
      requiresAuth: true,
    },
  },
  { path: "/account/signup", component: Register, name: "Register" },
  {
    path: "/recipe/user",
    component: MyRecipe,
    name: "myRecipe",
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history,
  routes,
});

// Navigation Guard เพื่อตรวจสอบการเข้าถึงหน้าที่ไม่มีอยู่ใน route
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token"); // ปรับเป็นชื่อของคีย์ที่บันทึก token ของคุณ
  if (token) {
    const tokenData = JSON.parse(atob(token.split(".")[1])); // Decode JWT token และแปลงเป็น Object
    console.log("token", tokenData); // ข้อมูลใน token
    // ตัวอย่างการเข้าถึงข้อมูลใน token
    console.log(tokenData.role); // เช่น userId หรือชื่อ property อื่นๆ ที่มีใน token

    // เช็คว่ามีเส้นทางที่ผู้ใช้พยายามเข้าถึงหรือไม่
    if (!to.matched.length) {
      // ถ้าไม่มีเส้นทางที่ตรงกับ URL ที่ผู้ใช้พยายามเข้าถึง
      // แสดงข้อความเตือนหรือทำการ redirect ไปยังหน้าอื่น ๆ ตามต้องการ
      Swal.fire({
        icon: "error",
        title: "ไม่พบหน้านี้",
        text: "ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา",
        confirmButtonText: "กลับสู่หน้าแรก",
        allowOutsideClick: false,
        allowEscapeKey: false,
        onClose: () => {
          router.push("/");
        },
      });

      next({ name: "Home" });
    } else {
      // ตรวจสอบบทบาทของผู้ใช้ก่อนเข้าถึงหน้าที่ไม่มีอยู่ใน route
      if (to.path === "/recipe/admin" && tokenData.role !== "Admin") {
        // ผู้ใช้ไม่ใช่ Admin ไม่สามารถเข้าถึงหน้านี้ได้
        Swal.fire({
          icon: "error",
          title: "ไม่มีสิทธิ์เข้าถึงหน้านี้",
          text: "คุณไม่มีสิทธิ์เข้าถึงหน้านี้",
          confirmButtonText: "กลับสู่หน้าแรก",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        next({ name: "Home" });
      } else {
        // ผู้ใช้มีสิทธิ์เข้าถึงหน้าที่ไม่มีอยู่ใน route ตามบทบาทของผู้ใช้
        next();
      }
    }
  } else {
    if (!to.matched.length) {
      Swal.fire({
        icon: "question",
        title: "ไม่พบหน้านี้",
        text: "ขออภัย ไม่พบหน้าที่คุณกำลังมองหา",
        confirmButtonText: "กลับสู่หน้าแรก",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      next({ name: "Login" });
    }

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      Swal.fire({
        icon: "error",
        title: "คุณยังไม่มีสิทธิเข้าถึงหน้านี้",
        text: "โปรดทำการ Login แล้วลองใหม่อีกครั้ง",
        confirmButtonText: "ไปยังหน้า Login",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      next({ name: "Login" });
    } else {
      next();
    }
  }
});

export default router;
