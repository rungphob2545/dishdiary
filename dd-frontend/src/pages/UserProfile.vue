<script setup>
import { ref, onBeforeMount, computed, watch } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import Swal from "sweetalert2";

const user = ref({});
const favorites = ref([]);
const userRecipes = ref([]);
const errors = ref(null);
const isOpenCreate = ref(false);
const currentView = ref("myRecipes");
const newRecipe = ref({});

const getImage = (img) => `http://localhost:8080/${img}`;
const getCategoryImage = (id) => `/kp2/src/assets/icon/category_${id}.png`;

const fetchData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/user`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "GET",
      }
    );

    user.value = response.data;
    console.log(user.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchRecipeOwn = async () => {
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

    userRecipes.value = response.data;
    console.log("user rc", userRecipes.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchFavorites = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/favorite`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "GET",
      }
    );

    favorites.value = response.data;
    console.log(favorites.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const addToFavorites = async (recipeId, userId) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/favorite`,
      {
        recipeId: recipeId,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 201) {
      Swal.fire({
        icon: "success",
        title: "นำเข้า Favorite สำเร็จ",
        confirmButtonText: "ตกลง",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    }
  } catch (error) {
    console.error("Error adding recipe:", error);
    errors.value = error;
    console.log(errors);
  }
};

const removeFavorites = async (recipeId, userId) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_API_URL}/api/favorite`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          recipeId: recipeId,
          userId: userId,
        },
      }
    );
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "นำออกจาก Favorite สำเร็จ",
        confirmButtonText: "ตกลง",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    }
  } catch (error) {
    console.error("Error adding recipe:", error);
    errors.value = error;
    console.log(errors);
  }
};

const fileup = ref("");
const imageName = ref("");
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

const videoUrlError = ref("");

const validateVideoUrl = () => {
  const url = newRecipe.value.videoUrl;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  if (url && !youtubeRegex.test(url)) {
    videoUrlError.value = "Please enter a valid YouTube URL.";
  } else {
    videoUrlError.value = "";
  }
};

