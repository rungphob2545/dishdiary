<script setup>
import { onBeforeMount, ref, computed } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import Swal from "sweetalert2";

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
      Swal.fire({
        icon: "danger",
        title: "นำออกจาก Cart สำเร็จ",
        toast: true,
        position: "top-right",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
      location.reload();
      console.log("deleted successfully");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const shippingAddress = ref("");
const paymentMethod = ref("เก็บเงินปลายทาง"); //Default value
const shippingAddressValid = ref(true);

const addOrderFromCart = async () => {
  shippingAddressValid.value = !!shippingAddress.value.trim();

  if (!shippingAddress.value.trim() || !paymentMethod.value.trim()) {
    Swal.fire({
      icon: "error",
      toast: true,
      text: "ตรวจสอบก่อนทำรายการอีกครั้ง",
      position: "top-right",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    return;
  }

  const orderData = {
    shippingAddress: shippingAddress.value.trim(),
    paymentMethod: paymentMethod.value.trim(),
    status: "Pending", // Change as necessary
    items: combinedItems.value.map((item) => ({
      ingredientId: item.ingredient.id,
      quantity: item.quantity,
      price: item.ingredient.ingredientPricePerUnit,
    })),
  };
  console.log("order: ", orderData);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/order`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "POST",
      }
    );
    if (response.status === 201) {
      alert("add success");
    }
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

const totalPrice = computed(() => {
  return combinedItems.value.reduce((total, item) => {
    return total + item.quantity * item.ingredient.ingredientPricePerUnit;
  }, 0);
});

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
  console.log("comb", combinedItems);
});
</script>

<template>
  <div class="h-screen">
    <div class="">
      <Navbar />
    </div>

    <div class="pt-28 ml-80">
      <h2 class="text-lg font-semibold mb-4">Your Cart</h2>

      <table class="w-[1200px]">
        <thead class="border">
          <tr class="">
            <th></th>
            <th class="text-left">Ingredient Name</th>
            <th class="text-center">Quantity</th>
            <th class="text-right">Price per Unit</th>
            <th class="text-right">Total Price</th>
            <th></th>
            <!-- Empty column for remove button -->
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in combinedItems"
            :key="item.cartItemId"
            class="border-b-2"
          >
            <td>
              <img
                :src="item.ingredient.ingredientImage"
                alt="Ingredient Image"
                class="w-16 h-16 rounded-full"
              />
            </td>
            <td>{{ item.ingredient.ingredientName }}</td>
            <td class="text-center">
              <!-- Increase and Decrease buttons -->
              <button @click="decreaseQuantity(item)" class="btn-quantity">
                -
              </button>
              <input
                type="text"
                v-model.number="item.quantity"
                class="input-quantity"
              />
              <button @click="increaseQuantity(item)" class="btn-quantity">
                +
              </button>
            </td>
            <td class="text-right">
              {{ item.ingredient.ingredientPricePerUnit }}
            </td>
            <td class="text-right">
              {{ item.quantity * item.ingredient.ingredientPricePerUnit }}
            </td>
            <td class="text-center">
              <!-- Remove button -->
              <span
                @click="removeFromCart(item.cartItemId)"
                class="btn-remove p-1 bg-red-500 border rounded-lg text-white"
                >นำออก</span
              >
            </td>
          </tr>
        </tbody>
      </table>

      <div class="w-[1200px] mt-8">
        <div class="mb-4">
          <label
            for="shippingAddress"
            class="block text-sm font-medium text-gray-700"
            >Shipping Address</label
          >
          <input
            v-model="shippingAddress"
            type="text"
            id="shippingAddress"
            :class="{
              'mt-1 p-2 border rounded w-full': true,
              'border-red-500': !shippingAddressValid,
            }"
          />
          <span v-if="!shippingAddressValid" class="text-red-500 text-sm"
            >Shipping Address is required</span
          >
        </div>

        <div class="mb-4">
          <label
            for="paymentMethod"
            class="block text-sm font-medium text-gray-700"
            >Payment Method</label
          >
          <select
            v-model="paymentMethod"
            id="paymentMethod"
            class="mt-1 p-2 border rounded w-full"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Paypal">Paypal</option>
            <option value="เก็บเงินปลายทาง">เก็บเงินปลายทาง</option>
          </select>
        </div>
      </div>
      <div>Total Price: {{ totalPrice }}</div>
      <div>
        <button @click="addOrderFromCart()">Add Order</button>
      </div>
    </div>
  </div>
</template>

<style></style>
