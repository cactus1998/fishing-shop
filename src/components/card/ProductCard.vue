<template>
  <div
    class="w-80 sm:w-96 md:w-full lg:w-full rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
  >
    <!-- 上方圖片 -->
    <div class="h-80">
      <template v-if="images.length > 0">
        <swiper
          :modules="[Autoplay, Pagination]"
          :grabCursor="true"
          :loop="true"
          :autoplay="{ delay: 4500, disableOnInteraction: false }"
          :pagination="true"
          effect="cube"
          :cubeEffect="{
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
          }"
          class="h-full"
        >
          <swiper-slide v-for="(image, index) in images" :key="index">
            <img :src="image" class="swiper-image" />
          </swiper-slide>
        </swiper>
      </template>
      <template v-else>
        <el-empty
          description="暫無圖片"
          class="h-full flex items-center justify-center"
        />
      </template>
    </div>

    <!-- 下方商品資訊 -->
    <div class="p-4 text-gray-800">
      <h2 class="text-lg font-semibold">{{ product.name }}</h2>
      <p class="mt-1">
        <span class="text-red-600 font-bold">NT$ {{ discountedPrice }}</span>
        <span
          v-if="product.discount"
          class="text-gray-400 ml-2 line-through text-sm"
        >
          NT$ {{ product.price }}
        </span>
      </p>

      <!-- 加入購物車（點擊後開 Dialog） -->
      <button
        @click="openDialog"
        class="mt-4 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition w-full"
      >
        加入購物車
      </button>
    </div>
  </div>

  <!-- 選擇數量的 Dialog -->
  <!-- 選擇數量的 Dialog -->
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    width="90%"
    :style="{ maxWidth: '900px' }"
    class="product-dialog"
  >
    <!-- Header -->
    <template #header>
      <div class="flex justify-between items-center pb-4 border-b border-gray-100">
        <h3 class="text-xl font-bold text-gray-900">商品詳情</h3>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
          @click="dialogVisible = false"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </template>

    <!-- Body: 左圖 / 右資訊 -->
    <div class="flex flex-col lg:flex-row gap-8 pt-2">
      <!-- 左：大圖 + 縮圖 -->
      <div class="flex-shrink-0 flex flex-col items-center lg:items-start w-full lg:w-auto">
        <div
          class="w-full lg:w-96 aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg flex items-center justify-center"
        >
          <template v-if="selectedImage">
            <img
              :src="selectedImage"
              alt="product image"
              class="w-full h-full object-contain"
            />
          </template>
          <template v-else>
            <el-empty description="暫無圖片" />
          </template>
        </div>

        <!-- 縮圖列 -->
        <div
          class="flex items-center gap-3 pt-4 pl-1 overflow-x-auto w-full lg:w-96 pb-3 thumbnail-scroll"
        >
          <template v-for="(img, idx) in images" :key="idx">
            <button
              @click="selectThumb(img)"
              type="button"
              class="w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0"
              :class="selectedImage === img 
                ? 'ring-2 ring-red-500 border-red-500 shadow-md scale-105' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </template>
        </div>
      </div>

      <!-- 右：商品資訊、說明、數量、小計 -->
      <div class="flex-1 flex flex-col justify-between">
        <div class="space-y-5">
          <div>
            <h4 class="text-2xl font-bold text-gray-900 mb-3">{{ product.name }}</h4>
            <div class="flex items-baseline gap-3 mb-4">
              <span class="text-3xl font-bold text-red-600">NT$ {{ discountedPrice }}</span>
              <span v-if="product.discount" class="text-lg text-gray-400 line-through"
                >NT$ {{ product.price }}</span
              >
              <span v-if="product.discount" class="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
                -{{ product.discount }}%
              </span>
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-sm text-gray-700 leading-relaxed">
              {{ product.msg }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600">
              📦 {{ product.accessories1 }}
            </span>
            <span class="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600">
              🔥 {{ product.accessories2 }}
            </span>
          </div>
        </div>

        <!-- 下方:數量控制 + 小計 -->
        <div class="mt-8 space-y-6">
          <div class="bg-white border border-gray-200 rounded-2xl p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-700">購買數量</span>
              <div class="flex items-center gap-4">
                <button
                  @click="decreaseQuantity"
                  class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition text-xl font-medium text-gray-600"
                >
                  −
                </button>

                <div class="text-xl font-bold w-12 text-center text-gray-900">{{ quantity }}</div>

                <button
                  @click="increaseQuantity"
                  class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition text-xl font-medium text-gray-600"
                >
                  +
                </button>
              </div>
            </div>
            
            <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span class="text-sm text-gray-600">小計</span>
              <span class="text-2xl font-bold text-red-600">NT$ {{ discountedPrice * quantity }}</span>
            </div>
          </div>

          <!-- Footer Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              class="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              @click="dialogVisible = false"
            >
              取消
            </button>
            <button
              class="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 transition"
              @click="confirmAddToCart"
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed ,watch  } from "vue";
import { useCartStore } from "@/stores/cart";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-cube";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const cartStore = useCartStore();

// 狀態
const quantity = ref(1);
const dialogVisible = ref(false);

// 開啟 Dialog
const openDialog = () => {
  quantity.value = 1; // 重置數量
  dialogVisible.value = true;
};

// 新增：目前 Dialog 顯示的大圖（可被縮圖切換）
const selectedImage = ref(null);

// 當 Dialog 打開時，把第一張圖設為預設大圖
watch(
  () => dialogVisible.value,
  (open) => {
    if (open) {
      selectedImage.value = (images.value && images.value.length > 0) ? images.value[0] : null;
    }
  }
);

// 點擊縮圖切換
const selectThumb = (img) => {
  selectedImage.value = img;
};

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// 計算圖片陣列
const images = computed(() =>
  Object.keys(props.product)
    .filter((key) => key.startsWith("image"))
    .map((key) => props.product[key])
);

// 折扣後價格
const discountedPrice = computed(() =>
  props.product.discount
    ? Math.round(props.product.price * (1 - props.product.discount / 100))
    : props.product.price
);

// 確認加入購物車
const confirmAddToCart = () => {
  cartStore.addToCart({ ...props.product, quantity: quantity.value });
  dialogVisible.value = false;
};
</script>

<style scoped>
.swiper-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
