<template>
  <div class="max-w-3xl mx-auto px-4 py-10 font-sans text-gray-900">
    <h1 class="text-2xl font-semibold mb-6">結帳</h1>

    <div v-if="cartStore.cart.length > 0" class="space-y-6">

      <!-- 商品列表 -->
      <div
        v-for="item in cartStore.cart"
        :key="item.id"
        class="flex items-center border-b pb-4"
      >
        <!-- 商品縮圖 (取 image0) -->
        <img
          :src="item.image0 || 'https://via.placeholder.com/80'"
          alt="商品圖片"
          class="w-20 h-20 object-cover rounded-lg mr-4"
        />

        <!-- 商品名稱 + 數量 -->
        <div class="flex-1">
          <h2 class="font-medium">{{ item.name }}</h2>
          <p class="text-gray-500">數量：{{ item.quantity }}</p>
        </div>

        <!-- 小計 -->
        <span class="font-medium">NT$ {{ item.price * item.quantity }}</span>
      </div>

      <!-- 總計 -->
      <p class="text-right font-medium text-lg">
        總計：NT$ {{ cartStore.totalPrice }}
      </p>

      <!-- 陽春版表單 -->
      <form @submit.prevent="submitOrder" class="mt-6 space-y-4">
        <input
          type="text"
          placeholder="姓名"
          v-model="form.name"
          class="w-full px-3 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="電話"
          v-model="form.phone"
          class="w-full px-3 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="地址"
          v-model="form.address"
          class="w-full px-3 py-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          class="w-full py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          確認下單
        </button>
      </form>
    </div>

    <p v-else class="text-gray-500">購物車是空的</p>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useCartStore } from "@/stores/cart";

const cartStore = useCartStore();

const form = reactive({
  name: "",
  phone: "",
  address: "",
});

const submitOrder = () => {
  alert(`感謝購買！\n姓名：${form.name}\n電話：${form.phone}\n地址：${form.address}\n總金額：NT$${cartStore.totalPrice}`);
  cartStore.clear();
};
</script>
