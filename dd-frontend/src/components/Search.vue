<script setup>
import { ref } from "vue";
import axios from "axios";

const searchQuery = ref("");
const searchResults = ref([]);
const showResults = ref(false);
const showIcon = ref(true);
const isLoading = ref(false);
const showCloseIcon = ref(false);

const searchFetch = async (query) => {
  try {
    isLoading.value = true;
    const response = await axios.get(
      `${
        import.meta.env.VITE_APP_API_URL
      }/api/recipe/search?query=${searchQuery.value.trim()}`,
      {
        method: "GET",
      }
    );

    searchResults.value = response.data;
    showResults.value = true;

    setTimeout(() => {
      isLoading.value = false; // ปิดใช้งาน Loading Screen หลังจากผ่านไปเวลาที่ต้องการ
    }, 1000);

    console.log(searchQuery.value);
    console.log(searchResults.value);
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

const hideResults = () => {
  if (!searchQuery.value.trim() || !showResults.value) {
    showResults.value = false; // ซ่อนกล่องผลลัพธ์เมื่อไม่มีการเลือก
    showIcon.value = true;
    showCloseIcon.value = false;
  }
};

const handleFocus = () => {
  showCloseIcon.value = true;
};

const clearSearch = () => {
  searchQuery.value = "";
  showResults.value = false;
  showCloseIcon.value = false;
};
</script>

<template>
  <!-- Search input -->
  <div class="relative">
    <div class="">
      <input
        type="text"
        class="w-[500px] h-[45px] bg-white text-gray-800 p-4 rounded mr-[1000px] pl-10 rounded-lg input-with-animation"
        placeholder="ค้นหาสูตรอาหารได้ที่นี้ !"
        v-model="searchQuery"
        @input="searchFetch"
        @blur="hideResults"
        @focus="handleFocus"
      />

      <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
        <svg
          class="h-5 w-5 text-sky-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          @click="toggleSearch"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>

      <transition name="close-animation">
        <span
          v-show="showCloseIcon"
          @click="clearSearch"
          class="absolute inset-y-0 left-0 flex items-center cursor-pointer ml-[465px]"
        >
          <svg
            class="h-5 w-5 text-sky-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </span>
      </transition>

      <!-- Search results box -->
      <div v-if="showResults" class="absolute w-[500px] bg-gray-200 mt-[9px]">
        <div v-if="isLoading" class="p-4 max-w-sm w-full">
          <div class="animate-pulse flex space-x-4">
            <div class="rounded-full bg-slate-700 h-10 w-10"></div>
            <div class="flex-1 space-y-6 py-1">
              <div class="h-1 bg-slate-700 rounded"></div>
              <div class="space-y-2">
                <div class="grid grid-cols-3 gap-4">
                  <div class="h-1 bg-slate-700 rounded col-span-1"></div>
                  <div class="h-1 bg-slate-700 rounded col-span-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul v-else v-for="result in searchResults" :key="result.id">
          <li class="p-2 cursor-pointer hover:bg-gray-200">
            <router-link :to="{ name: 'RecipeIns', params: { id: result.id } }">
              <div class="flex items-center">
                <div class="">
                  <img
                    class="w-10 h-10 rounded-full"
                    v-bind:src="`http://localhost:8080/${result.recipeImage}`"
                  />
                </div>
                <div class="ml-3">
                  <p>{{ result.recipeName }}</p>
                  <span class="text-xs">
                    ประเภท {{ convertCategoryIdToString(result.categoryId) }}
                  </span>
                </div>
              </div>
            </router-link>
          </li>
        </ul>

        <div class="flex items-center p-2">
          <svg
            class="h-9 w-9 text-white bg-gray-500 rounded-full p-1 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          ทำการค้นหา "{{ searchQuery }}"
        </div>
      </div>
    </div>
  </div>

  <!-- Content -->
</template>

<style scoped>
/* Add your additional styling here */
/* Add your custom styles here */
.absolute {
  position: absolute;
  z-index: 10;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 8px;
}

.search-input {
  width: 250px; /* กำหนดความกว้างเริ่มต้นของช่องค้นหา */
  height: 45px; /* กำหนดความสูงของช่องค้นหา */
  padding: 10px; /* กำหนดระยะห่างภายในช่องค้นหา */
  transition: width 0.3s ease, transform 0.3s ease; /* เพิ่ม transition effect ให้กับความกว้างและการเคลื่อนไหว */
}

.search-input:focus {
  width: 400px; /* กำหนดความกว้างที่ต้องการเมื่อช่องค้นหาได้รับการเลือก */
  transform: scale(1.1); /* กำหนดการขยายของช่องค้นหาเมื่อเลือก */
}

.icon-animation-enter-active,
.icon-animation-leave-active {
  transition: transform 0.2s ease;
}
.icon-animation-enter-from,
.icon-animation-leave-to {
  transform: scale(0.3) translateX(200%);
}

.close-animation-enter-active,
.close-animation-leave-active {
  transition: transform 0.2s ease;
}
.close-animation-enter-from,
.close-animation-leave-to {
  transform: scale(0.3) translateX(200%);
}
</style>
