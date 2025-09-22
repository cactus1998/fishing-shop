<template>
  <div class="max-w-6xl mx-auto px-4 py-10 font-sans text-gray-900">
    <!-- Header -->
    <header class="flex justify-between items-center mb-10">
      <h1 class="text-3xl font-semibold">樂咖大物輪 購物網站</h1>

      <!-- 購物車按鈕 -->
      <div class="relative">
        <button
          @click="toggleCart"
          class="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          🛒
          <span
            v-if="cartStore.itemCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
          >
            {{ cartStore.itemCount }}
          </span>
        </button>
        <!-- 購物車下拉 -->
        <div
          v-if="showCart"
          class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-lg p-4 z-10"
        >
          <h2 class="text-lg font-medium mb-3">購物車</h2>
          <div v-if="cartStore.cart.length > 0" class="space-y-3">
            <div
              v-for="item in cartStore.cart"
              :key="item.id"
              class="flex justify-between items-center"
            >
              <span>{{ item.name }} × {{ item.quantity }}</span>
              <span class="text-sm">NT$ {{ item.price * item.quantity }}</span>
            </div>
            <p class="text-right font-medium pt-2 border-t">
              總計：NT$ {{ cartStore.totalPrice }}
            </p>

            <!-- 新增：前往結帳按鈕 -->
            <button
              @click="goCheckout"
              class="block mt-3 w-full text-center px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition"
            >
              前往結帳
            </button>
          </div>
          <p v-else class="text-gray-500 text-sm">購物車是空的</p>
        </div>
      </div>
    </header>

    <!-- 商品列表 -->
    <main class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import ProductCard from "@/components/card/ProductCard.vue";
import { products } from '@/data/products';

const cartStore = useCartStore();
const showCart = ref(false);
const router = useRouter();

const toggleCart = () => {
  showCart.value = !showCart.value;
};

const goCheckout = () => {
  router.push("/checkout"); // 直接跳轉
};

</script>

<style>
body {
  @apply bg-gray-100;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>
