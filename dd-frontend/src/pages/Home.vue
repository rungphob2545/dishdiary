<script setup>
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

const items = ref([]);

console.log(import.meta.env.VITE_APP_API_URL);
const fetchData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/recipe`,
      {
        method: "GET",
      }
    );

    items.value = response.data;
    console.log(items.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onBeforeMount(() => {
  fetchData();
});
</script>

<template>
  <div class="">
    <div>
      <Navbar />
    </div>
    <div
      class="mt-[-900px] ml-64 justify-start flex flex-wrap"
      v-if="items.length < 1"
    >
      <h1>No Recipe</h1>
    </div>
    <div class="mt-[-900px] ml-64 justify-start flex flex-wrap" v-else>
      <ul v-for="item in items" :key="item.id" class="px-5 pb-10">
        <router-link :to="{ name: 'RecipeIns', params: { id: item.id } }">
          <li>{{ item.recipeName }}</li>
          <li>
            <img class="w-[450px] h-[300px]" v-bind:src="item.recipeImage" />
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
