<script setup>
import { ref, onMounted, computed, watchEffect, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import Swal from "sweetalert2";
import Footer from "../components/Footer.vue";

const items = ref({});
const itemline = ref([]);
const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);

const getCategoryImage = (id) => `/kp2/src/assets/icon/category_${id}.png`;

const fetchData = async (id) => {
  console.log(id);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}` + "/api/recipe/" + `${id}`
    );
    if (response.status === 404) {
      alert("Not found this recipe id");
      router.push("/");
    } else if (response.status === 200) {
      items.value = response.data;
      console.log(response.data);
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ไม่พบหน้านี้",
      text: "ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา",
      confirmButtonText: "กลับสู่หน้าแรก",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/");
      }
    });
    console.error("Error fetching data:", error);
  }
};

watch(
  () => route.params.id,
  (newValue, oldValue) => {
    fetchData(newValue);
  }
);

onMounted(() => {
  fetchData(id.value);
});

const formatCookingSteps = (steps) => {
  return steps ? steps.replace(/\\n/g, "\n") : "";
};

const convertCategoryIdToString = (categoryId) => {
  switch (categoryId) {
    case 1:
      return "ไข่";
    case 2:
      return "เนื้อวัว";
    case 3:
      return "เนื้อไก่";
    case 4:
      return "เนื้อหมู";

    default:
      return "หมวดหมู่อื่นๆ";
  }
};

const share = async () => {
  const id = ref(route.params.id);
  console.log(id.value);
  try {
    const data = {
      title: "แชร์สูตรอาหารนี้",
      text: "มาลองดูสูตรอาหาร ที่น่าอร่อยและทำง่ายนี้สิ",
      url: `https://capstone23.sit.kmutt.ac.th/kp2/#/recipe/${id.value}`,
    };
    await navigator.share(data);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการแชร์:", error);
  }
};

//Video pause/play func
const videoRef = ref(null);
const isPlaying = ref(false);

//toggle func
const toggleVideo = () => {
  const iframe = videoRef.value;
  const player = iframe.contentWindow;

  if (isPlaying.value) {
    player.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "*"
    );
  } else {
    player.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
  }

  isPlaying.value = !isPlaying.value; // สลับสถานะการเล่นวิดีโอ
};

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
if (window.SpeechRecognition) {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "th-TH";
  // recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onstart = function () {
    console.log(
      "Voice recognition activated. Try speaking into the microphone."
    );
  };

  recognition.onresult = function (event) {
    for (let i = 0; i < event.results.length; i++) {
      const command = event.results[i][0].transcript.toLowerCase();

      console.log("Command:", command);

      if (
        command.includes("play") ||
        command.includes("start") ||
        command.includes("เล่น") ||
        command.includes("เริ่ม")
      ) {
        toggleVideo();
      } else if (
        command.includes("pause") ||
        command.includes("stop") ||
        command.includes("หยุด") ||
        command.includes("พัก")
      ) {
        toggleVideo();
      }
    }
  };

  recognition.onerror = function (event) {
    console.error("Error occurred in recognition:", event.error);
  };

  recognition.start();
} else {
  console.error("Speech recognition is not supported by this browser.");
}

//nomal func
const pauseVideo = () => {
  const iframe = videoRef.value;
  const player = iframe.contentWindow;
  player.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
};

const playVideo = () => {
  const iframe = videoRef.value;
  const player = iframe.contentWindow;
  player.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
};
</script>

