<script setup>
import { ref, onBeforeMount, computed } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import { useRoute, useRouter } from "vue-router";

const user = ref({});
const favorites = ref([]);

const getImage = (img) => `http://localhost:8080/${img}`;
const getCategoryImage = (id) => `/kp2/src/assets/icon/category_${id}.png`;

const fetchData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/user`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "GET",
      }
    );

    user.value = response.data;
    console.log(user.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchFavorites = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/favorite`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "GET",
      }
    );

    favorites.value = response.data;
    console.log(favorites.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const favoriteCount = computed(() => {
  if (
    favorites.value &&
    favorites.value.favorites &&
    Array.isArray(favorites.value.favorites)
  ) {
    return favorites.value.favorites.length;
  } else {
    return 0; // หรือค่าเริ่มต้นอื่นๆ ตามที่คุณต้องการ
  }
});

const sortOrder = ref("asc");
const sortBy = ref("rating"); // reactive variable สำหรับเก็บการเรียงลำดับที่เลือก

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
};
const sortedItems = computed(() => {
  let sortedData = [];

  if (Array.isArray(favorites.value.recipes)) {
    sortedData = [...favorites.value.recipes]; // ทำการคัดลอกอาร์เรย์
  } else {
    console.error("ข้อมูลรายการโปรดไม่ใช่อาร์เรย์");
    return sortedData; // ส่งคืนอาร์เรย์ว่างหรือจัดการตามที่ต้องการ
  }

  const difficultyOrder = ["Easy", "Normal", "Difficult"];
  const timeBasedOrder = [
    "Quick",
    "Moderate",
    "Time-Consuming",
    "Time-Intensive",
  ];

  if (sortBy.value === "rating") {
    sortedData.sort((a, b) =>
      sortOrder.value === "asc" ? a.rating - b.rating : b.rating - a.rating
    );
  } else if (sortBy.value === "difficulty") {
    sortedData.sort((a, b) => {
      return sortOrder.value === "asc"
        ? difficultyOrder.indexOf(a.difficulty) -
            difficultyOrder.indexOf(b.difficulty)
        : difficultyOrder.indexOf(b.difficulty) -
            difficultyOrder.indexOf(a.difficulty);
    });
  } else if (sortBy.value === "timeBased") {
    sortedData.sort((a, b) => {
      return sortOrder.value === "asc"
        ? timeBasedOrder.indexOf(a.timeBased) -
            timeBasedOrder.indexOf(b.timeBased)
        : timeBasedOrder.indexOf(b.timeBased) -
            timeBasedOrder.indexOf(a.timeBased);
    });
  }

  return sortedData;
});

onBeforeMount(() => {
  fetchData();
  fetchFavorites();
  console.log("dd", favoriteCount);
});
</script>

<template>
  <div class="pb-24">
    <Navbar />
  </div>
  <div class="ml-64">
    <div class="flex gap-8">
      <div class="w-[300px] bg-white shadow-md rounded-lg overflow-hidden">
        <div class="p-4">
          <img
            :src="getImage(user.userImage)"
            alt="Profile Picture"
            class="w-40 h-40 rounded-full mx-auto mb-4"
          />
        </div>
      </div>
      <div
        class="w-[690px] bg-white h-60 shadow-md rounded-lg overflow-hidden p-8"
      >
        <div class="items-center">
          <div class="text-center flex gap-3 items-center mb-4">
            <p class="text-xl mr-2">Name</p>
            <input
              type="text"
              class="text-xl bg-gray-300 p-3 rounded-lg"
              v-model="user.userName"
              disabled
            />
            <button class="">
              <svg
                class="h-8 w-8 text-red-500"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path
                  d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"
                />
                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                <line x1="16" y1="5" x2="19" y2="8" />
              </svg>
            </button>
          </div>
          <div class="text-center flex gap-3 items-center">
            <p class="text-xl mr-3">Email</p>
            <input
              type="text"
              class="text-xl bg-gray-300 p-3 rounded-lg"
              v-model="user.userEmail"
              disabled
            />

            <button>
              <svg
                class="h-8 w-8 text-red-500"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path
                  d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"
                />
                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                <line x1="16" y1="5" x2="19" y2="8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        class="w-[300px] bg-white shadow-md rounded-lg overflow-hidden p-8 text-center h-60"
      >
        <h1 class="text-5xl font-bold">{{ favoriteCount }}</h1>
        <p class="text-lg">จำนวนเมนูที่คุณถูกใจ</p>
      </div>
    </div>
    <h1>เมนูที่คุณถูกใจ</h1>
    <div
      class="w-[1350px] bg-white shadow-md rounded-lg overflow-hidden p-8 mt-6 text-center"
    >
      <div class="grid grid-cols-2 gap-4 pb-12">
        <ul v-for="item in sortedItems" :key="item.id" class="">
          <div
            class="flex bg-white shadow-lg rounded-lg overflow-hidden object-center transition duration-300 transform hover:scale-105 cursor-pointer"
          >
            <div class="w-[200px]">
              <li>
                <img
                  class="h-40 w-full object-cover"
                  v-bind:src="getImage(item.recipeImage)"
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
</template>

<style>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

button {
  margin-top: 10px;
}
</style>
