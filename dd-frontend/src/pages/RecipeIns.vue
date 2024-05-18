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
const favorites = ref([]);
const errors = ref(null);

const getCategoryImage = (id) => `/kp2/src/assets/icon/category_${id}.png`;

const fetchData = async (id) => {
  console.log(id);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}` + "/api/recipe/" + `${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
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

const fetchFavoritesById = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/favorite/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "GET",
      }
    );

    favorites.value = response.data;
    console.log("favorite", favorites.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const addToFavorites = async (recipeId, userId) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/favorite`,
      {
        recipeId: recipeId,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 201) {
      Swal.fire({
        icon: "success",
        title: "นำเข้า Favorite สำเร็จ",
        confirmButtonText: "ตกลง",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    }
  } catch (error) {
    console.error("Error adding recipe:", error);
    errors.value = error;
    console.log(errors);
  }
};

const removeFavorites = async (recipeId, userId) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_API_URL}/api/favorite`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          recipeId: recipeId,
          userId: userId,
        },
      }
    );
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "นำออกจาก Favorite สำเร็จ",
        confirmButtonText: "ตกลง",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    }
  } catch (error) {
    console.error("Error adding recipe:", error);
    errors.value = error;
    console.log(errors);
  }
};

const combinedItems = computed(() => {
  return items.value.map((item) => {
    const favorite = favorites.value.recipes
      ? favorites.value.recipes.find((recipe) => recipe.id === item.id)
      : null;
    return {
      ...item,
      favorite,
    };
  });
});

watch(
  () => route.params.id,
  (newValue, oldValue) => {
    fetchData(newValue);
  }
);

