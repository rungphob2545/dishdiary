<script setup>
import { ref, onBeforeMount, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

const ingredients = ref([]);
const items = ref([]);
const categories = ref([]);
const route = useRoute();
const id = route.params.id;

const selectedCategory = ref([]);
const getCategoryImage = (id) => `/kp2/src/assets/icon/category_${id}.png`;

const getImage = (recipeName) => `http://localhost:8080/${recipeName}`;

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

const fetchIngredients = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/ingredients`
    );

    ingredients.value = response.data;
  } catch (error) {
    console.error("Error fetching ingredient:", error);
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

const shuffledItems = computed(() => {
  return filteredItems.value.sort(() => Math.random() - 0.5);
});

const slides = ref([
  {
    title: "ยินดีต้อนรับเข้าสู่เว็บไซต์ของพวกเรา Dish DIARIES",
    description:
      "เว็บไซต์ที่รวมรวบสูตรอาหาร สามารถซื้อวัตถุดิบผ่านเว็บไซต์ และ ยังสามารถบอกต่อสูตรอาหารของคุณด้วยได้ในที่เดียว",

    link: "/recipe",
    linkText: "ดูสูตรอาหาร",
  },
  {
    title: "Store in One Place",
    description: "รวบรวมสินค้า วัตถุดิบไว้ในที่เดียว ไม่ต้องไปหาซื้อให้ยุ่งยาก",
    link: "/store",
    linkText: "ไปยังร้านค้า",
  },
  {
    title: "Share Your Recipes",
    description: "อยากเผยแพร่สูตรอาหารงั้นหรอ? ลองดูสิ !",
    link: "/account/profile",
    linkText: "ลองเลย !",
  },
]);

const currentIndex = ref(0);
const intervalDuration = 5000; // 3 วินาที

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

let slideInterval;

onMounted(() => {
  slideInterval = setInterval(nextSlide, intervalDuration);
});

onUnmounted(() => {
  clearInterval(slideInterval);
});

const goToSlide = (index) => {
  currentIndex.value = index;
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, intervalDuration);
};

onBeforeMount(() => {
  fetchData();
  fetchCategories();
  fetchIngredients();
  fetchHistories();
  console.log("filter", filteredItems);
});
</script>

<template>
  <div class="h-screen">
    <div class="">
      <Navbar />
    </div>

    <div class="relative w-full h-96 overflow-hidden">
      <div
        class="absolute inset-0 flex transition-transform duration-700"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="flex-shrink-0 w-full h-full flex items-center justify-center bg-gray-200"
        >
          <!-- เนื้อหาของสไลด์ -->
          <div class="text-center p-4">
            <h2 class="text-2xl font-bold mb-2">{{ slide.title }}</h2>
            <p class="mb-4">{{ slide.description }}</p>

            <router-link
              v-if="slide.link"
              :to="slide.link"
              class="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              {{ slide.linkText }}
            </router-link>
          </div>
        </div>
      </div>
      <div
        class="absolute bottom-0 left-0 right-0 p-4 flex justify-center space-x-2"
      >
        <span
          v-for="(slide, index) in slides"
          :key="index"
          class="w-3 h-3 bg-white rounded-full cursor-pointer"
          :class="{ 'bg-gray-800': currentIndex === index }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>

    <div
      class="justify-start flex flex-wrap ml-56 pt-16"
      v-if="items.length < 1"
    >
      <div class="w-full">
        <div class="text py-4 pb-16"></div>
      </div>
    </div>
    <div class="justify-start flex flex-wrap ml-96 pb-32" v-else>
      <div class="w-full flex">
        <div class="text mt-24 pb-16">
          <h1 class="text-6xl font-bold pb-4 text-green-600">Dish DIARIES</h1>

          <p class="text-lg w-96">
            ค้นพบความสุขในการทำอาหารด้วยเรา!
            ที่นี่คุณจะได้พบกับสูตรอาหารที่ยอดเยี่ยมและวิธีการทำอาหารที่ง่ายต่อการติดตาม
            ขอเสนอให้คุณสร้างประสบการณ์ทำอาหารที่สุดแสนสนุกและอร่อยที่สุดได้ที่นี่
          </p>
          <div>
            <router-link
              :to="{ name: 'Recipe' }"
              class="flex bg-black text-white shadow-lg overflow-hidden object-center transition duration-300 hover:scale-105 cursor-pointer w-[120px] rounded-lg mt-8 ml-auto"
            >
              <div class="p-4 items-center">เริ่มต้นใช้งาน</div>
            </router-link>
          </div>
        </div>

        <div class="mt-12 w-[600px] ml-28">
          <div class="grid grid-cols-3 gap-4">
            <router-link
              v-for="(item, index) in shuffledItems.slice(0, 9)"
              :key="item.id"
              :to="{ name: 'RecipeIns', params: { id: item.id } }"
            >
              <div
                class="flex flex-col items-center shadow-lg rounded-lg overflow-hidden object-center transition duration-300 hover:scale-105 cursor-pointer"
              >
                <div class="w-full h-48">
                  <img
                    class="w-full h-full object-cover"
                    v-bind:src="getImage(item.recipeImage)"
                  />
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="">
        <div></div>
      </div>
    </div>
  </div>
  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped>
.tooltip {
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

.alert {
  padding: 10px;
  margin: 10px;
  background-color: #f44336;
  color: white;
  border-radius: 5px;
  position: relative;
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-in {
  opacity: 1;
  transform: translateY(0);
  animation: slide-in-animation 0.5s ease-out forwards;
}

.close {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

@keyframes slide-in-animation {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
