<template>
  <div class="w-80 sm:w-96 md:w-full lg:w-full rounded-2xl shadow-md overflow-hidden relative hover:shadow-lg transition h-84">
    <!-- Swiper 輪播 -->
    <swiper
      :modules="[Autoplay, Pagination, EffectCube]"
      :grabCursor="true"
      :loop="true"
      :autoplay="{ delay: 4500, disableOnInteraction: false }"
      :pagination="true"
      effect="cube"
      :cubeEffect="{ shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 }"
      class="h-full"
    >
      <swiper-slide v-for="(image, index) in images" :key="index">
        <img :src="image" class="swiper-image" />
      </swiper-slide>
    </swiper>

    <!-- 浮層資訊固定在卡片底部 -->
    <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent text-white z-20">
      <h2 class="text-lg font-semibold">{{ product.name }}</h2>
      <p class="text-white/90">
        NT$ {{ discountedPrice }}
        <span
          v-if="product.discount"
          class="text-red-400 ml-2 line-through text-sm"
        >
          NT$ {{ product.price }}
        </span>
      </p>
      <button
        @click="addToCart(product)"
        class="mt-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition"
      >
        加入購物車
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCartStore } from "@/stores/cart";

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, EffectCube } from "swiper/modules";
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

const images = computed(() =>
  Object.keys(props.product)
    .filter((key) => key.startsWith("image"))
    .map((key) => props.product[key])
);

const discountedPrice = computed(() =>
  props.product.discount
    ? Math.round(props.product.price * (1 - props.product.discount / 100))
    : props.product.price
);

const addToCart = (product) => {
  cartStore.addToCart(product);
};
</script>

<style scoped>
.swiper-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
