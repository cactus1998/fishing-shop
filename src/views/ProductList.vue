<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <header class="mb-10">
        <div class="bg-white rounded-2xl shadow-md p-6">
          <div class="flex justify-between items-center">
            <!-- Logo & Title -->
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                樂咖大物輪
              </h1>
            </div>

            <!-- 購物車按鈕 -->
            <div class="relative">
              <button
                @click="toggleCart"
                class="relative w-12 h-12 flex items-center justify-center rounded-xl bg-red-500 hover:bg-red-600 transition shadow-md"
              >
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span
                  v-if="cartStore.itemCount > 0"
                  class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {{ cartStore.itemCount }}
                </span>
              </button>

              <!-- 購物車下拉 -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-2"
              >
                <div
                  v-if="showCart"
                  class="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50"
                >
                  <!-- Cart Header -->
                  <div class="bg-red-500 p-4 rounded-t-2xl">
                    <div class="flex justify-between items-center">
                      <h2 class="text-lg font-bold text-white">購物車</h2>
                      <button
                        @click="toggleCart"
                        class="text-white hover:text-gray-200 transition"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Cart Content -->
                  <div class="p-4 max-h-96 overflow-y-auto">
                    <div v-if="cartStore.cart.length > 0" class="space-y-3">
                      <div
                        v-for="item in cartStore.cart"
                        :key="item.id"
                        class="flex justify-between items-start p-3 bg-gray-50 rounded-xl"
                      >
                        <div class="flex-1">
                          <p class="font-medium text-gray-900">{{ item.name }}</p>
                          <p class="text-sm text-gray-500 mt-1">× {{ item.quantity }}</p>
                        </div>
                        <span class="font-bold text-red-600">
                          NT$ {{ item.price * item.quantity }}
                        </span>
                      </div>

                      <!-- Total -->
                      <div class="pt-3 border-t-2 border-gray-200">
                        <div class="flex justify-between items-center mb-4">
                          <span class="text-gray-600 font-medium">總計</span>
                          <span class="text-2xl font-bold text-red-600">
                            NT$ {{ cartStore.totalPrice }}
                          </span>
                        </div>

                        <!-- 前往結帳按鈕 -->
                        <button
                          @click="goCheckout"
                          class="w-full px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition"
                        >
                          前往結帳
                        </button>
                      </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="text-center py-8">
                      <p class="text-gray-500">購物車是空的</p>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import ProductCard from "@/components/card/ProductCard.vue";
import { products } from "@/data/products";

const cartStore = useCartStore();
const showCart = ref(false);
const router = useRouter();

const toggleCart = () => {
  showCart.value = !showCart.value;
};

const goCheckout = () => {
  showCart.value = false;
  router.push("/checkout");
};
</script>

<style scoped>
</style>