<template>
  <div class="max-w-3xl mx-auto px-4 py-10 font-sans text-gray-900">
    <h1 class="text-2xl font-semibold mb-6">結帳</h1>

    <div v-if="cartStore.cart.length > 0" class="space-y-4">
      <!-- 商品列 -->
      <div
        v-for="item in cartStore.cart"
        :key="item.id"
        class="flex items-center justify-between border-b pb-4"
      >
        <!-- 左側：縮圖 + 商品名稱 -->
        <div class="flex items-center space-x-4">
          <img
            :src="item.image0 || 'https://via.placeholder.com/80'"
            alt="商品圖片"
            class="w-20 h-20 object-cover rounded-md"
          />
          <div>
            <h2 class="font-medium">{{ item.name }}</h2>
            <p class="text-gray-500">單價：NT$ {{ item.price }}</p>
          </div>
        </div>

        <!-- 中間：數量控制 -->
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
      <p class="text-right font-medium text-lg mt-4">
        總計：NT$ {{ cartStore.totalPrice }}
      </p>

      <!-- 表單 -->
      <el-form
        ref="orderFormRef"
        :model="form"
        :rules="rules"
        status-icon
        class="space-y-4 mt-6"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="請輸入姓名" />
        </el-form-item>

        <el-form-item label="電話" prop="phone">
          <el-input v-model="form.phone" placeholder="請輸入電話" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="請輸入地址" />
        </el-form-item>

        <el-form-item>
          <el-button
            type="success"
            class="w-full mx-20"
            size="large"
            @click="submitOrder(orderFormRef)"
          >
            確認下單
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <p class="text-gray-500 text-center">購物車是空的</p>
      <el-button
          type="success"
          class="w-full"
          size="large"
          @click="goBack"
        >
          返回購買頁面
      </el-button>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const cartStore = useCartStore();
const router = useRouter();

const orderFormRef = ref(null);
const form = reactive({
  name: "",
  phone: "",
  address: "",
});

const rules = {
  name: [{ required: true, message: "請輸入姓名", trigger: "blur" }],
  phone: [
    { required: true, message: "請輸入電話", trigger: "blur" },
    { pattern: /^[0-9-]+$/, message: "電話格式不正確", trigger: "blur" },
  ],
  address: [{ required: true, message: "請輸入地址", trigger: "blur" }],
};

const submitOrder = async (formRef) => {
  if (!formRef) return;
  await formRef.validate((valid, fields) => {
    if (valid) {
      Swal.fire({
        icon: "success",
        title: "訂單完成！",
        html: `
          <p>感謝購買 🎉</p>
          <p><b>姓名：</b>${form.name}</p>
          <p><b>電話：</b>${form.phone}</p>
          <p><b>地址：</b>${form.address}</p>
          <p><b>總金額：</b>NT$${cartStore.totalPrice}</p>
        `,
        confirmButtonText: "返回首頁",
      }).then(() => {
        cartStore.clear();
        router.go(-1);
      });
    } else {
      // 驗證失敗，彈出錯誤訊息
      Swal.fire({
        icon: "error",
        title: "資料未填寫完整",
        text: "請檢查必填欄位！",
        confirmButtonText: "確定",
      });
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
