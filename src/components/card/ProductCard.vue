<template>
  <div class="w-80 sm:w-96 md:w-full lg:w-full rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
    <!-- 上方圖片（輪播，高度 h-80） -->
    <swiper
      :modules="[Autoplay, Pagination]"
      :grabCursor="true"
      :loop="true"
      :autoplay="{ delay: 4500, disableOnInteraction: false }"
      :pagination="true"
      effect="cube"
      :cubeEffect="{ shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 }"
      class="h-80"
    >
      <swiper-slide v-for="(image, index) in images" :key="index">
        <img :src="image" class="swiper-image" />
      </swiper-slide>
    </swiper>

    <!-- 下方商品資訊 -->
    <div class="p-4 text-gray-800">
      <h2 class="text-lg font-semibold">{{ product.name }}</h2>
      <p class="mt-1">
        <span class="text-amber-600 font-bold">NT$ {{ discountedPrice }}</span>
        <span
          v-if="product.discount"
          class="text-gray-400 ml-2 line-through text-sm"
        >
          NT$ {{ product.price }}
        </span>
      </p>

      <!-- 數量控制 -->
      <div class="flex items-center mt-3 space-x-3">
        <button
          @click="decreaseQuantity"
          class="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
        >－</button>

        <span class="text-lg font-medium">{{ quantity }}</span>

        <button
          @click="increaseQuantity"
          class="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
        >＋</button>
      </div>

      <!-- 加入購物車 -->
      <button
        @click="addToCart(product, quantity)"
        class="mt-4 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition w-full"
      >
        加入購物車
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "@/stores/cart";

import { Swiper, SwiperSlide } from 'swiper/vue';
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

// 數量 state
const quantity = ref(1);

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

// 加入購物車（帶數量）
const addToCart = (product, qty) => {
  cartStore.addToCart({ ...product, quantity: qty });
};
</script>

<style scoped>
.swiper-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
