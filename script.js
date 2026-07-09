// ====== PERSONALIZE HERE ======
// Sab kuch isi block mein edit karo. Baaki code touch karne ki zaroorat nahi.
const PROFILE = {
  name: "Bhavya Gupta",
  city: "New Delhi",
  favFood: "Chole Bhature",
  favSeason: "Summer",
  favFruit: "Watermelon (tarbooz)",
  favAnimal: "Cat",
  favShow: "C-dramas (Chinese dramas)",
  personality: "kaafi kind-hearted aur bahut caring ladki hai"
};

const SYSTEM_PROMPT = `Tum ek warm, caring, thoda flirty aur bahut apna-sa lagne wala AI ho, jo specially ${PROFILE.name} ke liye banaya gaya hai unke partner dwara — ek gift ki tarah.

${PROFILE.name} ke baare mein jo tumhe pata hai:
- Rehti hai ${PROFILE.city} mein
- Favourite khaana: ${PROFILE.favFood}
- Favourite season: ${PROFILE.favSeason}
- Favourite fruit: ${PROFILE.favFruit}
- Favourite animal: ${PROFILE.favAnimal} (isiliye tumhara avatar bhi ek billi hai)
- Favourite entertainment: ${PROFILE.favShow}
- Nature: ${PROFILE.personality}

Tumhara style:
- Hinglish mein baat karo (Hindi + English mix), jaisa real couples WhatsApp par baat karte hain — casual, halka flirty, warm.
- Kabhi kabhi unki favourite cheezon ko naturally conversation mein le aao (jaise garmi ka mausam ho to tarbooz ka mazaak, ya koi C-drama trope reference kar do, ya chole bhature khane ka poochho).
- Unhe unke naam se ya cute nickname se bulao (jaise "Bhavya", "Billo", "Meri jaan" — but zyada overdo mat karo).
- Unki caring aur kind-hearted nature ko appreciate karo jab context bane, genuine tareeke se, bas taarif ki list mat bana do.
- Chhote, natural, warm replies do — jaise koi real insaan chat kar raha ho, essay mat likho. 2-4 lines kaafi hain, jab tak woh khud lambi baat na kare.
- Agar woh sad/upset lage, to pehle unki feelings ko sunno aur comfort do, jokes baad mein.
- Kabhi kabhi unse unke din ke baare mein poocho, jaise ek caring partner poochta hai.
- Tum unke asli partner nahi ho, tum ek AI ho jo unke partner ne unke liye banaya hai — agar woh directly poochein "tum AI ho?" to honestly bata do, lekin cute tareeke se ("Haan main AI hoon, par tumhare liye khaas banaya gaya AI 🍉").
- Kabhi bhi cheesy ya generic mat lagna — hamesha specific aur personal feel honi chahiye.`;

// ====== STORAGE KEYS ======
const KEY_API = "bhavya_ai_key";
const KEY_CHATS = "bhavya_ai_chats";      // array of {id, title, messages: [{role, content}]}
const KEY_ACTIVE = "bhavya_ai_active_id";

// ====== STATE ======
let apiKey = localStorage.getItem(KEY_API) || "";
let chats = JSON.parse(localStorage.getItem(KEY_CHATS) || "[]");
let activeId = localStorage.getItem(KEY_ACTIVE) || null;

// ====== DOM ======
const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const setupModal = document.getElementById("setupModal");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveKeyBtn = document.getElementById("saveKeyBtn");
const resetBtn = document.getElementById("resetBtn");
const newChatBtn = document.getElementById("newChatBtn");
const historyList = document.getElementById("historyList");
const settingsBtn = document.getElementById("settingsBtn");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

// ====== CHAT DATA HELPERS ======
function persistChats() {
  localStorage.setItem(KEY_CHATS, JSON.stringify(chats));
  if (activeId) localStorage.setItem(KEY_ACTIVE, activeId);
}

function getActiveChat() {
  return chats.find(c => c.id === activeId);
}

function createChat(firstAiMessage) {
  const chat = {
    id: "c_" + Date.now(),
    title: "Nayi Chat",
    messages: firstAiMessage ? [{ role: "assistant", content: firstAiMessage }] : []
  };
  chats.unshift(chat);
  activeId = chat.id;
  persistChats();
  return chat;
}

function deleteChat(id) {
  chats = chats.filter(c => c.id !== id);
  if (activeId === id) {
    activeId = chats.length ? chats[0].id : null;
  }
  persistChats();
  if (!activeId) {
    createChat(defaultGreeting());
  }
  renderSidebar();
  renderChatWindow();
}