onMounted(() => {
  fetchData(id.value);
  fetchFavoritesById(id.value);
  console.log("com", combinedItems);
  console.log("fav", favorites);
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

const convertTypeToThai = (type) => {
  switch (type) {
    case "Rice":
      return "ข้าว";
    case "Soup":
      return "ซุป";
    case "Noodle":
      return "เส้น";
    case "Salad":
      return "สลัด";

    default:
      return "หมวดหมู่อื่นๆ";
  }
};

const convertTimeToThai = (t) => {
  switch (t) {
    case "Quick":
      return "ค่อนข้างเร็ว";
    case "Moderate":
      return "ปานกลาง";
    case "Time-Consuming":
      return "ค่อนข้างใช้เวลาทำ";
    case "Time-intensive":
      return "ใช้เวลาทำนาน";

    default:
      return "ไม่ทราบ";
  }
};

const convertDiffToThai = (d) => {
  switch (d) {
    case "Easy":
      return "ง่าย";
    case "Normal":
      return "ปานกลาง";
    case "Difficulty":
      return "ค่อนข้างยาก";

    default:
      return "ไม่ทราบ";
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
      <div class="flex mt-8">
        <div>
          <img
            class="block mx-auto w-[500px] h-[450px] rounded-lg ml-96 border-blue-400 border"
            v-bind:src="`http://localhost:8080/${items.recipeImage}`"
          />
        </div>
        <div class="">
          <div class="flex justify-center gap-8">
            <div
              class="flex items-center border rounded-lg p-2 bg-white border-blue-400"
            >
              <span class="mr-3">ประเภทของเนื้อสัตว์</span>

              <img
                :src="getCategoryImage(items.categoryId)"
                class="w-12 h-12"
              />
            </div>
            <div
              class="flex items-center border rounded-lg p-2 bg-white border-blue-400"
            >
              <span class="mr-3">ประเภทของอาหาร</span>
              <span class="mr-3 underline underline-offset-8">{{
                convertTypeToThai(items.type)
              }}</span>
            </div>
          </div>

          <div>
            <p
              class="ml-8 my-4 w-[800px] text-center mx-auto border p-4 border-blue-400 rounded-lg bg-white border-blue-400"
            >
              {{ items.introduce }}
            </p>
          </div>
          <div class="flex gap-4 justify-center">
            <div
              class="flex items-center border rounded-lg p-2 bg-white border-blue-400"
            >
              <img src="src\assets\icon\star.png" class="w-12 h-12" />
              <span class="absolute ml-2 p-1">{{ items.rating }}</span>
            </div>

            <div
              class="flex items-center border rounded-lg p-2 bg-white border-blue-400"
            >
              <span class="mr-3">ระดับความยากในการทำอาหาร</span>
              <span class="mr-3">{{
                convertDiffToThai(items.difficulty)
              }}</span>
            </div>
            <div
              class="flex items-center border rounded-lg p-2 bg-white border-blue-400"
            >
              <span class="mr-3">ระยะเวลาที่ใช้โดยประมาณ</span>
              <span class="mr-3">{{ items.timeBased }}</span>
            </div>
          </div>
          <div class="flex justify-center">
            <div
              class="flex items-center w-[150px] border border-blue-400 bg-white rounded-lg my-4"
            >
              <button
                class="flex p-2 items-center hover:bg-gray-200"
                @click="share"
              >
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
            <div class="flex items-center">
              <div>
                <button
                  v-if="favorites"
                  class="m-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-200 focus:outline-none"
                  @click="removeFavorites(items.id)"
                >
                  <img src="src\assets\icon\heart.png" class="w-7 h-7" />
                </button>
                <button
                  v-else
                  class="m-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-200 focus:outline-none"
                  @click="addToFavorites(items.id)"
                >
                  <svg
                    class="h-8 w-8 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-start mb-4">
        <div class="w-1/2 top-0">
          <h1 class="text-[30px] text-orange-500 mb-4">ส่วนผสมในการทำอาหาร</h1>
          <div
            class="formatted-text mb-4 w-[400px] text-center mx-auto border p-4 border-blue-400 rounded-lg bg-white"
          >
            <table>
              <thead>
                <tr class="">
                  <th class="border border-gray-300 px-14 py-2">
                    ชื่อวัตถุดิบ
                  </th>
                  <th class="border border-gray-300 px-14 py-2">ปริมาณ</th>
                </tr>
              </thead>
              <tbody class="">
                <tr
                  class="border-b border-gray-300"
                  v-if="items.ingredients1 != null"
                >
                  <td class="text-left">{{ items.ingredients1 }}</td>
                  <td>{{ items.measure1 }}</td>
                </tr>
                <tr
                  class="border-b border-gray-300"
                  v-if="items.ingredients2 != null"
                >
                  <td class="text-left">{{ items.ingredients2 }}</td>
                  <td>{{ items.measure2 }}</td>
                </tr>
                <tr
                  class="border-b border-gray-300"
                  v-if="items.ingredients3 != null"
                >
                  <td class="text-left">{{ items.ingredients3 }}</td>
                  <td>{{ items.measure3 }}</td>
                </tr>
                <tr
                  class="border-b border-gray-300"
                  v-if="items.ingredients4 != null"
                >
                  <td class="text-left">{{ items.ingredients4 }}</td>
                  <td>{{ items.measure4 }}</td>
                </tr>
                <tr
                  class="border-b border-gray-300"
                  v-if="items.ingredients5 != null"
                >
                  <td class="text-left">{{ items.ingredients5 }}</td>
                  <td>{{ items.measure5 }}</td>
                </tr>
                <tr
                  class="border-b border-gray-300"
                  v-if="items.ingredients6 != null"
                >
                  <td class="text-left">{{ items.ingredients6 }}</td>
                  <td>{{ items.measure6 }}</td>
                </tr>
                <tr
                  class="border-b border-gray-300"
                  v-if="items.ingredients7 != null"
                >
                  <td class="text-left">{{ items.ingredients7 }}</td>
                  <td>{{ items.measure7 }}</td>
                </tr>
                <tr
                  class="border-b border-gray-300"
                  v-if="items.ingredients8 != null"
                >
                  <td class="text-left">{{ items.ingredients8 }}</td>
                  <td>{{ items.measure8 }}</td>
                </tr>
                <tr
                  class="border-b border-gray-300"
                  v-if="items.ingredients9 != null"
                >
                  <td class="text-left">{{ items.ingredients9 }}</td>
                  <td>{{ items.measure9 }}</td>
                </tr>
                <tr
                  class="border-b border-gray-300"
                  v-if="items.ingredients10 != null"
                >
                  <td class="text-left">{{ items.ingredients10 }}</td>
                  <td>{{ items.measure10 }}</td>
                </tr>
                <tr
                  class="border-b border-gray-300"
                  v-if="items.ingredients11 != null"
                >
                  <td class="text-left">{{ items.ingredients11 }}</td>
                  <td>{{ items.measure11 }}</td>
                </tr>
                <tr
                  class="border-b border-gray-300"
                  v-if="items.ingredients12 != null"
                >
                  <td class="text-left">{{ items.ingredients12 }}</td>
                  <td>{{ items.measure12 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- <div class="flex justify-center items-center gap-4">
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
          </div> -->
        </div>
        <div class="w-1/2">
          <h1 class="text-[30px] text-orange-500 mb-4">ขั้นตอนการทำอาหาร</h1>
          <p
            class="formatted-text mb-4 w-[800px] text-center mx-auto border p-4 border-blue-400 rounded-lg bg-white"
          >
            {{ formatCookingSteps(items.cookingSteps) }}
          </p>
        </div>
      </div>
      <div
        class="mt-8 mb-8 w-[400px] text-center mx-auto border p-4 border-blue-400 rounded-lg text-orange-500 text-[30px] bg-white"
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
        <div>
          <button class="text-white" @click="pauseVideo()">Pause</button>
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
