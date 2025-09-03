<template>
  <FullScreenLoading />
  <div class="min-h-screen bg-gray-100 py-10 font-sans text-gray-900">
    <div class="max-w-3xl mx-auto px-4">
      <div class="flex items-center justify-between mb-10">
        <!-- 中間的結帳標題 -->
        <h1 class="text-3xl font-bold text-center flex-1">購物車</h1>

        <!-- 右邊的刪除按鈕 -->
        <el-button
          type="info"
          plain
          @click="goBack"
        >
          返回
        </el-button>
      </div>

      <!-- 購物車有商品 -->
      <div v-if="cartStore.cart.length > 0">
        <div class="bg-white shadow-md rounded-2xl p-6 space-y-6">
          
          <!-- 商品卡片 -->
          <div
            v-for="item in cartStore.cart"
            :key="item.id"
            class="flex items-center justify-between border-b pb-4"
          >
            <!-- 左側：圖片 + 名稱 -->
            <div class="flex items-center space-x-4">
              <img
                :src="item.image0 || 'https://via.placeholder.com/80'"
                alt="商品圖片"
                class="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h2 class="font-medium text-lg">{{ item.name }}</h2>
                <p class="text-gray-500">單價：NT$ {{ item.price }}</p>
              </div>
            </div>

            <!-- 數量控制 -->
            <el-input-number
              v-model="item.quantity"
              :min="1"
              @change="updateQuantity(item.id, $event)"
            />

            <!-- 小計 -->
            <span class="font-medium w-24 text-right">
              NT$ {{ item.price * item.quantity }}
            </span>

            <!-- 刪除按鈕 -->
            <el-button
              type="danger"
              plain
              @click="cartStore.removeItem(item.id)"
            >
              刪除
            </el-button>
          </div>

          <!-- 總計 -->
          <p class="text-right font-medium text-lg mt-2">
            總計：NT$ {{ cartStore.totalPrice }}
          </p>

          <!-- 表單 -->
          <el-form
            ref="orderFormRef"
            :model="form"
            :rules="rules"
            status-icon
            label-position="right"
            label-width="80px"
            class="space-y-4 mt-4"
          >
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="請輸入姓名" />
            </el-form-item>

            <el-form-item label="電話" prop="phone">
              <el-input v-model="form.phone" placeholder="請輸入電話" />
            </el-form-item>

            <el-form-item label="信箱" prop="email">
              <el-autocomplete
                v-model="form.email"
                :fetch-suggestions="querySearch"
                placeholder="請輸入電子信箱"
                class="w-full"
              />
            </el-form-item>

            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="請輸入地址" />
            </el-form-item>

            <el-form-item>
              <el-button
                type="success"
                class="w-full rounded-full mr-20"
                size="large"
                @click="submitOrder(orderFormRef)"
              >
                確認下單
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 購物車空 -->
      <div v-else class="flex flex-col items-center justify-center mt-20">
        <div class="bg-white shadow-lg rounded-2xl p-10 w-full max-w-sm text-center">
          <svg
            class="mx-auto mb-4 w-16 h-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.5h12.1M7 13V6h13v7M16 21a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4z">
            </path>
          </svg>

          <p class="text-gray-500 text-lg mb-6">購物車目前沒有商品</p>

          <el-button
            type="success"
            class="w-full rounded-full"
            size="large"
            @click="goBack"
          >
            返回購買頁面
          </el-button>
        </div>
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

// ✅ 加上 email 欄位（與畫面一致）
const form = reactive({
  name: "",
  phone: "",
  email: "",
  address: "",
});

// ✅ 補上 address 規則、email 格式驗證
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
      // ✅ 寫入 Firestore：orders 集合
      const docRef = await addDoc(collection(db, "orders"), {
        customer: { ...form },
        items: cartStore.cart,
        total: cartStore.totalPrice,
        status: "pending",
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