<template>
  <div class="">
    <div>
      <Navbar />
    </div>
    <div class="w-screen mx-auto text-center pt-16">
      <p class="text-[50px] text-orange-500">{{ items.recipeName }}</p>
      <div
        class="flex justify-end items-center w-[150px] border border-green-500 bg-white absolute right-0"
      >
        <button class="flex p-2 items-center hover:bg-gray-200" @click="share">
          <p class="mr-1">แชร์สูตรอาหารนี้</p>
          <svg
            class="h-5 w-5 text-blue-500"
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
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="18" cy="18" r="3" />
            <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
            <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
          </svg>
        </button>
      </div>
      <div
        class="flex justify-center items-center mb-3 mt-8 mb-8 w-[300px] mx-auto border p-4 border-green-500 rounded-lg bg-white"
      >
        <span class="mr-3">ประเภทของอาหาร</span>

        <img :src="getCategoryImage(items.categoryId)" class="w-12 h-12" />
      </div>
      <p class="text-center">
        <img
          class="block mx-auto w-[700px] h-[500px] rounded-lg"
          v-bind:src="`http://localhost:8080/${items.recipeImage}`"
        />
      </p>
      <p
        class="mt-4 mb-8 w-[800px] text-center mx-auto border p-4 border-green-500 rounded-lg bg-white"
      >
        {{ items.introduce }}
      </p>
      <div class="flex justify-center items-start mb-4">
        <div class="w-1/2 top-0">
          <h1 class="text-[30px] text-orange-500 mb-4">ส่วนผสมในการทำอาหาร</h1>
          <p
            class="formatted-text mb-4 w-[400px] text-center mx-auto border p-4 border-green-500 rounded-lg bg-white"
          >
            {{ formatCookingSteps(items.cookingIngredients) }}
          </p>
          <div class="flex justify-center items-center gap-4">
            <a
              href="https://www.makro.pro"
              class="flex items-center text-blue-600 hover:text-blue-300"
              ><img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvC5aMirnc2SwuFRo_WhMMuGufCXGy-_5U_0WHXtXgKg&s"
                class="h-12 w-12 rounded-full border border-green-500 mr-2"
              />ไปยังร้านค้า</a
            >
            <a
              href="https://www.bigc.co.th"
              class="flex items-center text-blue-600 hover:text-blue-300"
              ><img
                src="https://pbs.twimg.com/profile_images/1755503520978190336/l-xQuywB_400x400.jpg"
                class="h-12 w-12 rounded-full border border-red-500 mr-2"
              />ไปยังร้านค้า</a
            >
            <a
              href="https://www.lotuss.com"
              class="flex items-center text-blue-600 hover:text-blue-300"
              ><img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/BigCLogo2022.svg/1200px-BigCLogo2022.svg.png"
                class="h-12 w-12 rounded-full border border-green-500 mr-2"
              />ไปยังร้านค้า
            </a>
          </div>
        </div>
        <div class="w-1/2">
          <h1 class="text-[30px] text-orange-500 mb-4">ขั้นตอนการทำอาหาร</h1>
          <p
            class="formatted-text mb-4 w-[800px] text-center mx-auto border p-4 border-green-500 rounded-lg bg-white"
          >
            {{ formatCookingSteps(items.cookingSteps) }}
          </p>
        </div>
      </div>
      <div
        class="mt-8 mb-8 w-[400px] text-center mx-auto border p-4 border-green-500 rounded-lg text-orange-500 text-[30px] bg-white"
      >
        <h1>วิดิโอสอนทำ</h1>
        <h1>{{ items.recipeName }}</h1>
      </div>
      <div
        class="flex justify-center items-center mb-12 w-[660px] text-center mx-auto border p-4 border-black rounded-lg bg-black"
      >
        <iframe
          ref="videoRef"
          v-if="items.video !== null"
          width="660"
          height="400"
          :src="items.video + `?enablejsapi=1`"
          frameborder="0"
          allowfullscreen
        ></iframe>
        <div v-else>
          <p class="text-white text-2xl">ขออภัย Video ไม่พร้อมในขณะนี้</p>
        </div>
      </div>
      <div>
        <button @click="pauseVideo">Pause</button>
      </div>
      <div>
        <button @click="playVideo">Play</button>
      </div>
      <div>
        <button @click="toggleVideo">{{ isPlaying ? "Pause" : "Play" }}</button>
      </div>
    </div>
    <Footer />
  </div>

  <!-- Brand name on the left -->

  <!-- Navigation bar at the bottom -->
</template>

<style scoped>
.formatted-text {
  white-space: pre-wrap;
}

.flex-newline {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* ระยะห่างระหว่างแท็ก a */
}

.flex-newline a {
  display: block;
}
</style>
