<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Navbar from "./Navbar.vue";

const items = ref([]);

const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/recipe");
    items.value = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="">
    <div>
      <Navbar />
    </div>
    <div class="mt-[-1000px] ml-64">
      <ul>
        <li v-for="item in items" :key="item.id">{{ item.recipeName }}</li>
        <li v-for="item in items" :key="item.id">{{ item.recipeImage }}</li>
      </ul>
    </div>
  </div>

  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped></style>
