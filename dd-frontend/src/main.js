import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

router.beforeEach((to, from, next) => {
  // ตรวจสอบว่ามี error จาก server หรือไม่
  if (to.name === "Error") {
    // ถ้ามี error ให้นำกลับไปยังหน้า home
    next({ name: "Home" });
  } else {
    next(); // ไม่มี error ให้ดำเนินการต่อไปเหมือนเดิม
  }
});

createApp(App).use(router).mount("#app");
