<script setup>
import { ref, onBeforeMount } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

const ingredients = ref([]);

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

const addToCart = async (ingredientId, quantity) => {
  console.log(ingredientId, quantity);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/cart`,
      {
        ingredientId: ingredientId,

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
        toast: true,
        position: "top-right",
        title: "เพิ่มเข้ารถเข็นแล้ว",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    } else if (response.status === 200 && !response.data.success) {
      Swal.fire({
        icon: "warning",
        toast: true,
        position: "top-right",
        title: "อัพเดตตะกร้ารถเข็นแล้ว",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

onBeforeMount(() => {
  fetchIngredients();
});
</script>
<template>
  <div class="">
    <div class="pb-24">
      <Navbar />
    </div>
    <div class="justify-start flex-wrap ml-96">
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
                @click="addToCart(ingredient.ingredientId, 1)"
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
</template>
<style></style>
