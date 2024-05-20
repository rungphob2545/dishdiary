<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import dayjs from "dayjs";
import "dayjs/locale/th";

const orders = ref([]);
const ingredients = ref([]);

const fetchData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}` + "/api/order",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "GET",
      }
    );
    orders.value = response.data;
    console.log(orders.value);
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

const selectedOrder = ref(null);

const showOrderDetails = (order) => {
  selectedOrder.value = order;
};

const closePopup = () => {
  selectedOrder.value = null;
};

const combinedItems = computed(() => {
  if (!orders.value.orders || !orders.value.orderItems || !ingredients.value) {
    return [];
  }

  return orders.value.orders.map((order) => {
    const items = orders.value.orderItems
      .filter((orderItem) => orderItem.orderId === order.id)
      .map((orderItem) => {
        const ingredient = ingredients.value.find(
          (ingredient) => ingredient.id === orderItem.ingredientId
        );
        return {
          ...orderItem,
          ingredientName: ingredient ? ingredient.ingredientName : "Unknown",
        };
      });

    return {
      ...order,
      items,
    };
  });
});

const formatDate = (date) => {
  return dayjs(date).locale("th").format("D MMMM YYYY HH:mm");
};

onMounted(() => {
  fetchData();
  fetchIngredients();
  console.log("comb", combinedItems);
});
</script>

<template>
  <div class="">
    <div>
      <Navbar />
    </div>
  </div>
  <div class="pt-28 ml-80">
    <h2 class="text-lg font-semibold mb-4">Customer Orders</h2>

    <div
      v-if="combinedItems.length < 1"
      class="flex flex-col w-[1200px] items-center"
    >
      <img src="src\assets\logo.png" class="h-96 w-96" />
      <span class="text-2xl">คุณยังไม่มีการทำรายการในขณะนี้</span>
      <a href="/" class="text-xl text-blue-500 underline underline-offset-8"
        >กลับสู่หน้าแรก
      </a>
    </div>
    <div v-else>
      <table class="w-[1200px] border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="border px-4 py-2 w-36">Order Number</th>
            <th class="border px-4 py-2">วันที่ทำการสั่งซื้อวัตถุดิบ</th>
            <th class="border px-4 py-2">สถานะสินค้า</th>
            <th class="border px-4 py-2">วิธีการชำระเงิน</th>
            <th class="border px-4 py-2">ราคารวม</th>
            <th class="border py-2">รายละเอียด</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in combinedItems"
            :key="order.id"
            class="hover:bg-gray-100"
          >
            <td class="border px-4 py-2 text-center">{{ order.id }}</td>
            <td class="border px-4 py-2 w-1/4 text-center">
              {{ formatDate(order.orderDate) }}
            </td>
            <td class="border px-4 py-2 text-center">{{ order.status }}</td>
            <td class="border px-4 py-2 text-center">
              {{ order.paymentMethod }}
            </td>
            <td class="border px-4 py-2 text-center">{{ order.totalPrice }}</td>
            <td class="border px-4 py-2 text-center">
              <button
                @click="showOrderDetails(order)"
                class="bg-blue-500 text-white px-2 py-1 rounded"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="selectedOrder"
        class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div class="bg-white p-6 rounded shadow-lg w-[400px]">
          <div class="flex justify-between">
            <h3 class="text-lg font-semibold mb-4">Order Details</h3>
            <svg
              @click="closePopup"
              xmlns="http://www.w3.org/2000/svg"
              class="w-7 h-7 text-black cursor-pointer"
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
          <div class="mb-4">
            <div class="flex">
              <span class="font-semibold mr-2">วิธีการชำระเงิน:</span>
              <span>{{ selectedOrder.paymentMethod }}</span>
            </div>
            <div class="">
              <span class="font-semibold mr-2">ที่อยู่ในการจัดส่ง:</span>
              <span>{{ selectedOrder.shippingAddress }}</span>
            </div>
            <div class="">
              <span class="font-semibold mr-2">ราคารวม:</span>
              <span>{{ selectedOrder.totalPrice }}</span>
            </div>
            <div class="">
              <span class="font-semibold mr-2">วันที่ทำรายการ:</span>
              <span>{{ formatDate(selectedOrder.orderDate) }}</span>
            </div>
          </div>
          <table>
            <thead class="">
              <tr class="">
                <th class="">ชื่อสินค้า</th>
                <th class="">จำนวน</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedOrder.items" :key="item.itemId">
                <td>{{ item.ingredientName }}</td>
                <td>x{{ item.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
