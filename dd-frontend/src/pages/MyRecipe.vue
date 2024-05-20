<script setup>
import { ref } from "vue";

const items = ref([]);
const isOpenCreate = ref(false);

const fetchDataByUserId = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/recipe/user`,
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
</script>

<template>
  <div class="max-w-2xl p-6 bg-white rounded-md shadow-xl w-1/2">
    <div class="flex items-center justify-between">
      <h3 class="text-2xl">เพิ่มสูตรอาหาร</h3>
      <svg
        @click="isOpenCreate = false"
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
            v-model="newRecipe.recipeName"
            v-on:input="isRecipeNameValid()"
            minlength="5"
            maxlength="20"
            required
          />
        </div>
        <div v-if="errors" class="text-red-500 mt-2 mb-4 flex items-center">
          <span>{{ errors.response.data.message }}</span>
          <svg
            class="h-8 w-8 text-red-500 ml-2"
            fill="none"
            viewBox="0 0 30 24"
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
        <div
          v-show="!checkValid"
          class="text-red-500 mt-2 mb-4 flex items-center"
        >
          <span class="text-red-500">Name must between 5-20 characters</span>
          <svg
            class="h-8 w-8 text-red-400 ml-2"
            fill="none"
            viewBox="0 0 30 24"
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
        <div
          v-show="checkValid"
          class="text-green-500 mt-2 mb-6 flex items-center"
        >
          <span class="text-green-500 pr-1">Valid Recipe Name</span>
          <svg
            class="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 30 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
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
            v-model="newRecipe.introduce"
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
            v-model="newRecipe.cookingIngredients"
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
            v-model="newRecipe.cookingSteps"
            class="bg-gray-50 h-32 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required
          ></textarea>
        </div>
        <div>
          <label
            for="cookingSteps"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
            >Category</label
          >
          <select
            type=""
            name="cookingSteps"
            id="cookingSteps"
            v-model="newRecipe.categoryEn"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required
          >
            <option value="1">Egg</option>
            <option value="2">Beef</option>
            <option value="3">Chicken</option>
            <option value="4">Pork</option>
          </select>
        </div>
        <div>
          <label
            for="recipeImage"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
            >Recipe Image</label
          >
          <input
            type="file"
            name="recipeImage"
            id="fileupload"
            @change="sizeCheck($event)"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required
          />
        </div>

        <div class="flex justify-between"></div>
      </form>
    </div>
  </div>
</template>

<style></style>
