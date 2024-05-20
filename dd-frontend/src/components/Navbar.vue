<script setup>
import Search from "./Search.vue";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";

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

const cartItemCount = ref(0);
const carts = ref([]);

const fetchCartItemCount = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/cart`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    carts.value = response.data;
    cartItemCount.value = carts.value.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    console.log("count", cartItemCount.value);
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

const dropdownRef = ref(null);

const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const updateCartItemCount = () => {
  cartItemCount.value = carts.value.cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
};

onMounted(() => {
  if (checkToken()) {
    fetchCartItemCount();
  }
  window.addEventListener("click", handleClickOutside);
});

const checkToken = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

watch(
  carts,
  (newCarts) => {
    updateCartItemCount();
    console.log("new c", cartItemCount.value);
  },
  { deep: true }
);
</script>
<template>
  <div class="absolute z-50">
    <nav
      class="bg-black p-4 fixed w-full justify-center flex items-center shadow-md shadow-blue-900"
    >
      <div class="flex items-center h-8">
        <router-link to="/" class="flex">
          <div class="text-white mr-4">
            <img src="src\assets\logo.png" class="h-8 w-8 items-center" />
          </div>
          <div class="items-center font-bold text-2xl w-40 text-white">
            Dish DIARIES
          </div>
        </router-link>
        <Search />

        <div v-if="!token">
          <div
            class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-500 rounded-lg items-center cursor-pointer"
          >
            <router-link to="/account/login" class="flex items-center">
              <svg
                class="h-8 w-8 text-white bg-black rounded-full p-1 mr-2"
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
                <path
                  d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
                />
                <path d="M7 12h14l-3 -3m0 6l3 -3" />
              </svg>
              <span class="text-white">เข้าสู่ระบบ</span>
            </router-link>
          </div>
        </div>
        <div v-else>
          <div class="relative flex items-center">
            <button
              @click="toggleDropdown"
              class="text-white flex items-center focus:outline-none"
            >
              <svg
                class="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <transition name="fade">
              <div
                v-if="dropdownOpen"
                class="absolute right-0 w-36 mt-[250px] bg-white rounded-md shadow-lg py-1 z-20"
              >
                <router-link
                  v-if="token"
                  to="/account/cart"
                  class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center cursor-pointer"
                >
                  <svg
                    class="h-8 w-8 text-white bg-gray-800 rounded-full p-1 mr-2"
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
                    <path
                      d="M3 3h2l2 12a3 3 0 0 0 3 2h7a3 3 0 0 0 3 -2l1 -7h-15.2"
                    />
                  </svg>
                  <span>Cart</span>
                </router-link>
                <router-link
                  v-if="token"
                  to="/account/order"
                  class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center cursor-pointer"
                >
                  <svg
                    class="h-8 w-8 text-white bg-gray-800 rounded-full p-1 mr-2"
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
                  <span>Order</span>
                </router-link>
                <router-link
                  v-if="token"
                  to="/account/profile"
                  class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center cursor-pointer"
                >
                  <svg
                    class="h-8 w-8 text-white bg-gray-800 rounded-full p-1 mr-2"
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
                  <span>Profile</span>
                </router-link>
                <div
                  v-if="token"
                  class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center cursor-pointer"
                  @click="clearData"
                >
                  <svg
                    class="h-8 w-8 text-white bg-gray-800 rounded-full p-1 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <span>Logout</span>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.navbar-vertical {
  width: 120px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
