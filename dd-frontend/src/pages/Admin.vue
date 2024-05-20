<script setup>
import { ref, onBeforeMount, computed } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

const items = ref([]);
const selectedCategory = ref("");
const recipe = ref({});
const categories = ref([]);
const isOpen = ref(false);
const isOpenCreate = ref(false);
const newRecipe = ref({});
const errors = ref(null);
const validateUnique = ref(false);
const imageName = ref("");

const getCategoryImage = (id) => `/kp2/src/assets/icon/category_${id}.png`;

const getImage = (recipeName) => `http://localhost:8080/${recipeName}`;

console.log(import.meta.env.VITE_APP_API_URL);
const fetchData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/recipe`,
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

const fileup = ref("");
let dataTransfer = new DataTransfer();
const sizeCheck = (e) => {
  const maxSize = 10 * 1024 * 1024; //10MB
  const file = e.target.files[0];

  // ตรวจสอบว่าเป็นไฟล์รูปภาพหรือไม่ (jpg, jpeg, png)
  const allowedExtensions = ["jpg", "jpeg", "png"];
  const fileExtension = file.name.split(".").pop().toLowerCase();
  let fileInput = document.getElementById("fileupload");
  console.log(fileInput.value);
  if (!allowedExtensions.includes(fileExtension)) {
    alert("Please select an image file (jpg, jpeg, or png)");
    clearFile();
    return;
  }

  if (file.size > maxSize) {
    alert("File size should be less than 10MB");
    clearFile();
  } else {
    fileup.value = e.target.files[0];
    imageName.value = file.name;
  }
};

const clearFile = () => {
  document.getElementById("fileupload").value = "";
  imageName.value = "";
};

const createData = async (
  recipeName,
  introduce,
  cookingIngredients,
  cookingSteps,
  categoryEn,
  recipeImage
) => {
  console.log(
    recipeName,
    introduce,
    cookingIngredients,
    cookingSteps,
    categoryEn,
    recipeImage
  );
  try {
    const fileInput = document.getElementById("fileupload").files[0];
    if (!fileInput) {
      console.error("File input element not found");
      return;
    }

    const formData = new FormData();
    formData.append("recipeName", recipeName);
    formData.append("cookingSteps", cookingSteps);
    formData.append("cookingIngredients", cookingIngredients);
    formData.append("introduce", introduce);
    formData.append("recipeImage", fileInput);
    formData.append("categoryEn", categoryEn);

    const response = await axios.post(
      `${import.meta.env.VITE_PRODUCT_API_URL}` + "/api/recipe",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 201) {
      location.reload();
      fetchData();
      alert("Recipe added successfully");
    } else if (res.status === 400) {
      validateUnique.value = true;
    } else {
      console.log("Error adding recipe");
    }
  } catch (error) {
    console.error("Error adding recipe:", error);
    errors.value = error;
    console.log(errors);
  }
};

const removeData = async (id) => {
  console.log(id);
  try {
    if (confirm("Delete this user?") == true) {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/recipe/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          method: "PUT",
        },
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

const getCategories = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/categories`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "GET",
      }
    );
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const checkValid = ref(false);
const isRecipeNameValid = () => {
  console.log(newRecipe.value.recipeName.length);
  if (newRecipe.value.recipeName.length < 5) {
    checkValid.value = false;
  } else checkValid.value = true;
};

const filteredItems = computed(() => {
  if (!selectedCategory.value) {
    return items.value;
  } else {
    return items.value.filter(
      (item) => item.category === selectedCategory.value
    );
  }
});

onBeforeMount(() => {
  fetchData();
  getCategories();
});

// const isIntroduceValid = computed(() => items.value.introduce.length > 0);
// const isCookingIngredientsValid = computed(
//   () => items.value.cookingIngredients.length > 0
// );
// const isCookingStepsValid = computed(() => items.value.cookingSteps.length > 0);
// const isCategoryValid = computed(() => items.value.categoryEn !== null);
</script>

