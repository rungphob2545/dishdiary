<script setup>
import { ref, onBeforeMount, computed } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import Footer from "../components/Footer.vue";

const ingredients = ref([]);
const items = ref([]);
const categories = ref([]);
const route = useRoute();
const id = route.params.id;

const selectedCategory = ref([]);
const getCategoryImage = (id) => `/kp2/src/assets/icon/category_${id}.png`;

const getImage = (recipeName) => `http://localhost:8080/${recipeName}`;

console.log("getimage", getCategoryImage(1));

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

const fetchCategories = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/categories`,
      {
        method: "GET",
      }
    );

    categories.value = response.data;
    console.log(categories.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchIngredients = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/ingredients`
    );

    ingredients.value = response.data;
    console.log("ingredient", ingredients.value);
  } catch (error) {
    console.error("Error fetching ingredient:", error);
  }
};

const addToCart = async (ingredientId, userId, quantity) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/cart`,
      {
        ingredientId: ingredientId,
        userId: userId,
        quantity: quantity,
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
  } catch (err) {
    console.log(err);
  }
};

const formatPrice = (ingredient) => {
  return `$${
    ingredient.ingredientPricePerUnit * ingredient.ingredientQuantity
  }`;
};

const calculatePrice = (ingredient) => {
  ingredient.price =
    ingredient.ingredientPricePerUnit * ingredient.ingredientQuantity;
};

const increaseQuantity = (ingredient) => {
  ingredient.ingredientQuantity++; // เพิ่มจำนวนส่วนประกอบของรายการนี้
};

const deceaseQuantity = (ingredient) => {
  ingredient.ingredientQuantity--; // เพิ่มจำนวนส่วนประกอบของรายการนี้
};

const convertCategoryIdToString = (id) => {
  switch (id) {
    case 1:
      return "ไข่";
    case 2:
      return "เนื้อวัว";
    case 3:
      return "เนื้อไก่";
    case 4:
      return "เนื้อหมู";
    case 5:
      return "ผัก";
    default:
      return "หมวดหมู่อื่นๆ";
  }
};

const filteredItems = computed(() => {
  if (selectedCategory.value.length === 0) {
    console.log("Filtered items1:", selectedCategory); // เพิ่ม console.log นี้เพื่อดูผลลัพธ์ของการ filter
    return items.value;
  } else {
    const filtered = items.value.filter((item) =>
      selectedCategory.value.includes(item.categoryId)
    );
    console.log(items.value);
    console.log(selectedCategory.value);
    console.log("Filtered items2:", filtered);
    return filtered;
  }
});

const shuffledItems = computed(() => {
  return filteredItems.value.sort(() => Math.random() - 0.5);
});

onBeforeMount(() => {
  fetchData();
  fetchCategories();
  fetchIngredients();
  console.log("filter", filteredItems);
});
</script>

<template>
  <div class="h-screen">
    <div class="">
      <Navbar />
    </div>
    <div
      class="justify-start flex flex-wrap ml-56 pt-16"
      v-if="items.length < 1"
    >
      <div class="w-full">
        <div class="text py-4 pb-16">
          <h1 class="text-8xl font-bold pb-4 text-white">Dish DIARIES</h1>

          <p class="text-lg">
            ค้นพบความสุขในการทำอาหารด้วยเรา!
            ที่นี่คุณจะได้พบกับสูตรอาหารที่ยอดเยี่ยมและวิธีการทำอาหารที่ง่ายต่อการติดตาม
            ขอเสนอให้คุณสร้างประสบการณ์ทำอาหารที่สุดแสนสนุกและอร่อยที่สุดได้ที่นี่
          </p>
        </div>
        <p class="text-[40px] font-bold pb-2 text-green-700">สูตรอาหารของเรา</p>
      </div>
      <h1 class="text-[80px] text-center ml-82 pt-16">
        ยังไม่มีสูตรอาหารในขณะนี้
      </h1>
    </div>
    <div class="justify-start flex flex-wrap ml-96 pt-16" v-else>
      <div class="w-full flex">
        <div class="text mt-24 pb-16">
          <h1 class="text-6xl font-bold pb-4 text-green-600">Dish DIARIES</h1>

          <p class="text-lg w-96">
            ค้นพบความสุขในการทำอาหารด้วยเรา!
            ที่นี่คุณจะได้พบกับสูตรอาหารที่ยอดเยี่ยมและวิธีการทำอาหารที่ง่ายต่อการติดตาม
            ขอเสนอให้คุณสร้างประสบการณ์ทำอาหารที่สุดแสนสนุกและอร่อยที่สุดได้ที่นี่
          </p>
          <div>
            <router-link
              :to="{ name: 'Recipe' }"
              class="flex bg-black text-white shadow-lg overflow-hidden object-center transition duration-300 hover:scale-105 cursor-pointer w-[120px] rounded-lg mt-8 ml-auto"
            >
              <div class="p-4 relative items-center">เริ่มต้นใช้งาน</div>
            </router-link>
          </div>
        </div>

        <div class="mt-12 w-[600px] ml-28">
          <div class="grid grid-cols-3 gap-4">
            <router-link
              v-for="(item, index) in shuffledItems.slice(0, 9)"
              :key="item.id"
              :to="{ name: 'RecipeIns', params: { id: item.id } }"
            >
              <div
                class="flex flex-col items-center shadow-lg rounded-lg overflow-hidden object-center transition duration-300 hover:scale-105 cursor-pointer"
              >
                <div class="w-full h-48">
                  <img
                    class="w-full h-full object-cover"
                    v-bind:src="getImage(item.recipeImage)"
                  />
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="">
        <div class="py-8">
          <h1 class="text-2xl">รายการสินค้า</h1>
        </div>
        <div class="grid grid-cols-5 gap-4 border p-4 rounded-lg w-[1100px]">
          <div v-for="ingredient in ingredients" :key="ingredient.id">
            <div
              class="bg-white shadow-lg rounded-lg overflow-hidden object-center transition duration-300 hover:scale-105 cursor-pointer"
            >
              <div>
                <h3 class="text-center bg-black text-white bg-opacity-75 p-2">
                  {{ ingredient.ingredientName }}
                </h3>
              </div>
              <img
                class="w-full h-48 object-cover"
                :src="ingredient.ingredientImage"
                alt="Ingredient Image"
              />
              <div class="p-4">
                <div class="flex items-center justify-center gap-4">
                  <p
                    class="text-gray-500 border p-1 rounded-lg bg-black text-white"
                  >
                    1 ชิ้น : {{ ingredient.ingredientPricePerUnit }} บาท
                  </p>
                </div>
                <button
                  class="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-blue-700 w-full flex items-center gap-3"
                  @click="
                    addToCart(ingredient.ingredientId, ingredient.quantity)
                  "
                >
                  <svg
                    class="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>เพิ่มไปที่รถเข็น</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped>
.tooltip {
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
