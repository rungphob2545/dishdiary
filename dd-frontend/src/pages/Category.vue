<script setup>
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";

const items = ref([]);
const route = useRoute();
const id = route.params.id;
console.log(id);

const fetchData = async (id) => {
  const router = useRouter();
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_PRODUCT_API_URL}` + "/api/recipe/category/" + `${id}`
    );
    if (response.status === 200) {
      items.value = response.data;
      console.log(response.data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // alert(`${error.response.data.message}`);
  }
};

const convertCategoryIdToString = (id) => {
  switch (parseInt(id)) {
    case 1:
      return "ไข่";
    case 2:
      return "เนื้อวัว";
    case 3:
      return "เนื้อไก่";
    case 4:
      return "เนื้อหมู";
    // เพิ่ม case ตาม categoryId ที่คุณมีในฐานข้อมูลของคุณต่อไป
    default:
      return "หมวดหมู่อื่นๆ";
  }
};

onBeforeMount(() => {
  const route = useRoute();
  const id = route.params.id;
  console.log(id);
  fetchData(id);
});
</script>

<template>
  <div class="">
    <div>
      <Navbar />
    </div>
    <div
      class="mt-[-900px] ml-96 justify-start flex flex-wrap"
      v-if="items.length < 1"
    >
      <div class="w-full">
        <div class="text py-4 w-[750px] pb-16">
          <h1 class="text-8xl font-bold font-serif pb-4">DISH DIARIES</h1>

          <p class="text-lg">
            ค้นพบความสุขในการทำอาหารด้วยเรา!
            ที่นี่คุณจะได้พบกับสูตรอาหารที่ยอดเยี่ยมและวิธีการทำอาหารที่ง่ายต่อการติดตาม
            ขอเสนอให้คุณสร้างประสบการณ์ทำอาหารที่สุดแสนสนุกและอร่อยที่สุดได้ที่นี่
          </p>
        </div>
      </div>
      <p class="text-[40px] font-bold">สูตรอาหารของเรา</p>
      <h1 class="text-[80px] text-center ml-82 pt-16">
        ยังไม่มีสูตรอาหารในขณะนี้
      </h1>
    </div>
    <div class="mt-[-900px] ml-96 justify-start flex flex-wrap" v-else>
      <div class="w-full">
        <div class="text py-4 w-[750px] pb-16">
          <h1 class="text-8xl font-bold font-serif pb-4">DISH DIARIES</h1>

          <p class="text-lg">
            ค้นพบความสุขในการทำอาหารด้วยเรา!
            ที่นี่คุณจะได้พบกับสูตรอาหารที่ยอดเยี่ยมและวิธีการทำอาหารที่ง่ายต่อการติดตาม
            ขอเสนอให้คุณสร้างประสบการณ์ทำอาหารที่สุดแสนสนุกและอร่อยที่สุดได้ที่นี่
          </p>
        </div>
        <p class="text-[40px] font-bold pb-8">
          อาหารประเภท {{ convertCategoryIdToString(id) }}
        </p>
      </div>

      <ul v-for="item in items" :key="item.id" class="px-5 pb-10">
        <router-link :to="{ name: 'RecipeIns', params: { id: item.id } }">
          <li>{{ item.recipeName }}</li>
          <li>
            <img
              class="w-[450px] h-[300px]"
              v-bind:src="`http://localhost:8080/${item.recipeImage}`"
            />
          </li>
          <li class="p-4 text-right">ดูเพิ่มเติม...</li>
        </router-link>
      </ul>
    </div>
  </div>

  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped></style>
