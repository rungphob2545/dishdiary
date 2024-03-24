<script setup>
import { ref, onBeforeMount, computed } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import { useRoute, useRouter } from "vue-router";

const items = ref([]);
const categories = ref([]);
const route = useRoute();
const id = route.params.id;

const selectedCategory = ref([]);

console.log(import.meta.env.VITE_APP_API_URL);
const fetchData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/recipe`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "GET",
      }
    );

    items.value = response.data;
    console.log(items.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/categories`,
      {
        method: "GET",
      }
    );

    categories.value = response.data;
    console.log(categories.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const convertCategoryIdToString = (id) => {
  switch (id) {
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

// const filteredItems = computed(() => {
//   if (!selectedCategory.value) {
//     return items.value;
//   } else {
//     const filtered = items.value.filter(
//       (item) => item.categoryId === selectedCategory.value
//     );
//     console.log("Filtered items:", filtered); // เพิ่ม console.log นี้เพื่อดูผลลัพธ์ของการ filter
//     return filtered;
//   }
// });

const filteredItems = computed(() => {
  if (selectedCategory.value.length === 0) {

    console.log("Filtered items1:", selectedCategory); // เพิ่ม console.log นี้เพื่อดูผลลัพธ์ของการ filter
    return items.value;
  } else {
    const filtered = items.value.filter(item => selectedCategory.value.includes(item.categoryId));
    console.log(items.value)
    console.log(selectedCategory.value)
    console.log("Filtered items2:", filtered); // เพิ่ม console.log นี้เพื่อดูผลลัพธ์ของการ filter
    return filtered
   
  }
});
onBeforeMount(() => {
  fetchData();
  fetchCategories();
  console.log("filter", filteredItems);
});
</script>

<template>
  <div class="">
    <div>
      <Navbar />
    </div>
    <div class="justify-start flex flex-wrap" v-if="items.length < 1">
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
    <div class="justify-start flex flex-wrap" v-else>
      <div class="w-full">
        <div class="text py-4 pb-16">
          <label v-for="category in categories" :key="category.id">
              <input type="checkbox"  :value="category.id" v-model="selectedCategory">
                {{ convertCategoryIdToString(category.id) }}
          </label>
          <div class="">
            <ul class="flex">
            <li v-for="item in filteredItems" :key="item.id">
              <li>{{ item.recipeName }}</li>
            <li>
              <img
                class="w-[450px] h-[300px]"
                v-bind:src="`http://localhost:8080/${item.recipeImage}`"
              />
            </li>
            <li class="p-4 text-right">ดูเพิ่มเติม...</li>
            </li>
          </ul>
          </div>
          <h1 class="text-8xl font-bold font-serif pb-4">DISH DIARIES</h1>

          <p class="text-lg">
            ค้นพบความสุขในการทำอาหารด้วยเรา!
            ที่นี่คุณจะได้พบกับสูตรอาหารที่ยอดเยี่ยมและวิธีการทำอาหารที่ง่ายต่อการติดตาม
            ขอเสนอให้คุณสร้างประสบการณ์ทำอาหารที่สุดแสนสนุกและอร่อยที่สุดได้ที่นี่
          </p>
        </div>
        <p class="text-[40px] font-bold pb-8">สูตรอาหารของเรา</p>
      </div>
      <div class="flex flex-wrap">
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
      <div class="w-screen">
        <p class="text-[40px] font-bold pb-8">ประเภทของอาหาร</p>
        <div class="flex">
          <ul
            v-for="category in categories"
            :key="category.id"
            class="px-5 pb-10"
          >
            <router-link :to="{ name: 'Category', params: { id: category.id } }"
              ><button class="px-6 py-2 text-blue-100 bg-blue-600 rounded">
                {{ convertCategoryIdToString(category.id) }}
              </button>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped></style>
