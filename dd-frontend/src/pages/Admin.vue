<script setup>
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

const items = ref([]);
const recipe = ref({});
const isOpen = ref(false);

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

const fetchDataById = async (id) => {
  console.log(id);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}` + "/api/recipe/" + `${id}`
    );
    recipe.value = response.data;
    console.log(recipe);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const removeData = async (id) => {
  console.log(id);
  try {
    if (confirm("Delete this user?") == true) {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/recipe/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        location.reload();
        items.value = items.value.filter((item) => item.id !== id);
        console.log("deleted successfully");
      } else console.log("error, cannot delete data");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const editData = async (
  id,
  recipeName,
  introduce,
  cookingIngredients,
  cookingSteps
) => {
  console.log(id);
  console.log(
    recipeName + " " + introduce + " " + cookingIngredients + " " + cookingSteps
  );
  try {
    if (confirm("Edit data?") == true) {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/recipe/${id}`,
        {
          recipeName: recipeName,
          introduce: introduce,
          cookingIngredients: cookingIngredients,
          cookingSteps: cookingSteps,
        }
      );
      if (response.status === 200) {
        location.reload();
        alert("Edit Success");
        console.log("edit successfully");
      } else console.log("error, cannot delete data");
    }
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
        <div class="flex justify-between">
          <button
            class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            @click="(isOpen = true), fetchDataById(item.id)"
          >
            Edit
          </button>
          <button
            class="bg-red-500 hover:bg-danger-700 text-white font-bold py-2 px-4 rounded"
            @click="removeData(item.id)"
          >
            Delete
          </button>
        </div>

        <div
          v-show="isOpen"
          class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 h-screen w-screen"
        >
          <div class="max-w-2xl p-6 bg-white rounded-md shadow-xl w-1/2">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl">Edit Recipe</h3>
              <svg
                @click="isOpen = false"
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 text-red-900 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="mt-2">
              <form class="space-y-4" action="#">
                <div>
                  <label
                    for="Recipe's name"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                    >Recipe's name
                  </label>
                  <input
                    type="text"
                    name="recipeName"
                    id="recipeName"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    v-model="recipe.recipeName"
                    disabled
                  />
                </div>
                <div>
                  <label
                    for="Introduce"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                    >Introduce</label
                  >
                  <textarea
                    type="text"
                    name="Introduce"
                    id="Introduce"
                    v-model="recipe.introduce"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  ></textarea>
                </div>
                <div>
                  <label
                    for="cookingIngredients"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                    >Cooking's Ingredients</label
                  >
                  <textarea
                    type="text"
                    name="cookingIngredients"
                    id="cookingIngredients"
                    v-model="recipe.cookingIngredients"
                    class="bg-gray-50 h-32 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  ></textarea>
                </div>
                <div>
                  <label
                    for="cookingSteps"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                    >Cooking Steps</label
                  >
                  <textarea
                    type="text"
                    name="cookingSteps"
                    id="cookingSteps"
                    v-model="recipe.cookingSteps"
                    class="bg-gray-50 h-32 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  ></textarea>
                </div>
                <div class="flex justify-between"></div>
              </form>
              <button
                @click="isOpen = false"
                class="px-6 py-2 text-blue-800 border border-blue-600 rounded"
              >
                Cancel
              </button>
              <button
                class="px-6 py-2 ml-2 text-blue-100 bg-blue-600 rounded"
                @click="
                  editData(
                    recipe.id,
                    recipe.recipeName,
                    recipe.introduce,
                    recipe.cookingIngredients,
                    recipe.cookingSteps
                  )
                "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
