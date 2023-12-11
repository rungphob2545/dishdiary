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
      `${import.meta.env.VITE_PRODUCT_API_URL}` + "/api/recipe/" + `${id}`
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
      <p>{{ items.recipeName }}</p>
      <br />
      <p>{{ items.introduce }}</p>
      <p>{{ items.cookingIngredients }}</p>
      <p>
        <img class="w-[450px] h-[300px]" v-bind:src="items.recipeImage" />
      </p>
      <p>{{ items.cookingSteps }}</p>
    </div>
  </div>

  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped></style>
