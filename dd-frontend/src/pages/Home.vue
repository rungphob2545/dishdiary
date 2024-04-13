<script setup>
import { ref, onBeforeMount, computed } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import { useRoute, useRouter } from "vue-router";
import Footer from "../components/Footer.vue";

const items = ref([]);
const categories = ref([]);
const route = useRoute();
const id = route.params.id;

const selectedCategory = ref([]);
const getCategoryImage = (id) => `/kp2/src/assets/icon/category_${id}.png`;

console.log("getimage", getCategoryImage(1));

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

const isSelected = (id) => {
  return selectedCategory.value.includes(id);
};

const toggleCategory = (id) => {
  const index = selectedCategory.value.indexOf(id);
  if (index === -1) {
    selectedCategory.value.push(id);
  } else {
    selectedCategory.value.splice(index, 1);
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
    case 5:
      return "ผัก";
    default:
      return "หมวดหมู่อื่นๆ";
  }
};

const filteredItems = computed(() => {
  if (selectedCategory.value.length === 0) {
    console.log("Filtered items1:", selectedCategory); // เพิ่ม console.log นี้เพื่อดูผลลัพธ์ของการ filter
    return items.value;
  } else {
    const filtered = items.value.filter((item) =>
      selectedCategory.value.includes(item.categoryId)
    );
    console.log(items.value);
    console.log(selectedCategory.value);
    console.log("Filtered items2:", filtered);
    return filtered;
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
    <div class="">
      <Navbar />
    </div>
    <div
      class="justify-start flex flex-wrap ml-56 pt-16"
      v-if="items.length < 1"
    >
      <div class="w-full">
        <div class="text py-4 pb-16">
          <h1 class="text-8xl font-bold pb-4 text-green-700">Dish DIARIES</h1>

          <p class="text-lg">
            ค้นพบความสุขในการทำอาหารด้วยเรา!
            ที่นี่คุณจะได้พบกับสูตรอาหารที่ยอดเยี่ยมและวิธีการทำอาหารที่ง่ายต่อการติดตาม
            ขอเสนอให้คุณสร้างประสบการณ์ทำอาหารที่สุดแสนสนุกและอร่อยที่สุดได้ที่นี่
          </p>
        </div>
        <p class="text-[40px] font-bold pb-2 text-green-700">สูตรอาหารของเรา</p>
      </div>
      <h1 class="text-[80px] text-center ml-82 pt-16">
        ยังไม่มีสูตรอาหารในขณะนี้
      </h1>
    </div>
    <div class="justify-start flex flex-wrap ml-56 pt-16" v-else>
      <div class="w-full">
        <div class="text py-4 pb-16">
          <h1 class="text-8xl font-bold pb-4 text-green-700">Dish DIARIES</h1>

          <p class="text-lg">
            ค้นพบความสุขในการทำอาหารด้วยเรา!
            ที่นี่คุณจะได้พบกับสูตรอาหารที่ยอดเยี่ยมและวิธีการทำอาหารที่ง่ายต่อการติดตาม
            ขอเสนอให้คุณสร้างประสบการณ์ทำอาหารที่สุดแสนสนุกและอร่อยที่สุดได้ที่นี่
          </p>
        </div>
        <div class="flex items-center">
          <p class="text-[40px] font-bold pb-2 text-green-700">
            สูตรอาหารของเรา
          </p>
          <div class="tooltip ml-2">
            <svg
              class="h-8 w-8 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="tooltiptext w-72 rounded-lg p-1">
              <div class="flex items-center">
                <img src="src\assets\icon\nut.png" class="w-8 h-8 mr-2" />
                <span>เป็นเมนูอาหารที่มีถั่ว</span>
              </div>
              <div class="flex items-center">
                <img src="src\assets\icon\vegan.png" class="w-8 h-8 mr-2" />
                <span>เป็นเมนูอาหารสำหรับคนทานมังสวิรัติ</span>
              </div>
            </span>
          </div>
        </div>
      </div>
      <div class="flex w-full pb-4">
        <label
          v-for="category in categories"
          :key="category.id"
          class="flex m-2"
        >
          <input
            type="checkbox"
            :value="category.id"
            v-model="selectedCategory"
            class="hidden"
          />
          <button
            @click="toggleCategory(category.id)"
            :class="{
              'bg-red-500': isSelected(category.id),
              'bg-red-300': !isSelected(category.id),
            }"
            class="w-32 h-12 items-center justify-center rounded-full text-white px-2 focus:outline-none transition-colors duration-200 border border-red-500 flex hover:bg-red-500"
          >
            <div class="m-2">
              <img :src="getCategoryImage(category.id)" class="w-8 h-8" />
            </div>
            {{ convertCategoryIdToString(category.id) }}
          </button>
        </label>
      </div>
      <div class="grid grid-cols-3 gap-4 pb-12">
        <ul v-for="item in filteredItems" :key="item.id" class="">
          <div
            class="flex bg-white shadow-lg rounded-lg overflow-hidden object-center transition duration-300 transform hover:scale-105 cursor-pointer"
          >
            <div class="w-[200px]">
              <li>
                <img
                  class="h-40 w-full object-cover"
                  v-bind:src="`http://localhost:8080/${item.recipeImage}`"
                />
              </li>
            </div>
            <div class="p-6 w-[300px] relative">
              <router-link :to="{ name: 'RecipeIns', params: { id: item.id } }">
                <li
                  class="text-right font-bold text-2xl mb-2 mt-[-10px] text-green-500"
                >
                  {{ item.recipeName }}
                </li>
                <li class="float-right flex gap-2">
                  <span class=""> ประเภท </span>
                  <img
                    :src="getCategoryImage(item.categoryId)"
                    class="w-8 h-8"
                  />
                  <img
                    v-if="item.nutAllergy == 1"
                    src="src\assets\icon\nut.png"
                    class="w-8 h-8"
                  />
                  <img
                    v-if="item.vegetarian == 1"
                    src="src\assets\icon\vegan.png"
                    class="w-8 h-8"
                  />
                </li>
                <li class="absolute bottom-0 mb-2" v-if="item.video">
                  <svg
                    class="h-8 w-8 text-red-500 ml-56"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </li>
                <li class="absolute bottom-0 mb-2" v-else>
                  <svg
                    class="h-8 w-8 text-gray-500 ml-56"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"
                    />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </li>
              </router-link>
            </div>
          </div>
        </ul>
      </div>
    </div>
  </div>

  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
