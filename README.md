# 釣魚捲線器 購物介面

![Static Badge](https://img.shields.io/badge/Vue3-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D) 
![Static Badge](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) 
![Static Badge](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) 
![Static Badge](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) 
![Static Badge](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) 
![Static Badge](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) 
![Static Badge](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=vue.js&logoColor=green) 
![Static Badge](https://img.shields.io/badge/Swiper-6332F6?style=for-the-badge&logo=swiper&logoColor=white) 
![Static Badge](https://img.shields.io/badge/SweetAlert2-FF7F50?style=for-the-badge&logo=javascript&logoColor=white) 
![Static Badge](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) 
![Static Badge](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) 

## 說明

此專案為基於 **Vue3 + Vite** 的前端應用，整合 Firebase 即時資料庫、Pinia 狀態管理、Element Plus UI 套件，並搭配 Swiper 輪播與 SweetAlert2 提示效果，打造流暢的互動式網頁體驗。  

## 專案技術

- Node.js v18+  
- Vite v5+  
- Vue v3.5.18  
- vue-router v4.5.1  
- pinia v3.0.3  
- element-plus v2.11.1  
- firebase v12.2.1  
- swiper v11.2.10  
- sweetalert2 v11.22.5  

## 安裝與執行

```bash
# 安裝依賴
npm install

# 啟動開發環境
npm run dev

# 打包專案
npm run build

## 資料夾說明

fishing-shop/
├─ src/
│  ├─ assets/        # 靜態資源
│  ├─ components/    # 元件
│  ├─ stores/        # Pinia 狀態管理
│  ├─ router/        # vue-router 設定
│  ├─ views/         # 頁面檔案
│  └─ main.js        # 專案進入點
├─ public/           # 公用靜態資源
├─ index.html        # 首頁
└─ package.json

