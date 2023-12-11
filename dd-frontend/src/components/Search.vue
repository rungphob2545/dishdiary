<script>
export default {
  name: "Search",
};
</script>

<template>
  <!-- Search input -->
  <div class="relative">
    <input
      type="text"
      class="w-[500px] h-[45px] bg-gray-700 text-white p-4 rounded mr-[420px] pl-10"
      placeholder="Search..."
    />
    <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
      <i class="fas fa-search text-gray-400"></i>
    </span>
  </div>

  <!-- Content -->
</template>

<style scoped>
/* Add your additional styling here */
</style>
