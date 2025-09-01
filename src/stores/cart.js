// stores/cart.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [], // 每項: { id, name, price, quantity, ... }
  }),
  getters: {
    // 所有商品數量總和（badge 要顯示的通常值）
    totalQuantity: (state) =>
      state.cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0),

    // 商品種類數（有幾筆不同商品）
    itemCount: (state) => state.cart.length,

    // 總金額
    totalPrice: (state) =>
      state.cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
  },
  actions: {
    addToCart(product, qty) {
      // 允許兩種傳入方式：
      // 1) addToCart(productObj, qty)
      // 2) addToCart({ ...productObj, quantity: qty })
      const productId = product?.id;
      if (!productId) {
        console.warn("addToCart: product must have an id", product);
        return;
      }

      // 取出要加的數量（優先參數 qty，再看 product.quantity，否則 1）
      const quantityToAdd = Number(qty ?? product.quantity ?? 1);

      // find existing by id
      const existing = this.cart.find((i) => i.id === productId);

      if (existing) {
        existing.quantity = Number(existing.quantity || 0) + quantityToAdd;
      } else {
        // push 一個淺複本，避免與原 props 共用 reference
        const item = { ...product, quantity: quantityToAdd };
        this.cart.push(item);
      }
    },

    // 額外方便方法：設定數量、刪除、清空
    setQuantity(productId, newQty) {
      const item = this.cart.find((i) => i.id === productId);
      if (item) item.quantity = Math.max(0, Number(newQty || 0));
      // 可選：若 newQty === 0 就移除
      if (item && item.quantity === 0) {
        this.cart = this.cart.filter((i) => i.id !== productId);
      }
    },

    removeItem(productId) {
      this.cart = this.cart.filter((i) => i.id !== productId);
    },

    clear() {
      this.cart = [];
    },
  },
});
