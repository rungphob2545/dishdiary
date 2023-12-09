<script>
import Search from "./Search.vue";
import { useRouter } from "vue-router";

import Recipe from "./Recipe.vue";

const appRouter = useRouter();

export default {
  name: "Navbar",
  components: { Search },
};
</script>
<template>
  <div>
    <!-- Navbar แนวนอน -->
    <nav class="bg-gray-800 p-4">
      <!-- เนื้อหา Navbar แนวนอน -->
      <div class="flex items-center justify-between">
        <div class="text-white">Dish Diaries</div>
        <Search />
        <div class="flex space-x-4">
          <router-link to="/" class="text-white">Home</router-link>
          <router-link to="/about" class="text-white">About</router-link>
          <!-- เพิ่มเมนูตามต้องการ -->
        </div>
      </div>
    </nav>

    <!-- Navbar แนวตั้ง -->
    <div class="flex">
      <nav class="bg-gray-800 p-4">
        <!-- เนื้อหา Navbar แนวตั้ง -->
        <div class="flex flex-col space-y-4 h-screen w-32">
          <router-link to="/" class="text-white">Home</router-link>
          <router-link to="/about" class="text-white">About</router-link>
          <!-- เพิ่มเมนูตามต้องการ -->
        </div>
      </nav>

      <!-- เนื้อหาหลักของหน้าเว็บ -->
      <div class="flex-1 p-4">
        <!-- ใส่เนื้อหาหลักของเว็บไซต์ของคุณที่นี่ -->

        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ปรับแต่งตามความต้องการ */
/* เพิ่มคลาส mx-0 เพื่อลบ margin ด้านซ้ายของ Navbar แนวตั้ง */
.navbar-vertical {
  width: 120px; /* ปรับขนาดของ Navbar แนวตั้งตั้งต้น */
}
</style>
