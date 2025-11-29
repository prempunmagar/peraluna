# Peraluna Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

   Add your Anthropic API key:
   ```env
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

   **To get an Anthropic API key:**
   - Visit https://console.anthropic.com/
   - Sign up or log in
   - Go to API Keys section
   - Create a new API key
   - Copy it to your `.env.local` file

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open the App**
   - Navigate to http://localhost:3000
   - You'll be redirected to the login page
   - Use any email/password (mock auth for now)
   - Start planning trips with Luna!

## Features Available

- ✅ Login/Authentication (mock)
- ✅ Dashboard with trip cards
- ✅ 6-step trip setup wizard
- ✅ Trip planner with 3-column layout
- ✅ Luna AI chat (requires Anthropic API key)
- ✅ Collapsible sidebars
- ✅ Real-time cost tracking
- ✅ Mock trip data

## Without API Key

The app will work without an Anthropic API key, but Luna will show a friendly message about needing configuration. All other features work normally!

## Next Steps

- Add your Anthropic API key for real AI chat
- Explore the dashboard and create trips
- Try the wizard and chat with Luna
- Customize colors in `app/globals.css`
