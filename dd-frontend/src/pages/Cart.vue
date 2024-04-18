<script setup>
import { onBeforeMount, ref, computed } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

const carts = ref([]);

const fetchCart = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/cart`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "GET",
      }
    );
    carts.value = response.data;
    console.log(carts.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const removeFromCart = async (id) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_API_URL}/api/cart/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "DELETE",
      }
    );
    if (response.status === 200) {
      location.reload();
      console.log("deleted successfully");
    } else console.log("error, cannot delete data");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const combinedItems = computed(() => {
  return carts.value.cartItems.map((item) => {
    const ingredient = carts.value.ingredients
      ? carts.value.ingredients.find(
          (ingredient) => ingredient.ingredientId === item.ingredientId
        )
      : null;
    return {
      ...item,
      ingredient,
    };
  });
});

// const cartItemsWithDetails = computed(() => {
//   const result = [];

//   carts.value.forEach((cartItems) => {
//     if (cartItems.ingredients) {
//       console.log("helol", cartItems);
//       const ingredient = cartItems.ingredients.find(
//         (ing) => ing.ingredientId === cartItem.ingredientId
//       );
//       if (ingredient) {
//         result.push({
//           cartItemId: cartItems.cartItemId,
//           ingredientId: ingredient.ingredientId,
//           ingredientName: ingredient.ingredientName,
//           ingredientImage: ingredient.ingredientImage,
//           ingredientPricePerUnit: ingredient.ingredientPricePerUnit,
//           quantity: cartsItem.quantity,
//           totalPrice: cartstem.quantity * ingredient.ingredientPricePerUnit,
//         });
//       }
//     }
//   });
//   console.log(result);
//   return result;
// });

const formatPrice = (ingredient) => {
  return `$${
    ingredient.ingredientPricePerUnit * ingredient.ingredientQuantity
  }`;
};

const calculatePrice = (item) => {
  ingredient.price =
    ingredient.ingredientPricePerUnit * ingredient.ingredientQuantity;
};

const increaseQuantity = (item) => {
  item.quantity++; // เพิ่มจำนวนส่วนประกอบของรายการนี้
};

const decreaseQuantity = (item) => {
  item.quantity--; // เพิ่มจำนวนส่วนประกอบของรายการนี้
};

onBeforeMount(() => {
  fetchCart();
  console.log("dd", combinedItems);
});
</script>

<template>
  <div class="h-screen">
    <div class="">
      <Navbar />
    </div>

    <div class="pt-28 ml-80">
      <h2 class="text-lg font-semibold mb-4">Your Cart</h2>

      <div
        v-for="item in combinedItems"
        :key="item.cartItemId"
        class="flex items-center mb-4 border p-4 w-[1200px]"
      >
        <!-- Image -->
        <img
          :src="item.ingredient.ingredientImage"
          alt="Ingredient Image"
          class="w-16 h-16 rounded-full mr-4"
        />

        <!-- Details -->
        <div class="flex">
          <div>{{ item.ingredient.ingredientName }}</div>
          <div>
            <!-- Increase and Decrease buttons -->
            <button
              @click="decreaseQuantity(item)"
              class="bg-gray-200 hover:bg-gray-300 px-2 rounded-l"
            >
              -
            </button>
            <input
              type="text"
              v-model.number="item.quantity"
              class="w-10 text-center"
            />
            <button
              @click="increaseQuantity(item)"
              class="bg-gray-200 hover:bg-gray-300 px-2 rounded-r"
            >
              +
            </button>
          </div>
          <div>
            Price per unit: {{ item.ingredient.ingredientPricePerUnit }}
          </div>
          <div>
            <!-- Remove button -->
            <span
              @click="removeFromCart(item.cartItemId)"
              class="text-red-500 hover:text-red-700 cursor-pointer"
            >
              ลบออกจากรถเข็น
            </span>
          </div>
          <div>
            Total Price:
            {{ item.quantity * item.ingredient.ingredientPricePerUnit }}
          </div>
        </div>
      </div>
      <div>Total Price:</div>
    </div>
  </div>
</template>

<style></style>
