# TubeMind YouTube Transcript Microservice 🚀

High-performance, self-hosted Python FastAPI microservice that extracts transcripts and subtitles from YouTube videos without third-party API rate limits.

---

## ⚡ 1-Minute Free Deployment Options

### Option 1: Deploy on Render.com (100% Free)
1. Go to [Render.com Dashboard](https://dashboard.render.com/) and click **New +** $\rightarrow$ **Web Service**.
2. Connect your GitHub repository (`Shoaib-Akh/TubeMindAI`).
3. Set the following settings:
   - **Root Directory:** `transcript-service`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Click **Create Web Service**.
5. Render will give you a public URL (e.g. `https://tubemind-transcript.onrender.com`).

---

### Option 2: Deploy on Railway.app
1. Go to [Railway.app](https://railway.app) $\rightarrow$ **New Project** $\rightarrow$ **Deploy from GitHub Repo**.
2. Select your repository.
3. In **Settings** $\rightarrow$ **Root Directory**, set `/transcript-service`.
4. Click **Generate Domain**. Railway will give you a public URL (e.g. `https://tubemind-transcript.up.railway.app`).

---

## 🔌 Connecting to Next.js on Vercel

Once deployed, go to your **Vercel Dashboard** $\rightarrow$ **tube-mind-ai** $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**:
- **Key:** `CUSTOM_TRANSCRIPT_API_URL`
- **Value:** `https://your-service.onrender.com` (or Railway URL)

Then **Redeploy** on Vercel! TubeMind will now use your own microservice as the top-tier transcript provider!