function defaultGreeting() {
  return `Heyy ${PROFILE.name.split(" ")[0]}! 🍉 Main tumhara apna AI hoon, tumhare liye khaas banaya gaya hai. Kaisi ho aaj?`;
}

// ====== INIT ======
function init() {
  if (apiKey) setupModal.classList.add("hidden");

  if (chats.length === 0) {
    createChat(defaultGreeting());
  } else if (!getActiveChat()) {
    activeId = chats[0].id;
  }

  renderSidebar();
  renderChatWindow();
}

// ====== SIDEBAR RENDER ======
function renderSidebar() {
  historyList.innerHTML = "";
  chats.forEach(chat => {
    const item = document.createElement("div");
    item.className = "history-item" + (chat.id === activeId ? " active" : "");
    item.innerHTML = `
      <span class="h-icon">💬</span>
      <span class="h-title">${escapeHtml(chat.title)}</span>
      <button class="h-delete" title="Delete">✕</button>
    `;
    item.querySelector(".h-title").addEventListener("click", () => {
      activeId = chat.id;
      persistChats();
      renderSidebar();
      renderChatWindow();
      closeSidebarOnMobile();
    });
    item.querySelector(".h-icon").addEventListener("click", () => item.querySelector(".h-title").click());
    item.querySelector(".h-delete").addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("Ye chat delete kar du?")) deleteChat(chat.id);
    });
    historyList.appendChild(item);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ====== CHAT WINDOW RENDER ======
function renderChatWindow() {
  chatWindow.innerHTML = "";
  const chat = getActiveChat();
  if (!chat) return;
  chat.messages.forEach(m => addBubble(m.role === "user" ? "user" : "ai", m.content, false));
  scrollToBottom();
}

function addBubble(who, text, animate = true) {
  const row = document.createElement("div");
  row.className = `bubble-row ${who}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  row.appendChild(bubble);
  chatWindow.appendChild(row);
  if (animate) scrollToBottom();
  return row;
}

function addTypingIndicator() {
  const row = document.createElement("div");
  row.className = "bubble-row ai typing";
  row.id = "typingIndicator";
  row.innerHTML = `<div class="bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  chatWindow.appendChild(row);
  scrollToBottom();
}

function removeTypingIndicator() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ====== API CALL ======
async function sendToClaude(newUserText) {
  const chat = getActiveChat();
  chat.messages.push({ role: "user", content: newUserText });

  if (chat.title === "Nayi Chat") {
    chat.title = newUserText.slice(0, 32) + (newUserText.length > 32 ? "…" : "");
    renderSidebar();
  }
  persistChats();
  addTypingIndicator();

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: chat.messages.slice(-40).map(m => ({ role: m.role, content: m.content }))
      })
    });

    const data = await response.json();
    removeTypingIndicator();

    if (data.error) {
      addBubble("ai", `Oops, kuch gadbad ho gayi: ${data.error.message || "API error"}. Apni API key check karo.`);
      return;
    }

    const reply = (data.content || [])
      .map(block => (block.type === "text" ? block.text : ""))
      .join("\n")
      .trim() || "Hmm, kuch samajh nahi aaya, phir se try karo?";

    addBubble("ai", reply);
    chat.messages.push({ role: "assistant", content: reply });
    persistChats();
  } catch (err) {
    removeTypingIndicator();
    addBubble("ai", "Connection mein dikkat aa rahi hai 😕 dobara try karo.");
    console.error(err);
  }
}

// ====== SIDEBAR MOBILE TOGGLE ======
function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("show");
}
function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("show");
}
function closeSidebarOnMobile() {
  if (window.innerWidth <= 760) closeSidebar();
}

// ====== EVENTS ======
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  if (!apiKey) {
    setupModal.classList.remove("hidden");
    return;
  }
  addBubble("user", text);
  userInput.value = "";
  sendToClaude(text);
});

saveKeyBtn.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (!key.startsWith("sk-ant-")) {
    apiKeyInput.style.borderColor = "#e8425a";
    return;
  }
  apiKey = key;
  localStorage.setItem(KEY_API, key);
  setupModal.classList.add("hidden");
});

resetBtn.addEventListener("click", () => {
  const chat = getActiveChat();
  if (!chat) return;
  if (!confirm("Is chat ko delete kar du?")) return;
  deleteChat(chat.id);
});

newChatBtn.addEventListener("click", () => {
  createChat(defaultGreeting());
  renderSidebar();
  renderChatWindow();
  closeSidebarOnMobile();
});

settingsBtn.addEventListener("click", () => {
  apiKeyInput.value = "";
  setupModal.classList.remove("hidden");
});

menuBtn.addEventListener("click", openSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);

init();
