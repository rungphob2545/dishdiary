<script setup>
import { ref } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();

const LocalStorage = (name, accessToken) => {
  localStorage.setItem(name, `${accessToken}`);
};

const login = async (userEmail, password) => {
  console.log(userEmail);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}` + "/api/login",
      {
        userEmail: userEmail,
        password: password,
      }
    );

    if (response.status === 201) {
      LocalStorage("email", `${userEmail}`);
      LocalStorage("token", response.data.token);
      Swal.fire({
        icon: "success",
        title: "Login สำเร็จ",
        confirmButtonText: "กลับสู่หน้าแรก",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/");
        }
      });
      console.log(response);
    } else {
      console.log("Error adding recipe");
      console.log(response);
    }
  } catch (error) {
    if (error.response.status === 400) {
      Swal.fire({
        icon: "error",
        title: `เกิดข้อผิดพลาดโปรดลองอีกครั้ง \n${error.response.data.message}`,
        confirmButtonText: "Ok",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      console.log(error.response);
    }
  }
};
</script>

<template>
  <div class="pb-24">
    <Navbar />
  </div>
  <div
    class="login-form bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4 max-w-xs mx-auto"
  >
    <div class="flex justify-between my-4">
      <div class="text-center text-xl font-semibold">Login</div>
      <div class="text-center text-xl font-semibold">
        <router-link to="/account/signup">Sign up</router-link>
      </div>
    </div>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username"
          >Email:</label
        >
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          v-model="userEmail"
          type="text"
          placeholder="Username"
          required
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password"
          >Password:</label
        >
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          v-model="password"
          type="password"
          placeholder="*********"
          required
        />
      </div>
    </form>
    <div class="flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
        @click="login(userEmail, password)"
      >
        Login
      </button>
    </div>
  </div>
</template>

<style scoped>
/* สไตล์แบบฟอร์ม */
</style>
