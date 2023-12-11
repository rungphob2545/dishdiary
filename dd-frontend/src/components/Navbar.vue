<script>
import Search from "./Search.vue";
import { useRouter } from "vue-router";

const appRouter = useRouter();

export default {
  name: "Navbar",
  components: { Search },
};
</script>
<template>
  <div>
    <nav class="bg-gray-800 p-4">
      <div class="flex items-center justify-between">
        <div class="text-white">Dish Diaries</div>
        <Search />
        <div class="flex space-x-4">
          <router-link to="/" class="text-white">My Account</router-link>
        </div>
      </div>
    </nav>

    <div class="flex">
      <nav class="bg-gray-800 p-4">
        <div class="flex flex-col space-y-4 h-screen w-32">
          <router-link to="/" class="text-white">Home</router-link>
          <router-link
            :to="{ name: 'MyOrder', params: { id: 1 } }"
            class="text-white"
            >My Order</router-link
          >
          <router-link :to="{ name: 'Admin' }" class="text-white"
            >Admin</router-link
          >
        </div>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.navbar-vertical {
  width: 120px;
}
</style>
