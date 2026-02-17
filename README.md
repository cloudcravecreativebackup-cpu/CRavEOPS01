# CraveOps Intelligence Portal - Deployment Guide

This project is configured for high-performance deployment on [Vercel](https://vercel.com) using **Vite** and **TypeScript**.

## Prerequisites

- A Vercel account.
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   Create a `.env` file in the root and add:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## Deploying to Vercel

### Using the Vercel Dashboard

1. **Push your code** to a Git repository (GitHub, GitLab, or Bitbucket).
2. **Import the project** in the Vercel Dashboard.
3. In the **Build & Development Settings**:
   - Vercel should automatically detect **Vite**.
   - Ensure the Build Command is `npm run build`.
   - Ensure the Output Directory is `dist`.
4. In the **Environment Variables** section:
   - Add a new variable:
     - **Key**: `API_KEY`
     - **Value**: `[Your Google Gemini API Key]`
5. Click **Deploy**.

### Using the Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`.
2. Run `vercel` in the project root and follow prompts.
3. Add the API Key secret:
   ```bash
   vercel env add API_KEY
   ```
4. Deploy to production:
   ```bash
   vercel --prod
   ```

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Intelligence**: Google Gemini API (gemini-3-pro-preview)
- **Charts**: Recharts
