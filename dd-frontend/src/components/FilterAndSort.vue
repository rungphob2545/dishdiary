<script setup>
import { ref, onBeforeMount, computed } from "vue";
import axios from "axios";

const categories = ref([]);
const sortBy = ref("rating");

const selectedCategory = ref([]);

const fetchCategories = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/categories`,
      {
        method: "GET",
      }
    );

    categories.value = response.data;
    console.log("dd", categories.value);
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
    case 5:
      return "ผัก";
    default:
      return "หมวดหมู่อื่นๆ";
  }
};

onBeforeMount(() => {
  fetchCategories();
});

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

const sortOrder = ref("asc");

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
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-xl">
    <!-- เนื้อหา modal -->
    <h1 class="text-2xl font-bold mb-4">Sort & Filter</h1>

    <!-- เนื้อหา Sort -->
    <div class="mb-4">
      <label for="sortBy" class="block text-sm font-medium text-gray-700"
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

    <!-- เนื้อหา Filter -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Filter</label>
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

    <!-- ปุ่มตกลง -->
    <div class="text-right">
      <button
        @click="applySortAndFilter"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        ตกลง
      </button>
      <button
        @click="closeModal"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2"
      >
        ยกเลิก
      </button>
    </div>
  </div>
</template>

<style></style>
