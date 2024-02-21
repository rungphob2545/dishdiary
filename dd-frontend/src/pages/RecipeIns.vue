<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

const items = ref({});
const itemline = ref([]);

const fetchData = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_PRODUCT_API_URL}` + "/api/recipe/" + `${id}`
    );
    items.value = response.data;
    console.log(response.data);
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

const formatCookingSteps = (steps) => {
  return steps ? steps.replace(/\\n/g, "\n") : "";
};

// const formattedCookingSteps = computed(() => {
//   return items.value.cookingSteps
//     ? items.value.cookingSteps.replace(/\\n/g, "\n")
//     : "";
// });
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
      <p class="formatted-text">
        {{ formatCookingSteps(items.cookingIngredients) }}
      </p>
      <p>
        <img
          class="w-[450px] h-[300px]"
          v-bind:src="`http://10.4.85.10:8080/${items.recipeImage}`"
        />
      </p>
      <h1 class="text-[30px]">ขั้นตอนการทำอาหาร</h1>
      <p class="formatted-text">{{ formatCookingSteps(items.cookingSteps) }}</p>
      <p>{{ items.categoryId }}</p>
    </div>
  </div>

  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped>
.formatted-text {
  white-space: pre-wrap;
}
</style>
