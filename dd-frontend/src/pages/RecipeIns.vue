<script setup>
import { ref, onMounted, computed, watchEffect, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import Swal from "sweetalert2";

const items = ref({});
const itemline = ref([]);
const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);

const getCategoryImage = (id) => `/src/assets/icon/category_${id}.png`;

const fetchData = async (id) => {
  console.log(id);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_PRODUCT_API_URL}` + "/api/recipe/" + `${id}`
    );
    if (response.status === 404) {
      alert("Not found this recipe id");
      router.push("/");
    } else if (response.status === 200) {
      items.value = response.data;
      console.log(response.data);
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ไม่พบหน้านี้",
      text: "ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา",
      confirmButtonText: "กลับสู่หน้าแรก",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/");
      }
    });
    console.error("Error fetching data:", error);
  }
};

watch(
  () => route.params.id,
  (newValue, oldValue) => {
    fetchData(newValue);
  }
);

onMounted(() => {
  fetchData(id.value);
});

const formatCookingSteps = (steps) => {
  return steps ? steps.replace(/\\n/g, "\n") : "";
};

const convertCategoryIdToString = (categoryId) => {
  switch (categoryId) {
    case 1:
      return "ไข่";
    case 2:
      return "เนื้อวัว";
    case 3:
      return "เนื้อไก่";
    case 4:
      return "เนื้อหมู";

    default:
      return "หมวดหมู่อื่นๆ";
  }
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
    <div class="w-screen mx-auto text-center">
      <p class="text-[50px] text-orange-500">{{ items.recipeName }}</p>
      <div class="flex justify-center items-center mb-3">
        <span class="mr-3">ประเภทของอาหาร</span>

        <img :src="getCategoryImage(items.categoryId)" class="w-12 h-12" />
      </div>
      <p class="text-center">
        <img
          class="block mx-auto w-[700px] h-[500px] rounded-lg"
          v-bind:src="`http://localhost:8080/${items.recipeImage}`"
        />
      </p>
      <p
        class="mt-4 mb-8 w-[800px] text-center mx-auto border p-4 border-green-500 rounded-lg"
      >
        {{ items.introduce }}
      </p>
      <div class="flex justify-center items-start">
        <div class="w-1/2 top-0">
          <h1 class="text-[30px] text-orange-500">ส่วนผสมในการทำอาหาร</h1>
          <p class="formatted-text mb-2">
            {{ formatCookingSteps(items.cookingIngredients) }}
          </p>
          <div class="flex justify-center items-center gap-4">
            <a
              href="https://www.makro.pro"
              class="flex items-center text-blue-600 hover:text-blue-300"
              ><img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvC5aMirnc2SwuFRo_WhMMuGufCXGy-_5U_0WHXtXgKg&s"
                class="h-12 w-12 rounded-full border border-green-500 mr-2"
              />ไปยังร้านค้า</a
            >
            <a
              href="https://www.bigc.co.th"
              class="flex items-center text-blue-600 hover:text-blue-300"
              ><img
                src="https://pbs.twimg.com/profile_images/1755503520978190336/l-xQuywB_400x400.jpg"
                class="h-12 w-12 rounded-full border border-red-500 mr-2"
              />ไปยังร้านค้า</a
            >
            <a
              href="https://www.lotuss.com"
              class="flex items-center text-blue-600 hover:text-blue-300"
              ><img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/BigCLogo2022.svg/1200px-BigCLogo2022.svg.png"
                class="h-12 w-12 rounded-full border border-green-500 mr-2"
              />ไปยังร้านค้า
            </a>
          </div>
        </div>
        <div class="w-1/2">
          <h1 class="text-[30px] text-orange-500">ขั้นตอนการทำอาหาร</h1>
          <p class="formatted-text">
            {{ formatCookingSteps(items.cookingSteps) }}
          </p>
        </div>
      </div>
      <div class="text-[30px] text-orange-500 py-4">
        <h1>วิดิโอสอนทำ {{ items.recipeName }}</h1>
      </div>
      <div class="flex justify-center items-center">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/mRoaxyGLHgw"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>

  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped>
.formatted-text {
  white-space: pre-wrap;
}

.flex-newline {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* ระยะห่างระหว่างแท็ก a */
}

.flex-newline a {
  display: block;
}
</style>
