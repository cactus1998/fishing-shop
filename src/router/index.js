import { createRouter, createWebHistory } from "vue-router";
import ProductList from "@/views/ProductList.vue";
import Checkout from "@/views/Checkout.vue";

const router = createRouter({
  history: createWebHistory("/fishing-shop/"), // ← 加上 base
  routes: [
    { path: "/", name: "ProductList", component: ProductList },
    { path: "/checkout", name: "Checkout", component: Checkout },
  ],
});

export default router;
