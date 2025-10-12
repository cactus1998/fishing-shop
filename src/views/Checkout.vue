<template>
  <FullScreenLoading />
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-white shadow-md rounded-2xl p-6 mb-8">
        <div class="flex items-center justify-between">
          <button
            @click="goBack"
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">購物車</h1>
          
          <div class="w-10"></div>
        </div>
      </div>

      <!-- 購物車有商品 -->
      <div v-if="cartStore.cart.length > 0" class="space-y-6">
        <!-- 商品列表 -->
        <div class="bg-white shadow-md rounded-2xl p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">訂單明細</h2>
          
          <div class="space-y-4">
            <div
              v-for="item in cartStore.cart"
              :key="item.id"
              class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <!-- 商品圖片 -->
              <img
                :src="item.image0 || 'https://via.placeholder.com/80'"
                alt="商品圖片"
                class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />

              <!-- 商品資訊 -->
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 truncate">{{ item.name }}</h3>
                <p class="text-sm text-gray-500 mt-1">NT$ {{ item.price }}</p>
              </div>

              <!-- 數量控制 -->
              <div class="flex items-center gap-2">
                <button
                  @click="decreaseQuantity(item)"
                  class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                
                <span class="w-10 text-center font-medium text-gray-900">{{ item.quantity }}</span>
                
                <button
                  @click="increaseQuantity(item)"
                  class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <!-- 小計 -->
              <div class="text-right min-w-[80px]">
                <p class="font-bold text-red-600">
                  NT$ {{ item.price * item.quantity }}
                </p>
              </div>

              <!-- 刪除按鈕 -->
              <button
                @click="cartStore.removeItem(item.id)"
                class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition text-gray-400 hover:text-red-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 總計 -->
          <div class="mt-6 pt-6 border-t-2 border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-lg font-medium text-gray-600">總計</span>
              <span class="text-2xl font-bold text-red-600">NT$ {{ cartStore.totalPrice }}</span>
            </div>
          </div>
        </div>

        <!-- 收件資訊表單 -->
        <div class="bg-white shadow-md rounded-2xl p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">收件資訊</h2>
          
          <el-form
            ref="orderFormRef"
            :model="form"
            :rules="rules"
            label-position="top"
            class="space-y-4"
          >
            <el-form-item label="姓名" prop="name">
              <el-input 
                v-model="form.name" 
                placeholder="請輸入姓名"
                size="large"
              />
            </el-form-item>

            <el-form-item label="電話" prop="phone">
              <el-input 
                v-model="form.phone" 
                placeholder="請輸入電話"
                size="large"
              />
            </el-form-item>

            <el-form-item label="電子信箱" prop="email">
              <el-autocomplete
                v-model="form.email"
                :fetch-suggestions="querySearch"
                placeholder="請輸入電子信箱"
                size="large"
                class="w-full"
              />
            </el-form-item>

            <el-form-item label="地址" prop="address">
              <el-input 
                v-model="form.address" 
                placeholder="請輸入地址"
                size="large"
              />
            </el-form-item>

            <el-form-item class="mt-8">
              <button
                @click="submitOrder(orderFormRef)"
                class="w-full px-6 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition text-lg"
              >
                確認下單
              </button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 購物車空 -->
      <div v-else class="bg-white shadow-md rounded-2xl p-10 text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            class="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>

        <p class="text-xl text-gray-600 font-medium mb-2">購物車是空的</p>
        <p class="text-gray-400 mb-8">快去挑選喜歡的商品吧!</p>

        <button
          @click="goBack"
          class="px-8 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition"
        >
          返回購買頁面
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

// 🔥 Firestore：匯入 db 與寫入所需方法
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { useLoadingStore } from "@/stores/loading";
const loadingStore = useLoadingStore();
import FullScreenLoading from "@/components/FullScreenLoading.vue";

const cartStore = useCartStore();
const router = useRouter();

const orderFormRef = ref(null);

const form = reactive({
  name: "",
  phone: "",
  email: "",
  address: "",
});

// 驗證
const rules = {
  name: [{ required: true, message: "請輸入姓名", trigger: "blur" }],
  phone: [
    { required: true, message: "請輸入電話", trigger: "blur" },
    { pattern: /^[0-9-]+$/, message: "電話格式不正確", trigger: "blur" },
  ],
  email: [
    { required: true, message: "請輸入電子信箱", trigger: "blur" },
    { type: "email", message: "Email 格式不正確", trigger: ["blur", "change"] },
  ]
};

// 常見的 email 網域
const emailDomains = ["gmail.com", "yahoo.com.tw", "hotmail.com", "outlook.com"];

// 自動完成邏輯
const querySearch = (queryString, cb) => {
  const results = [];
  const atIndex = queryString.indexOf("@");

  if (atIndex > -1) {
    // 使用者已經輸入 @，只建議符合的 domain
    const prefix = queryString.slice(0, atIndex);
    const typedDomain = queryString.slice(atIndex + 1);
    results.push(
      ...emailDomains
        .filter(domain => domain.startsWith(typedDomain))
        .map(domain => ({ value: `${prefix}@${domain}` }))
    );
  } else {
    // 還沒輸入 @，就列出全部 domain
    results.push(
      ...emailDomains.map(domain => ({ value: `${queryString}@${domain}` }))
    );
  }

  cb(results);
};

const submitOrder = async (formRef) => {
  if (!formRef) return;

  await formRef.validate(async (valid) => {
    if (!valid) {
      Swal.fire({
        icon: "error",
        title: "❌ 資料未填寫完整",
        text: "請檢查必填欄位！",
        confirmButtonText: "確定",
        confirmButtonColor: "#e74c3c",
      });
      return;
    }

    if (cartStore.cart.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "購物車為空",
        text: "請先選擇商品再送出訂單。",
      });
      return;
    }
    loadingStore.show();
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        customer: { ...form },
        items: cartStore.cart,
        total: cartStore.totalPrice,
        status: "未送單",
        createdAt: serverTimestamp(),
      });

      await Swal.fire({
        icon: "success",
        title: "🎉 訂單完成！",
        html: `
          <div style="text-align:left; margin-top:10px;">
            <p><strong>訂單編號：</strong> ${docRef.id}</p>
            <p><strong>姓名：</strong> ${form.name}</p>
            <p><strong>電話：</strong> ${form.phone}</p>
            <p><strong>Email：</strong> ${form.email}</p>
            <p><strong>地址：</strong> ${form.address}</p>
            <p><strong>總金額：</strong>
              <span style="color:#27ae60;">NT$${cartStore.totalPrice}</span>
            </p>
          </div>
        `,
        showCloseButton: true,
        confirmButtonText: "返回購買頁面",
      });

      cartStore.clear();
      goBack();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "送出失敗",
        text: "無法寫入 Firebase，請稍後再試。",
      });
    } finally {
      loadingStore.hide();
    }
  });
};

const updateQuantity = (id, newQty) => {
  cartStore.setQuantity(id, newQty);
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
/* 每列商品間距 */
div[v-for] {
  padding-bottom: 12px;
}
</style>
