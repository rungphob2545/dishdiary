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

    <table class="w-[1200px] table-auto border-collapse">
      <thead>
        <tr class="bg-gray-200">
          <th class="border px-4 py-2">Order Number</th>
          <th class="border px-4 py-2">Order Date</th>
          <th class="border px-4 py-2">Status</th>
          <th class="border px-4 py-2">Total Price</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in combinedItems"
          :key="order.id"
          class="hover:bg-gray-100"
        >
          <td class="border px-4 py-2">{{ order.id }}</td>
          <td class="border px-4 py-2">{{ formatDate(order.orderDate) }}</td>
          <td class="border px-4 py-2">{{ order.status }}</td>
          <td
            class="border px-4 py-2"
            v-for="item in combinedItems.items"
            :key="item.itemId"
          >
            {{ item.ingredientName }}d555
          </td>
          <td class="border px-4 py-2">{{ order.totalPrice }}</td>
          <td class="border px-4 py-2">
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
      <div class="bg-white p-6 rounded shadow-lg w-[800px]">
        <h3 class="text-lg font-semibold mb-4">Order Details</h3>
        <button @click="closePopup" class="float-right mb-2">Close</button>
        <table>
          <thead class="">
            <tr>
              <th class="">ชื่อสินค้า</th>
              <th class="">จำนวน</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectedOrder.items" :key="item.itemId">
              <td>{{ item.ingredientName }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
