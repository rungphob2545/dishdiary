<script setup>
import { ref, onBeforeMount, computed } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

const items = ref([]);
const categories = ref([]);
const route = useRoute();
const id = route.params.id;
const errors = ref(null);
const favorites = ref([]);
const router = useRouter();

const selectedCategory = ref([]);
const getCategoryImage = (id) => `/kp2/src/assets/icon/category_${id}.png`;

const getImage = (recipeName) => `http://localhost:8080/${recipeName}`;

console.log("getimage", getCategoryImage(1));

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
    console.log("favorite", favorites.value.recipes[0].id);
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

const types = [
  { name: "Rice" },
  { name: "Soup" },
  { name: "Noodle" },
  { name: "Salad" },
];

const difficulties = [
  { name: "Easy" },
  { name: "Normal" },
  { name: "Difficult" },
];

const timeBased = [
  { name: "30m" },
  { name: "moreThan60" },
  { name: "2h" },
  { name: "ทั้งหมด" },
];

const isVegetarian = ref(false);
const isNutAllergy = ref(false);
const selectedType = ref([]);
const selectedDifficulty = ref([]);
const selectedTimeBased = ref([]);

const filteredItems = computed(() => {
  let filtered = items.value;

  // ถ้า selectedCategory มีค่า (ผู้ใช้ได้เลือก category) ให้ filter ตาม category
  if (selectedCategory.value.length > 0) {
    filtered = filtered.filter((item) =>
      selectedCategory.value.includes(item.categoryId)
    );
    console.log(filtered);
  }

  if (selectedType.value.length > 0) {
    filtered = filtered.filter((item) =>
      selectedType.value.includes(item.type)
    );
    console.log(filtered);
  }

  if (selectedDifficulty.value.length > 0) {
    filtered = filtered.filter((item) =>
      selectedDifficulty.value.includes(item.difficulty)
    );
    console.log(filtered);
  }

  if (selectedTimeBased.value === "moreThan30") {
    filtered = filtered.filter((item) => item.timeBased === "30m");
  } else if (selectedTimeBased.value === "moreThan60") {
    filtered = filtered.filter((item) => item.timeBased === "60m");
  } else if (selectedTimeBased.value === "2h") {
    filtered = filtered.filter((item) => item.timeBased === "2h");
  }

  if (isVegetarian.value === 1) {
    filtered = filtered.filter((item) => item.vegetarian === "1");
  }

  if (isVegetarian.value === 0) {
    filtered = filtered.filter((item) => item.vegetarian === "0");
  }

  if (isNutAllergy.value === 1) {
    filtered = filtered.filter((item) => item.nutAllergy === "1");
  }

  if (isNutAllergy.value === 0) {
    filtered = filtered.filter((item) => item.nutAllergy === "0");
  }

  return filtered;
});

const sortOrder = ref("asc");
const sortBy = ref("rating"); // reactive variable สำหรับเก็บการเรียงลำดับที่เลือก

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
};
const sortedItems = computed(() => {
  let sortedData = [...filteredItems.value]; // ทำการคัดลอกข้อมูลที่ filter แล้ว
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
  fetchCategories();
  fetchFavorites();
  console.log("filter", filteredItems);
  console.log("fav", favorites);
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
    <div v-else>
      <div class="justify-start flex flex-wrap ml-56 pt-16">
        <div class="w-full">
          <div class="flex items-center">
            <p class="text-[40px] font-bold pb-2 text-black">
              สูตรอาหารทั้งหมด
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

        <div
          class="bg-white p-6 rounded-lg shadow-xl w-[1400px] gap-4 mb-8 flex"
        >
          <!-- เนื้อหา modal -->
          <div class="w-48">
            <h1 class="text-xl font-bold mb-4">ค้นหาแบบละเอียด</h1>

            <!-- เนื้อหา Sort -->
            <div class="mb-4">
              <label
                for="sortBy"
                class="block text-sm font-medium text-gray-700"
                >เรียงตาม</label
              >
              <select
                v-model="sortBy"
                id="sortBy"
                name="sortBy"
                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="rating">Rating</option>
                <option value="difficulty">ความยากง่าย</option>
                <option value="timeBased">เวลาที่ใช้</option>
              </select>
            </div>
          </div>

          <!-- เนื้อหา Filter -->
          <div class="flex gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700"
                >Filter</label
              >
              <label class="block text-sm font-medium text-gray-700"
                >ประเภทเนื้อ</label
              >
              <div class="mt-1 grid grid-cols-2 gap-4">
                <div v-for="category in categories" :key="category.id">
                  <input
                    type="checkbox"
                    :value="category.id"
                    v-model="selectedCategory"
                  />
                  <label>{{ convertCategoryIdToString(category.id) }}</label>
                </div>
              </div>
            </div>
            <div class="flex gap-12">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700"
                  >อาหารมังสวิรัส</label
                >
                <div class="mt-1 grid grid-cols-2 gap-4">
                  <div class="">
                    <input
                      type="checkbox"
                      id="isVegetarianYes"
                      v-model="isVegetarian"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label for="isVegetarianYes">ใช่</label>
                    <input
                      type="checkbox"
                      id="isVegetarianNo"
                      v-model="isVegetarian"
                      :true-value="0"
                      :false-value="1"
                    />
                    <label for="isVegetarianNo">ไม่ใช่</label>
                  </div>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700"
                    >อาหารที่ใส่ถั่วเป็นส่วนผสม</label
                  >
                  <div class="mt-1 grid grid-cols-2 gap-2">
                    <div class="">
                      <input
                        type="checkbox"
                        id="isNutAllergyYes"
                        v-model="isNutAllergy"
                        :true-value="1"
                        :false-value="0"
                      />
                      <label for="isNutAllergyYes">ใช่</label>
                      <input
                        type="checkbox"
                        id="isNutAllergyNo"
                        v-model="isNutAllergy"
                        :true-value="0"
                        :false-value="1"
                      />
                      <label for="isNutAllergyNo">ไม่ใช่</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700"
                  >อาหารประเภท</label
                >

                <div class="mt-1 grid grid-cols-2 gap-4">
                  <div v-for="recipeType in types" :key="recipeType.id">
                    <input
                      type="checkbox"
                      :value="recipeType.name"
                      v-model="selectedType"
                    />
                    <label>{{ recipeType.name }}</label>
                  </div>
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700"
                  >ระดับความยากง่ายในการทำ</label
                >

                <div class="mt-1 grid grid-cols-2 gap-4">
                  <div v-for="difficulty in difficulties" :key="difficulty.id">
                    <input
                      type="checkbox"
                      :value="difficulty.name"
                      v-model="selectedDifficulty"
                    />
                    <label>{{ difficulty.name }}</label>
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700"
                  >เวลาที่ใช้ในการทำ</label
                >

                <div class="mt-1 grid grid-cols-1 gap-4">
                  <div v-for="timeBase in timeBased" :key="timeBase.id">
                    <input
                      type="checkbox"
                      :value="timeBase.name"
                      v-model="selectedTimeBased"
                    />
                    <label>{{ timeBase.name }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 pb-12 w-[1400px]">
          <ul
            v-for="item in combinedItems"
            :key="item.id"
            class="flex flex-col items-center"
          >
            <div
              class="flex flex-col items-center bg-gradient-to-b from-blue-200 to-white shadow-lg rounded-lg overflow-hidden object-center transition duration-300 transform hover:scale-105 cursor-pointer w-[450px]"
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
</style>
