# Bhavya ke liye 🍉 — Personalized AI Chatbot

Ek chota, khud ka personalized AI chatbot — Bhavya (New Delhi, chole-bhature lover, garmi/tarbooz/billi fan, C-drama enthusiast) ke liye khaas banaya gaya, uske partner ki taraf se.

## Kya hai isme
- Watermelon + cat themed, **ChatGPT jaisa layout** — left side sidebar, right side chat
- Sidebar mein: "Nayi Chat" button, purani saari chats ki history (title, click to switch, delete option), aur neeche profile card (naam + settings ⚙️)
- Mobile pe sidebar ek drawer ki tarah slide hoti hai (☰ button se khulti hai)
- Har baar chat karo to woh unki pasand-napasand ke context ke saath baat karti hai (system prompt mein already feed hai)
- Saari chats (multiple conversations) browser mein hi save hoti hain (localStorage), koi server nahi chahiye

## Setup (2 minute ka kaam)

1. **API key lo**: [aistudio.google.com/apikey](https://aistudio.google.com/apikey) pe jaake Google account se login karke ek free Gemini API key banao (`AIza...` se start hogi). No credit card chahiye.
2. **Files ko GitHub pe daalo**: `index.html`, `style.css`, `script.js` teeno files ek repo mein daal do.
3. **GitHub Pages on karo**: Repo Settings → Pages → Source: `main` branch → Save. Kuch second mein tumhari site live ho jaayegi (`https://tumhara-username.github.io/repo-name`).
4. Site kholte hi ek chota popup aayega jisme API key daalni hogi — woh sirf us browser mein save hoti hai, kahi bhejni nahi padti.

## Personalize karna hai?

`script.js` ke top mein `PROFILE` object hai — waha se naam, favourites, sab kuch edit kar sakte ho. `SYSTEM_PROMPT` mein hi chatbot ki poori personality aur tone define hai, chaho to usme aur inside jokes/memories bhi add kar sakte ho.

## ⚠️ Ek important baat

Ye API key browser mein directly use hoti hai — ye ek **personal/gift project** ke liye theek hai jo sirf tum aur Bhavya use karoge, lekin agar link publicly bahut logo tak pahunch jaye to woh tumhari free-tier key se hi calls karenge aur tumhara daily quota jaldi khatam ho sakta hai. Best hai ki link sirf Bhavya ke saath hi share karo, kisi group mein na daalo.

Agar future mein ise safe/production banana ho, to API key ko ek chote backend/serverless function (Vercel/Cloudflare Worker) ke peeche rakhna best practice hai.

---
Made with ❤️ (and a little help from Claude).
