<script setup>
import { ref, onBeforeMount, computed } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";
import MyRecipe from "./MyRecipe.vue";

const user = ref({});
const favorites = ref([]);
const errors = ref(null);

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

const addToFavorites = async (recipeId, userId) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/favorite`,
      {
        recipeId: recipeId,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 201) {
      Swal.fire({
        icon: "success",
        title: "นำเข้า Favorite สำเร็จ",
        confirmButtonText: "ตกลง",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    }
  } catch (error) {
    console.error("Error adding recipe:", error);
    errors.value = error;
    console.log(errors);
  }
};

const removeFavorites = async (recipeId, userId) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_API_URL}/api/favorite`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          recipeId: recipeId,
          userId: userId,
        },
      }
    );
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "นำออกจาก Favorite สำเร็จ",
        confirmButtonText: "ตกลง",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    }
  } catch (error) {
    console.error("Error adding recipe:", error);
    errors.value = error;
    console.log(errors);
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

const combinedItems = computed(() => {
  return sortedItems.value.map((item) => {
    const favorite = favorites.value.recipes
      ? favorites.value.recipes.find((recipe) => recipe.id === item.id)
      : null;
    return {
      ...item,
      favorite,
    };
  });
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
    <div>
      <h1>My recipe</h1>
      <div>
        <MyRecipe />
      </div>
    </div>
    <h1
      class="text-2xl font-bold pt-4 pb-2 border-b border-gray-300 w-[1350px]"
    >
      เมนูที่คุณถูกใจ
    </h1>
    <div
      class="w-[1350px] bg-white shadow-md rounded-lg overflow-hidden p-8 mt-6 text-center"
    >
      <div class="grid grid-cols-2 gap-4 pb-12 w-[1300px]">
        <ul
          v-for="item in combinedItems"
          :key="item.id"
          class="flex flex-col items-center"
        >
          <div
            class="flex flex-col items-center bg-gradient-to-b from-blue-200 to-white shadow-lg rounded-lg overflow-hidden object-center transition duration-300 transform hover:scale-105 cursor-pointer w-[600px]"
          >
            <div>
              <button
                v-if="item.favorite"
                class="absolute top-0 right-0 m-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-200 focus:outline-none"
                @click="removeFavorites(item.id)"
              >
                <img src="src\assets\icon\heart.png" class="w-7 h-7" />
              </button>
              <button
                v-else
                class="absolute top-0 right-0 m-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-200 focus:outline-none"
                @click="addToFavorites(item.id)"
              >
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
            <router-link :to="{ name: 'RecipeIns', params: { id: item.id } }">
              <img
                class="h-40 w-[1000px] object-cover"
                v-bind:src="getImage(item.recipeImage)"
              />

              <div class="p-4 w-full">
                <div class="flex items-center">
                  <div class="font-bold text-2xl text-black">
                    {{ item.recipeName }}
                  </div>
                  <div class="flex items-center ml-4 gap-1">
                    <svg
                      class="h-6 w-6 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>
                      {{ item.timeBased }}
                    </span>
                  </div>
                  <div class="ml-auto flex gap-2">
                    <div v-if="item.nutAllergy == 1">
                      <img src="src\assets\icon\nut.png" class="w-8 h-8" />
                    </div>
                    <div v-if="item.vegetarian == 1">
                      <img src="src\assets\icon\vegan.png" class="w-8 h-8" />
                    </div>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-sm">เรทติ้ง: {{ item.rating }}</span>
                  </div>
                  <div class="text-sm mt-2 flex gap-2">
                    <span>ประเภทวัตถุดิบ: </span>
                    <img
                      :src="getCategoryImage(item.categoryId)"
                      class="w-6 h-6"
                    />
                  </div>
                  <div class="text-sm mt-2 flex">
                    <span>ประเภทอาหาร: {{ item.type }}</span>
                  </div>
                  <div class="ml-auto">
                    <div class="" v-if="item.video">
                      <svg
                        class="h-8 w-8 text-red-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect
                          x="1"
                          y="5"
                          width="15"
                          height="14"
                          rx="2"
                          ry="2"
                        />
                      </svg>
                    </div>
                    <div class="" v-else>
                      <svg
                        class="h-8 w-8 text-gray-500"
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
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
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
