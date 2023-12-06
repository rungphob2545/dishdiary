<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([]);

const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/recipe');
        items.value = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(() => {
      fetchData();
    });

</script>

<template>
   <div class="">
    <ul>
      <li v-for="item in items" :key="item.id">{{ item }}</li>
      
    </ul>
  </div>
  <div class="text-4xl italic text-black">hello tail</div>
</template>

<style scoped>

</style>
