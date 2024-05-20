<script setup>
import { onBeforeMount, ref, computed } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const carts = ref([]);
const user = ref({});
const router = useRouter();

const fetchUser = async () => {
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
        icon: "success",
        title: "นำออกจาก Cart สำเร็จ",
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

const shippingAddress = ref("");
const paymentMethod = ref("เก็บเงินปลายทาง"); //Default value
const shippingAddressValid = ref(true);

const confirmOrder = () => {
  Swal.fire({
    title: "ยืนยันการสั่งซื้อ?",
    text: "คุณต้องการยืนยันการสั่งซื้อนี้หรือไม่?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then((result) => {
    if (result.isConfirmed) {
      addOrderFromCart();
    }
  });
};

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
      Swal.fire({
        icon: "success",
        title: "สั่งสินค้าเสร็จสิ้น",
        confirmButtonText: "ไปดู Order",
        showCancelButton: true,
        cancelButtonText: "กลับหน้าหลัก",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/account/order");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          router.push("/");
        }
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const combinedItems = computed(() => {
  if (!carts.value || !carts.value.cartItems) {
    return [];
  }
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

const increaseQuantity = (item) => {
  item.quantity++; // เพิ่มจำนวนส่วนประกอบของรายการนี้
};

const decreaseQuantity = (item) => {
  item.quantity--; // เพิ่มจำนวนส่วนประกอบของรายการนี้
};

onBeforeMount(() => {
  fetchCart();
  fetchUser();
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
      <div
        v-if="combinedItems.length < 1"
        class="flex flex-col w-[1200px] items-center"
      >
        <img src="src\assets\cart.png" class="h-96 w-96" />
        <span class="text-2xl">รถเข็นของคุณยังว่างอยู่ ? </span>
        <a href="/" class="text-xl text-blue-500 underline underline-offset-8"
          >ไปช็อปเลย !</a
        >
      </div>
      <div v-else>
        <table class="w-[1200px]">
          <thead class="border">
            <tr class="">
              <th></th>
              <th class="text-left">Ingredient Name</th>
              <th class="text-center">Quantity</th>
              <th class="text-right">Price per Unit</th>
              <th class="text-right">Total Price</th>
              <th></th>
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
                  type="number"
                  v-model.number="item.quantity"
                  class="input-quantity w-10 text-center no-spinners"
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
                <span
                  @click="removeFromCart(item.cartItemId)"
                  class="btn-remove p-1 bg-red-500 border rounded-lg text-white cursor-pointer hover:bg-red-700"
                  >นำออก</span
                >
              </td>
            </tr>
          </tbody>
        </table>

        <div class="w-[1200px]">
          <div class="mt-8 flex gap-8">
            <div class="mb-4">
              <label
                for="shippingAddress"
                class="block text-sm font-medium text-gray-700 mr-4"
                >Shipping Address</label
              >
              <input
                v-model="shippingAddress"
                type="text"
                id="shippingAddress"
                :class="{
                  'mt-1 p-2 border rounded w-[670px] block ': true,
                  'border-red-500': !shippingAddressValid,
                }"
              />
              <span v-if="!shippingAddressValid" class="text-red-500 text-sm"
                >Shipping Address is Required</span
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
            <div>
              <label
                for="paymentMethod"
                class="block text-sm font-medium text-gray-700 mb-3"
                >Total Price</label
              >
              <span class="">{{ totalPrice }}</span>
            </div>
            <div
              class="bg-green-600 text-white px-4 py-2 rounded mt-4 h-14 ml-24"
            >
              <button @click="confirmOrder()">Add Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* ซ่อนลูกศรขึ้นลงสำหรับ Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
