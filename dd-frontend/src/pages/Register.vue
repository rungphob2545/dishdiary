<script setup>
import { ref } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();

// const newUser = ref({});

const newUser = ref({});

const checkValid = ref(false);

const isLengthValid = () => {
  if (newUser.value.userName.length < 4) {
    checkValid.value = false;
  } else checkValid.value = true;
};

const isPasswordValid = () => {
  if (newUser.value.password.length < 8) {
    checkValid.value = false;
  } else checkValid.value = true;
};

const register = async (userName, userEmail, password) => {
  console.log(userName, userEmail, password);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}` + "/api/register",
      {
        userName: newUser.value.userName,
        userEmail: newUser.value.userEmail,
        password: newUser.value.password,
        role: "User",
      }
    );
    if (response.status === 201) {
      Swal.fire({
        icon: "success",
        title: "สร้า่ง Account สำเร็จ",
        confirmButtonText: "ไปยังหน้า Login",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/account/login");
        }
      });
    } else {
      console.log("Error adding recipe");
    }
  } catch (error) {
    if (error.response.status === 400) {
      Swal.fire({
        icon: "error",
        title: `มีบางอย่างผิดพลาดโปรดลองใหม่อีกครั้ง \nError: ${error.response.data.message}`,
        confirmButtonText: "Ok",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
    console.error("Error while register:", error);
    console.log(error.response);
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
      <div class="text-center text-xl font-semibold col-6">
        <router-link to="/account/login">Login</router-link>
      </div>
      <div class="text-center text-xl font-semibold col-6">Sign up</div>
    </div>
    <div class="text-xs pb-4 text-red-500">
      <ul>
        <li>● Username ต้องมีตัวอักษรระหว่าง 4 - 20 ตัวอักษร</li>
        <li>● Password ต้องมีตัวอักษรระหว่าง 8 - 16 ตัวอักษร</li>
      </ul>
    </div>
    <form @submit.prevent="register">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username"
          >Username:</label
        >
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          v-model="newUser.userName"
          type="text"
          placeholder="Username"
          required
          v-on:input="isLengthValid()"
          minlength="4"
          maxlength="20"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username"
          >User Email:</label
        >
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          v-model="newUser.userEmail"
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
          v-model="newUser.password"
          type="password"
          placeholder="*********"
          required
          v-on:input="isPasswordValid()"
          minlength="8"
          maxlength="16"
        />
      </div>
    </form>
    <div class="flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
        :disabled="!checkValid"
        :class="{ disabled: !checkValid }"
        @click="register(newUser.userName, newUser.userEmail, newUser.password)"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<style scoped>
/* สไตล์แบบฟอร์ม */
button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
