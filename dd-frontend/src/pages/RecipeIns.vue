<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

const items = ref({});
const itemline = ref([]);

const fetchData = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}` + "/api/recipe/" + `${id}`
    );
    items.value = response.data;
    console.log(items);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
onMounted(() => {
  const route = useRoute();
  const id = route.params.id;
  console.log(id);
  fetchData(id);
});
</script>

<template>
  <div class="">
    <div>
      <Navbar />
    </div>
    <div class="mt-[-900px] ml-64 justify-start flex-wrap">
      <p class="text-[30px]">{{ items.recipeName }}</p>
      <br />
      <p>{{ items.introduce }}</p>
      <h1 class="text-[30px]">ส่วนผสมในการทำอาหาร</h1>
      <p>{{ items.cookingIngredients }}</p>
      <p>
        <img class="w-[450px] h-[300px]" v-bind:src="items.recipeImage" />
      </p>
      <h1 class="text-[30px]">ขั้นตอนการทำอาหาร</h1>
      <p>{{ items.cookingSteps }}</p>
    </div>
  </div>

  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped></style>
