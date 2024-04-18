<script setup>
import Search from "./Search.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();
const isOpen = ref(false);
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

const toggleCart = () => {
  isOpen.value = !isOpen.value;
  console.log(isOpen.value);
};
</script>
<template>
  <div class="">
    <nav
      class="bg-black p-4 fixed w-full justify-center flex items-center shadow-md shadow-blue-900"
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
        <div class="flex gap-2">
          <router-link to="/account/profile">
            <svg
              class="h-8 w-8 text-white mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </router-link>

          <router-link to="/account/cart">
            <svg
              class="h-8 w-8 text-white mx-auto mr-4"
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
              <circle cx="9" cy="19" r="2" />
              <circle cx="17" cy="19" r="2" />
              <path d="M3 3h2l2 12a3 3 0 0 0 3 2h7a3 3 0 0 0 3 -2l1 -7h-15.2" />
            </svg>
          </router-link>
        </div>

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
  </div>
</template>

<style scoped>
.navbar-vertical {
  width: 120px;
}
</style>
