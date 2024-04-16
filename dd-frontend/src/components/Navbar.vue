<script setup>
import Search from "./Search.vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();

const token = localStorage.getItem("token");

const clearData = () => {
  localStorage.removeItem("token");
  Swal.fire({
    icon: "info",
    title: "Logout สำเร็จ",
    confirmButtonText: "กลับสู่หน้าแรก",
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then((result) => {
    if (result.isConfirmed) {
      router.push("/account/login");
    }
  });
};
</script>
<template>
  <div class="">
    <nav
      class="bg-black p-4 fixed w-full justify-center flex items-center shadow-lg shadow-lime-900"
    >
      <div class="flex items-center h-8">
        <router-link to="/" class="flex">
          <div class="text-white mr-4">
            <svg
              class="h-8 w-8 text-white-500"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <div class="items-center font-bold text-2xl w-40 text-white">
            Dish DIARIES
          </div>
        </router-link>
        <Search />

        <div v-if="!token">
          <router-link
            to="/account/login"
            class="text-white hover:text-gray-200"
            >Login / Sign Up</router-link
          >
        </div>
        <div
          v-else
          class="bg-green-900 px-2 border rounded-lg text-white hover:bg-red-600 cursor-pointer h-12"
        >
          <button @click="clearData()">Logout</button>
        </div>
      </div>
    </nav>
    <!-- 
    <div class="flex">
      <nav class="bg-gray-800 h-screen p-4">
        <div class="flex flex-col space-y-4 w-72">
          <router-link to="/" class="text-white flex items-center">
            <svg
              class="h-8 w-8 text-white mr-2"
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
              <polyline points="5 12 3 12 12 3 21 12 19 12" />
              <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
              <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
            </svg>
            Home
          </router-link>
          <router-link
            :to="{ name: 'MyOrder', params: { id: 1 } }"
            class="text-white flex items-center"
          >
            <svg
              class="h-8 w-8 text-white mr-2"
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
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <line x1="9" y1="7" x2="15" y2="7" />
              <line x1="9" y1="11" x2="15" y2="11" />
              <line x1="9" y1="15" x2="13" y2="15" />
            </svg>
            My Order</router-link
          >
          <hr />
          <router-link
            :to="{ name: 'Admin' }"
            class="text-white flex items-center"
          >
            <svg
              class="h-8 w-8 text-white mr-2"
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
              <circle cx="12" cy="7" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            </svg>
            Admin</router-link
          >
        </div>
      </nav>
    </div> -->
  </div>
</template>

<style scoped>
.navbar-vertical {
  width: 120px;
}
</style>