const createData = async (
  recipeName,
  introduce,
  cookingSteps,
  ingredients1,
  ingredients2,
  ingredients3,
  ingredients4,
  ingredients5,
  ingredients6,
  ingredients7,
  ingredients8,
  ingredients9,
  ingredients10,
  ingredients11,
  ingredients12,
  measure1,
  measure2,
  measure3,
  measure4,
  measure5,
  measure6,
  measure7,
  measure8,
  measure9,
  measure10,
  measure11,
  measure12,
  typeEn,
  typeTh,
  categoryEn,
  categoryTh,
  difficulty,
  timeBased,
  vegetarian,
  nutAllergy,
  video,
  recipeImage
) => {
  try {
    const fileInput = document.getElementById("fileupload").files[0];
    if (!fileInput) {
      console.error("File input element not found");
      return;
    }

    const setValue = (value) => (value === undefined ? "0" : value);

    const formData = new FormData();
    formData.append("recipeName", recipeName);

    formData.append("ingredients1", ingredients1);
    formData.append("ingredients2", ingredients2);
    formData.append("ingredients3", ingredients3);
    formData.append("ingredients4", ingredients4);
    formData.append("ingredients5", ingredients5);
    formData.append("ingredients6", ingredients6);
    formData.append("ingredients7", ingredients7);
    formData.append("ingredients8", ingredients8);
    formData.append("ingredients9", ingredients9);
    formData.append("ingredients10", ingredients10);
    formData.append("ingredients11", ingredients11);
    formData.append("ingredients12", ingredients12);
    formData.append("measure1", measure1);
    formData.append("measure2", measure2);
    formData.append("measure3", measure3);
    formData.append("measure4", measure4);
    formData.append("measure5", measure5);
    formData.append("measure6", measure6);
    formData.append("measure7", measure7);
    formData.append("measure8", measure8);
    formData.append("measure9", measure9);
    formData.append("measure10", measure10);
    formData.append("measure11", measure11);
    formData.append("measure12", measure12);
    formData.append("cookingSteps", cookingSteps);
    formData.append("introduce", introduce);

    formData.append("typeEn", typeEn);
    formData.append("typeTh", typeTh);
    formData.append("categoryEn", categoryEn);
    formData.append("categoryTh", categoryTh);
    formData.append("difficulty", difficulty);
    formData.append("timeBased", timeBased);

    formData.append("vegetarian", vegetarian);
    formData.append("nutAllergy", nutAllergy);

    formData.append("recipeImage", fileInput);
    formData.append("video", setValue(video));

    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}` + "/api/recipe",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 201) {
      Swal.fire({
        icon: "success",
        title: "สร้าง Recipe สำเร็จ !",
        confirmButtonText: "ตกลง",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    } else if (res.status === 400) {
      Swal.fire({
        icon: "error",
        toast: true,
        text: "ตรวจสอบก่อนทำรายการอีกครั้ง",
        position: "top-right",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
      validateUnique.value = true;
    }
  } catch (error) {
    console.error("Error adding recipe:", error);
    Swal.fire({
      icon: "error",
      toast: true,
      text: "ตรวจสอบก่อนทำรายการอีกครั้ง",
      position: "top-right",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
    });
    errors.value = error;
    console.log(errors);
  }
};

const confirmDelete = (id) => {
  Swal.fire({
    title: "ลบเมนูของคุณ?",
    text: "คุณต้องการยืนยันลบข้อมูลนี้หรือไม่?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then((result) => {
    if (result.isConfirmed) {
      deleteRecipe(id);
    }
  });
};

const deleteRecipe = async (recipeId) => {
  console.log(recipeId);
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_API_URL}/api/recipe/${recipeId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "DELETE",
      }
    );

    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "ลบ Recipe สำเร็จ !",
        confirmButtonText: "ตกลง",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    }
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

const recipeCount = computed(() => {
  if (userRecipes.value && Array.isArray(userRecipes.value)) {
    return userRecipes.value.length;
  } else {
    return 0; // หรือค่าเริ่มต้นอื่นๆ ตามที่คุณต้องการ
  }
});

const favoriteCount = computed(() => {
  if (
    favorites.value &&
    favorites.value.favorites &&
    Array.isArray(favorites.value.favorites)
  ) {
    return favorites.value.favorites.length;
  } else {
    return 0; // หรือค่าเริ่มต้นอื่นๆ ตามที่คุณต้องการ
  }
});

const sortOrder = ref("asc");
const sortBy = ref("rating"); // reactive variable สำหรับเก็บการเรียงลำดับที่เลือก

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
};
const sortedItems = computed(() => {
  let sortedData = [];

  if (Array.isArray(favorites.value.recipes)) {
    sortedData = [...favorites.value.recipes]; // ทำการคัดลอกอาร์เรย์
  } else {
    return sortedData; // ส่งคืนอาร์เรย์ว่างหรือจัดการตามที่ต้องการ
  }

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

const combinedItems = computed(() => {
  return sortedItems.value.map((item) => {
    const favorite = favorites.value.recipes
      ? favorites.value.recipes.find((recipe) => recipe.id === item.id)
      : null;
    return {
      ...item,
      favorite,
    };
  });
});

const categories = {
  Egg: "ไข่",
  Beef: "เนื้อวัว",
  Chicken: "เนื้อไก่",
  Pork: "เนื้อหมู",
};

watch(
  () => newRecipe.value.categoryEn,
  (newVal) => {
    newRecipe.value.categoryTh = categories[newVal];
  }
);

const types = {
  Fried: "ของทอด",
  Noodle: "เส้น",
  Steak: "สเต็ก",
  SideDish: "กับข้าว",
  Salad: "สลัด",
  Rice: "ข้าว",
  Dessert: "ของหวาน",
};

const dropdownOpen = ref(null);

const toggleDropdown = (id) => {
  dropdownOpen.value = dropdownOpen.value === id ? null : id;
};

watch(
  () => newRecipe.value.typeEn,
  (newVal) => {
    newRecipe.value.typeTh = types[newVal];
  }
);

onBeforeMount(() => {
  fetchData();
  fetchFavorites();
  fetchRecipeOwn();
  console.log("dd", favoriteCount);
});
</script>

<template>
  <div class="pb-24">
    <Navbar />
  </div>
  <div class="ml-64">
    <div class="flex gap-8">
      <div class="w-[300px] bg-white shadow-md rounded-lg overflow-hidden">
        <div class="p-4">
          <img
            :src="getImage(user.userImage)"
            alt="Profile Picture"
            class="w-40 h-40 rounded-full mx-auto mb-4"
          />
        </div>
      </div>
      <div
        class="w-[690px] bg-white h-60 shadow-md rounded-lg overflow-hidden p-8"
      >
        <div class="items-center">
          <div class="text-center flex gap-3 items-center mb-4">
            <p class="text-xl mr-2">Name</p>
            <input
              type="text"
              class="text-xl bg-gray-300 p-3 rounded-lg"
              v-model="user.userName"
              disabled
            />
            <button class="">
              <svg
                class="h-8 w-8 text-red-500"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path
                  d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"
                />
                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                <line x1="16" y1="5" x2="19" y2="8" />
              </svg>
            </button>
          </div>
          <div class="text-center flex gap-3 items-center">
            <p class="text-xl mr-3">Email</p>
            <input
              type="text"
              class="text-xl bg-gray-300 p-3 rounded-lg"
              v-model="user.userEmail"
              disabled
            />

            <button>
              <svg
                class="h-8 w-8 text-red-500"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path
                  d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"
                />
                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                <line x1="16" y1="5" x2="19" y2="8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        class="w-[300px] bg-white shadow-md rounded-lg overflow-hidden p-8 text-center h-60 block"
      >
        <div class="mb-4">
          <h1 class="text-5xl font-bold">{{ favoriteCount }}</h1>
          <p class="text-lg">จำนวนเมนูที่คุณถูกใจ</p>
        </div>
        <div>
          <h1 class="text-5xl font-bold">{{ recipeCount }}</h1>
          <p class="text-lg">จำนวนเมนูที่คุณสร้าง</p>
        </div>
      </div>
    </div>

    <!-- Modal Create -->
    <div
      v-show="isOpenCreate"
      class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 h-screen w-screen z-50"
    >
      <div class="p-6 bg-white rounded-md shadow-xl w-[1200px] fixed">
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
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:text-black"
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
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                required
              ></textarea>
            </div>
            <div class="block">
              <label
                for="cookingIngredients"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                >วัตถุดิบที่ใช้</label
              >
              <div class="flex gap-2">
                <input
                  type="text"
                  name="ingredients1"
                  id="ingredients1"
                  v-model="newRecipe.ingredients1"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  required
                />
                <input
                  type="text"
                  name="ingredients2"
                  id="ingredients2"
                  v-model="newRecipe.ingredients2"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="ingredients3"
                  id="ingredients3"
                  v-model="newRecipe.ingredients3"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="ingredients4"
                  id="ingredients4"
                  v-model="newRecipe.ingredients4"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="ingredients5"
                  id="ingredients5"
                  v-model="newRecipe.ingredients5"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="ingredients6"
                  id="ingredients6"
                  v-model="newRecipe.ingredients6"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="ingredients7"
                  id="ingredients7"
                  v-model="newRecipe.ingredients7"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="ingredients8"
                  id="ingredients8"
                  v-model="newRecipe.ingredients8"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="ingredients9"
                  id="ingredients9"
                  v-model="newRecipe.ingredients9"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="ingredients10"
                  id="ingredients10"
                  v-model="newRecipe.ingredients10"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="ingredients11"
                  id="ingredients11"
                  v-model="newRecipe.ingredients11"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="ingredients12"
                  id="ingredients12"
                  v-model="newRecipe.ingredients12"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
              </div>
              <label
                for="cookingIngredients"
                class="block my-2 text-sm font-medium text-gray-900 dark:text-dark"
                >ปริมาณของวัตถุดิบ ( ปริมาณ หน่วย ) เช่น 10 กรัม</label
              >
              <div class="flex gap-2">
                <input
                  type="text"
                  name="measure1"
                  id="measure1"
                  v-model="newRecipe.measure1"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  required
                />
                <input
                  type="text"
                  name="measure2"
                  id="measure2"
                  v-model="newRecipe.measure2"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="measure3"
                  id="measure3"
                  v-model="newRecipe.measure3"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="measure4"
                  id="measure4"
                  v-model="newRecipe.measure4"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="measure5"
                  id="measure5"
                  v-model="newRecipe.measure5"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="measure6"
                  id="measure6"
                  v-model="newRecipe.measure6"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="measure7"
                  id="measure7"
                  v-model="newRecipe.measure7"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="measure8"
                  id="measure8"
                  v-model="newRecipe.measure8"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="measure9"
                  id="measure9"
                  v-model="newRecipe.measure9"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="measure10"
                  id="measure10"
                  v-model="newRecipe.measure10"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="measure11"
                  id="measure11"
                  v-model="newRecipe.measure11"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
                <input
                  type="text"
                  name="measure12"
                  id="measure12"
                  v-model="newRecipe.measure12"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                />
              </div>
            </div>
            <div>
              <label
                for="cookingSteps"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                >ขั้นตอนในการทำ</label
              >
              <textarea
                type="text"
                name="cookingSteps"
                id="cookingSteps"
                v-model="newRecipe.cookingSteps"
                class="bg-gray-50 h-32 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                required
              ></textarea>
            </div>
            <div class="flex gap-4">
              <div>
                <label
                  for="categoryEn"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                >
                  Category (English)
                </label>
                <select
                  name="categoryEn"
                  id="categoryEn"
                  v-model="newRecipe.categoryEn"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[275px] p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  required
                >
                  <option value="Egg">Egg</option>
                  <option value="Beef">Beef</option>
                  <option value="Chicken">Chicken</option>
                  <option value="Pork">Pork</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>
              <div>
                <label
                  for="categoryTh"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                >
                  Category (Thai)
                </label>
                <select
                  name="categoryTh"
                  id="categoryTh"
                  v-model="newRecipe.categoryTh"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[275px] p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  required
                  disabled
                >
                  <option value="ไข่">ไข่</option>
                  <option value="เนื้อวัว">เนื้อวัว</option>
                  <option value="เนื้อไก่">เนื้อไก่</option>
                  <option value="เนื้อหมู">เนื้อหมู</option>
                  <option value="มังสวิรัติ">มังสวิรัติ</option>
                </select>
              </div>

              <div>
                <label
                  for="typeEn"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                >
                  Type (English)
                </label>
                <select
                  name="typeEn"
                  id="typeEn"
                  v-model="newRecipe.typeEn"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[275px] p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  required
                >
                  <option value="Noodle">Noodle</option>
                  <option value="Steak">Steak</option>
                  <option value="Fried">Fried</option>
                  <option value="Rice">Rice</option>
                  <option value="SideDish">Side Dish</option>
                  <option value="Salad">Salad</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>

              <div>
                <label
                  for="typeTh"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                >
                  Type (Thai)
                </label>
                <select
                  name="typeTh"
                  id="typeTh"
                  v-model="newRecipe.typeTh"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[275px] p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  required
                  disabled
                >
                  <option value="เส้น">เส้น</option>
                  <option value="สเต็ก">สเต็ก</option>
                  <option value="ของทอด">ของทอด</option>
                  <option value="สลัด">สลัด</option>
                  <option value="ของหวาน">ของหวาน</option>
                </select>
              </div>
            </div>
            <div class="flex gap-4">
              <div>
                <label
                  for="difficulty"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                  >ระดับความยากง่ายของเมนู</label
                >
                <select
                  name="vegetarian"
                  id="vegetarian"
                  v-model="newRecipe.difficulty"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[275px] p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  required
                >
                  <option value="Easy">ง่าย</option>
                  <option value="Normal">ปานกลาง</option>
                  <option value="Difficult">ค่อนข้างใช้ความสามารถ</option>
                </select>
              </div>
              <div>
                <label
                  for="timeBased"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                  >เวลาที่ใช้โดยประมาณ</label
                >
                <input
                  type="text"
                  name="recipeImage"
                  id="timeBased"
                  v-model="newRecipe.timeBased"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[275px] p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  required
                />
              </div>
              <div>
                <label
                  for="nutAllergy"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                  >เป็นอาหารทีมีถั่วมั้ย?</label
                >
                <select
                  name="nutAllergy"
                  id="nutAllergy"
                  v-model="newRecipe.nutAllergy"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[275px] p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  required
                >
                  <option value="0">ไม่เป็น</option>
                  <option value="1">เป็น</option>
                </select>
              </div>
              <div>
                <label
                  for="vegetarian"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                  >เป็นอาหารประเภทมังสวัรติมั้ย?</label
                >
                <select
                  name="vegetarian"
                  id="vegetarian"
                  v-model="newRecipe.vegetarian"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[275px] p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  required
                >
                  <option value="0">ไม่เป็น</option>
                  <option value="1">เป็น</option>
                </select>
              </div>
            </div>
            <div class="flex gap-4">
              <div>
                <label
                  for="video"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                  >คลิปวิดิโอ ( optimal )</label
                >
                <input
                  type="text"
                  name="recipeImage"
                  v-model="newRecipe.video"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block h-12 w-[560px] p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  required
                />
                <p v-if="videoUrlError" class="text-red-500">
                  {{ videoUrlError }}
                </p>
              </div>
              <div>
                <label
                  for="recipeImage"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                  >รูปเมนู</label
                >
                <input
                  type="file"
                  name="recipeImage"
                  id="fileupload"
                  @change="sizeCheck($event)"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[570px] p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                  required
                />
              </div>
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
                newRecipe.cookingSteps,
                newRecipe.ingredients1,
                newRecipe.ingredients2,
                newRecipe.ingredients3,
                newRecipe.ingredients4,
                newRecipe.ingredients5,
                newRecipe.ingredients6,
                newRecipe.ingredients7,
                newRecipe.ingredients8,
                newRecipe.ingredients9,
                newRecipe.ingredients10,
                newRecipe.ingredients11,
                newRecipe.ingredients12,
                newRecipe.measure1,
                newRecipe.measure2,
                newRecipe.measure3,
                newRecipe.measure4,
                newRecipe.measure5,
                newRecipe.measure6,
                newRecipe.measure7,
                newRecipe.measure8,
                newRecipe.measure9,
                newRecipe.measure10,
                newRecipe.measure11,
                newRecipe.measure12,
                newRecipe.typeEn,
                newRecipe.typeTh,
                newRecipe.categoryEn,
                newRecipe.categoryTh,
                newRecipe.difficulty,
                newRecipe.timeBased,
                newRecipe.vegetarian,
                newRecipe.nutAllergy,
                newRecipe.video,
                imageName
              )
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <div class="w-[1350px]">
      <div class="flex space-x-4 mt-4">
        <button
          @click="currentView = 'myRecipes'"
          :class="{
            'bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded': true,
            'bg-blue-700': currentView === 'myRecipes',
          }"
        >
          เมนูของฉัน
        </button>
        <button
          @click="currentView = 'favoriteRecipes'"
          :class="{
            'bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded': true,
            'bg-green-700': currentView === 'favoriteRecipes',
          }"
        >
          เมนูที่คุณถูกใจ
        </button>
        <div class="justify-start">
          <button
            class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            @click="isOpenCreate = true"
          >
            เพิ่มสูตรอาหาร
          </button>
        </div>
      </div>

      <div
        v-if="currentView === 'myRecipes'"
        class="w-[1350px] bg-white shadow-md rounded-lg overflow-hidden p-8 mt-6 text-center"
      >
        <div class="grid grid-cols-2 gap-4 pb-12 w-[1300px]">
          <ul
            v-for="item in userRecipes"
            :key="item.id"
            class="flex flex-col items-center"
          >
            <div
              class="flex flex-col items-center bg-gradient-to-b from-blue-200 to-white shadow-lg rounded-lg overflow-hidden object-center transition duration-300 transform hover:scale-105 cursor-pointer w-[600px]"
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
                      <div class="" v-if="item.video !== `0`">
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
              <div class="absolute top-2 right-2">
                <button
                  @click="toggleDropdown(item.id)"
                  class="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    class="h-8 w-8 text-black p-1 bg-gray-400 rounded-full"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <circle cx="5" cy="12" r="1" />
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                  </svg>
                </button>
                <div
                  v-if="dropdownOpen === item.id"
                  class="mt-2 w-48 bg-white rounded-md shadow-lg z-20 absolute right-0"
                >
                  <button
                    @click="editRecipe(item.id)"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(item.id)"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </ul>
        </div>
      </div>

      <div
        v-else
        class="w-[1350px] bg-white shadow-md rounded-lg overflow-hidden p-8 mt-6 text-center"
      >
        <div class="grid grid-cols-2 gap-4 pb-12 w-[1300px]">
          <ul
            v-for="item in combinedItems"
            :key="item.id"
            class="flex flex-col items-center"
          >
            <div
              class="flex flex-col items-center bg-gradient-to-b from-blue-200 to-white shadow-lg rounded-lg overflow-hidden object-center transition duration-300 transform hover:scale-105 cursor-pointer w-[600px]"
            >
              <div>
                <button
                  v-if="item.favorite"
                  class="absolute top-0 right-0 m-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-200 focus:outline-none"
                  @click="removeFavorites(item.id)"
                >
                  <img src="src\assets\icon\heart.png" class="w-7 h-7" />
                </button>
                <button
                  v-else
                  class="absolute top-0 right-0 m-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-200 focus:outline-none"
                  @click="addToFavorites(item.id)"
                >
                  <svg
                    class="h-8 w-8 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
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
                      <div class="" v-if="item.video !== `0`">
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
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

button {
  margin-top: 10px;
}
</style>
