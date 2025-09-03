<template>
  <transition name="fade">
    <div
      v-if="loadingStore.isLoading"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="flex flex-col items-center">
        <el-icon class="animate-spin text-white text-6xl mb-4">
          <Loading />
        </el-icon>
        <p class="text-white text-lg">處理中，請稍候...</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useLoadingStore } from "@/stores/loading";
import { Loading } from "@element-plus/icons-vue";

const loadingStore = useLoadingStore();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
