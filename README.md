# Patient Record System (護理整合紀錄系統)

這是一個基於 React + TypeScript + Supabase 的病患紀錄管理系統。

## 功能特色
- **病患管理**：檢視、搜尋、篩選病患資料。
- **護理紀錄**：即時新增與查看護理紀錄。
- **統計報表**：視覺化病房與護理等級分佈。
- **資料庫整合**：使用 Supabase (PostgreSQL) 儲存所有資料。

## 如何在另一台電腦上安裝與執行

### 1. 環境準備
確保您的電腦已安裝：
- [Node.js](https://nodejs.org/) (建議 v18 以上)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (用於執行本地 Supabase 資料庫)
- [Git](https://git-scm.com/)

### 2. 下載專案
開啟終端機 (Terminal) 並執行：
```bash
git clone https://github.com/dunren-cmd/patient-record-system.git
cd patient-record-system
```

### 3. 啟動後端資料庫 (Supabase)
確保 Docker Desktop 已經開啟，然後執行：
```bash
npx supabase start
```
*初次執行會花一點時間下載 Docker 映像檔。*

啟動成功後，終端機會顯示一串網址與 Key，請記下：
- `API URL`
- `anon key`

### 4. 設定前端環境變數
1. 進入 `frontend` 資料夾：
   ```bash
   cd frontend
   ```
2. 複製範例設定檔：
   ```bash
   cp .env.example .env
   ```
   *(Windows 用戶可直接在檔案總管複製貼上並重新命名)*
3. 用文字編輯器開啟 `.env`，將步驟 3 取得的 `API URL` 和 `anon key` 填入：
   ```env
   VITE_SUPABASE_URL=您的API_URL
   VITE_SUPABASE_ANON_KEY=您的anon_key
   ```

### 5. 安裝依賴並啟動前端
在 `frontend` 資料夾內執行：
```bash
npm install
npm run dev
```

### 6. 開始使用
打開瀏覽器訪問顯示的網址 (通常是 `http://localhost:5173`) 即可開始使用！

## 資料庫還原
本專案包含 Migration 腳本，`npx supabase start` 啟動時會自動建立資料表並寫入 50 筆預設病患資料，無需手動還原。
