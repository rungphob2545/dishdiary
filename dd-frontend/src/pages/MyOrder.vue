<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import moment from "moment";

const items = ref([]);

const fetchData = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_PRODUCT_API_URL}` + "/api/order/" + `${id}`
    );
    items.value = response.data;
    console.log(items.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
onMounted(() => {
  const route = useRoute();
  const id = route.params.id;
  console.log(id);
  fetchData(id);
});
</script>

<template>
  <div class="">
    <div>
      <Navbar />
    </div>
    <div class="mt-[-900px] ml-96 justify-start flex-wrap">
      <h1 class="text-lg mb-4">รายการของฉัน</h1>
      <ul v-for="item in items" :key="item.id" class="px-5 pb-10">
        <li>หมายเลข Product : {{ item.ingredientId }}</li>
        <li>ปริมาณ : {{ item.quantity }}</li>
        <li>ราคาต่อหนึ่งชิ้น : {{ item.unitPrice }}</li>
        <li>
          วันที่ทำรายการ : {{ moment(item.orderDate).format("MMMM Do YYYY") }}
        </li>
        <li>ที่อยู่จัดส่ง : {{ item.shippingAddress }}</li>
        <li>จัดส่งด้วย : {{ item.shippingMethod }}</li>
        <li>ชำระเงินด้วย : {{ item.paymentMethod }}</li>
        <li>ราคารวมทั้งสิ้น : {{ item.totalPrice }}</li>
      </ul>
    </div>
  </div>

  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped></style>
