<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

const items = ref({});

const fetchData = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/recipe/${id}`);
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
    <div class="mt-[-900px] ml-64 justify-start flex flex-wrap">
      <p>{{ items.recipeName }}</p>
      <p>{{ items.cookingInstruction }}</p>
      <p>
        <img class="w-[450px] h-[300px]" v-bind:src="items.recipeImage" />
      </p>
    </div>
  </div>

  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped></style>