<template>
  <div class="">
    <div>
      <Navbar />
    </div>

    <!-- Modal Create -->
    <div
      v-show="isOpenCreate"
      class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 h-screen w-screen z-50"
    >
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
              <span class="text-red-500"
                >Name must between 5-20 characters</span
              >
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

          <button
            @click="isOpenCreate = false"
            class="px-6 py-2 text-blue-800 border border-blue-600 rounded"
          >
            Cancel
          </button>
          <button
            class="px-6 py-2 ml-2 text-blue-100 bg-blue-600 rounded"
            :class="{ disabled: !checkValid }"
            :disabled="!checkValid"
            @click="
              createData(
                newRecipe.recipeName,
                newRecipe.introduce,
                newRecipe.cookingIngredients,
                newRecipe.cookingSteps,
                newRecipe.categoryEn,
                imageName
              )
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <div class="justify-start pt-24" v-if="items.length < 1">
      <button
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
        @click="isOpenCreate = true"
      >
        เพิ่มสูตรอาหาร
      </button>
      <h1 class="text-[80px] text-center font-bold mr-500">
        ยังไม่มีสูตรอาหารในขณะนี้
      </h1>
    </div>

    <div class="justify-start pt-24 ml-32" v-else>
      <button
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
        @click="isOpenCreate = true"
      >
        เพิ่มสูตรอาหาร
      </button>

      <div class="grid grid-cols-3 gap-4 pb-12 w-[1400px]">
        <ul
          v-for="item in items"
          :key="item.id"
          class="flex flex-col items-center"
        >
          <div
            class="flex flex-col items-center bg-gradient-to-b from-blue-200 to-white shadow-lg rounded-lg overflow-hidden object-center cursor-pointer w-[450px]"
          >
            <router-link :to="{ name: 'RecipeIns', params: { id: item.id } }">
              <img
                class="h-40 w-[1000px] object-cover"
                v-bind:src="getImage(item.recipeImage)"
              />

              <div class="p-4 w-full">
                <div class="flex items-center">
                  <div class="font-bold text-2xl text-black">
                    {{ item.recipeName }}
                  </div>
                  <div class="flex items-center ml-4 gap-1">
                    <svg
                      class="h-6 w-6 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>
                      {{ item.timeBased }}
                    </span>
                  </div>
                  <div class="ml-auto flex gap-2">
                    <div v-if="item.nutAllergy == 1">
                      <img src="src\assets\icon\nut.png" class="w-8 h-8" />
                    </div>
                    <div v-if="item.vegetarian == 1">
                      <img src="src\assets\icon\vegan.png" class="w-8 h-8" />
                    </div>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-sm">เรทติ้ง: {{ item.rating }}</span>
                  </div>
                  <div class="text-sm mt-2 flex gap-2">
                    <span>ประเภทวัตถุดิบ: </span>
                    <img
                      :src="getCategoryImage(item.categoryEn)"
                      class="w-6 h-6"
                    />
                  </div>
                  <div class="text-sm mt-2 flex">
                    <span>ประเภทอาหาร: {{ item.type }}</span>
                  </div>
                  <div class="ml-auto">
                    <div class="" v-if="item.video">
                      <svg
                        class="h-8 w-8 text-red-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect
                          x="1"
                          y="5"
                          width="15"
                          height="14"
                          rx="2"
                          ry="2"
                        />
                      </svg>
                    </div>
                    <div class="" v-else>
                      <svg
                        class="h-8 w-8 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"
                        />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="pt-4">
            <div class="flex justify-between">
              <button
                class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                @click="(isOpen = true), fetchDataById(item.id)"
              >
                Edit
              </button>
              <button
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                @click="removeData(item.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </ul>
      </div>

      <!-- Modal Edit -->
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
    </div>
  </div>
</template>

<style scoped>
button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.file-upload-input {
  position: absolute;
  outline: none;
  opacity: 0;
  cursor: pointer;
}
</style>
