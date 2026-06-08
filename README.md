# 辛柯个人主页 · AI 数字分身

React + Express 个人作品集站点，内置 Gemini 驱动的数字分身对话。

## 本地开发

**前置条件：** Node.js 18+

1. 安装依赖：
   ```bash
   npm install
   ```
2. 复制环境变量并填入 Gemini API Key：
   ```bash
   cp .env.example .env
   ```
   在 `.env` 中设置 `GEMINI_API_KEY=你的密钥`
3. 启动开发服务器：
   ```bash
   npm run dev
   ```
4. 浏览器访问 [http://localhost:3000](http://localhost:3000)

## 生产构建

```bash
npm run build
NODE_ENV=production npm start
```

## Render 部署

1. 将代码推送到 GitHub 仓库
2. 登录 [Render](https://render.com)，用 GitHub 授权
3. **New → Web Service**，选择本仓库
4. 配置：
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `NODE_ENV=production npm start`
   - **Environment Variables:**
     - `NODE_ENV` = `production`
     - `GEMINI_API_KEY` = 你的 Gemini API Key
5. 点击 Deploy，等待完成后访问 Render 提供的 URL

也可使用仓库根目录的 [`render.yaml`](render.yaml) 进行 Blueprint 部署。

## 环境变量

| 变量 | 说明 |
|------|------|
| `GEMINI_API_KEY` | Google Gemini API 密钥（数字分身聊天必需） |
| `PORT` | 服务端口，云托管平台会自动注入 |
| `NODE_ENV` | 生产环境设为 `production` |
