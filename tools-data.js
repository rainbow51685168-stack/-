// ====================================================================
// 【超出範圍】本檔案全部為 JavaScript，課程僅教授 HTML 與 CSS。
// 是什麼：用 JavaScript 的陣列與物件，存放 12 個 AI 工具的靜態資料。
// 為什麼：資料與版面分開，main.js 才能依資料自動產生卡片，
//         新增或修改工具時只需要改這個檔案。
//
// 欄位說明：
//   rating / ratingSource  評分與評分來源
//   estimated              true 表示評分是混合來源的估計值，畫面上會加 * 標記
//   priceTag / price       價格標籤（免費 / 免費試用 / 付費）與價格
//   officialUrl            官方網站
//   helpUrl                官方說明文件；沒有獨立說明文件的工具留空字串
//   videoId                YouTube 教學影片的 ID（網址 watch?v= 後面那一段），
//                          預覽頁會用 <iframe> 嵌入（HTML 教材第 32 頁）
//   videoTitle / videoAuthor  影片標題與頻道名稱，顯示在影片下方
//
// 為什麼預覽頁嵌入的是 YouTube 而不是官方說明頁：
//   這些工具的官網與說明文件幾乎都以 X-Frame-Options 或 CSP frame-ancestors
//   禁止被其他網站用 iframe 嵌入，嵌入後只會看到空白；YouTube 的 /embed/ 網址則允許嵌入。
// ====================================================================

const tools = [
  // --- 圖片生成 ---
  {
    id: 1,
    name: "Midjourney",
    category: "圖片生成",
    desc: "透過文字描述生成高品質藝術風格影像，廣受設計師與藝術創作者喜愛。",
    rating: 4.4,
    ratingSource: "G2",
    estimated: false,
    priceTag: "付費",
    price: "$10/月起",
    audience: "設計師、藝術家、創作者",
    color: "#1a1a2e",
    emoji: "🎨",
    officialUrl: "https://www.midjourney.com",
    helpUrl: "https://docs.midjourney.com",
    videoId: "aodE4be2t-g",
    videoTitle: "FULL 2026 Midjourney AI Tutorial (for Beginners)",
    videoAuthor: "Wade McMaster - Creator Impact"
  },
  {
    id: 2,
    name: "Adobe Firefly",
    category: "圖片生成",
    desc: "Adobe 推出的生成式 AI 工具，可直接在 Creative Cloud 中生成與編輯影像。",
    rating: 4.4,
    ratingSource: "G2",
    estimated: false,
    priceTag: "免費試用",
    price: "$4.99/月起",
    audience: "設計師、行銷人員、攝影師",
    color: "#470137",
    emoji: "🔥",
    officialUrl: "https://firefly.adobe.com",
    helpUrl: "https://helpx.adobe.com/firefly/using/overview.html",
    videoId: "6gP5nFByzIQ",
    videoTitle: "How To Get Started With Adobe Firefly - 10 Things Beginners Want To Know How To Do",
    videoAuthor: "Terry Lee White"
  },
  {
    id: 3,
    name: "Nano Banana",
    category: "圖片生成",
    desc: "Google Gemini 內建的 AI 圖片生成與編輯模型，用對話的方式就能生成圖片並反覆修改。",
    rating: 4.0,
    ratingSource: "綜合評估",
    estimated: true,
    priceTag: "免費",
    price: "免費使用",
    audience: "一般用戶、入門創作者",
    color: "#fbbf24",
    emoji: "🍌",
    officialUrl: "https://gemini.google.com",
    helpUrl: "",
    videoId: "WYOH-_pIxBU",
    videoTitle: "How to use the Google Gemini Nano Banana Image Generator",
    videoAuthor: "Tech Tips with Brian Sensei"
  },
  {
    id: 4,
    name: "Recraft",
    category: "圖片生成",
    desc: "專為設計師打造的 AI 圖像生成工具，支援向量圖、插畫與品牌設計素材。",
    rating: 4.7,
    ratingSource: "G2",
    estimated: false,
    priceTag: "免費試用",
    price: "$25/月起",
    audience: "平面設計師、品牌設計師",
    color: "#4f46e5",
    emoji: "✏️",
    officialUrl: "https://www.recraft.ai",
    helpUrl: "https://www.recraft.ai/docs",
    videoId: "Pb71_1pIrec",
    videoTitle: "How to Use Recraft Studio in 2026 | Full Interface Walkthrough",
    videoAuthor: "Recraft"
  },

  // --- 影片生成 ---
  {
    id: 5,
    name: "Pika",
    category: "影片生成",
    desc: "AI 影片生成平台，支援文字轉影片與圖片轉影片，風格多元且操作簡單。",
    rating: 4.3,
    ratingSource: "NeuronFeed",
    estimated: true,
    priceTag: "免費試用",
    price: "$8/月起",
    audience: "內容創作者、社群經營者",
    color: "#ec4899",
    emoji: "🎬",
    officialUrl: "https://pika.art",
    helpUrl: "",
    videoId: "k3JluIw9jL0",
    videoTitle: "How to Use Pika AI for Beginners Full Guide 2026",
    videoAuthor: "How To Solve Pro"
  },
  {
    id: 6,
    name: "Kling AI",
    category: "影片生成",
    desc: "由快手推出的 AI 影片生成工具，擅長生成高品質、物理真實的影片內容。",
    rating: 4.0,
    ratingSource: "TechJockey",
    estimated: true,
    priceTag: "免費試用",
    price: "$5.99/月起",
    audience: "影片創作者、行銷團隊",
    color: "#0ea5e9",
    emoji: "🎥",
    officialUrl: "https://klingai.com",
    helpUrl: "",
    videoId: "gpPSYsbSuGU",
    videoTitle: "Kling AI Tutorial | The Complete Guide (Beginner to Pro)",
    videoAuthor: "Jason Gandy"
  },
  {
    id: 7,
    name: "Dreamina",
    category: "影片生成",
    desc: "CapCut 旗下的 AI 創作平台，整合圖片與影片生成功能，適合短影音製作。",
    rating: 4.2,
    ratingSource: "綜合評估",
    estimated: true,
    priceTag: "免費",
    price: "免費使用",
    audience: "短影音創作者、學生",
    color: "#06b6d4",
    emoji: "💭",
    officialUrl: "https://dreamina.capcut.com",
    helpUrl: "",
    videoId: "pTWE9aAuIO4",
    videoTitle: "Dreamina AI By Capcut Tutorial For Beginners (2026)",
    videoAuthor: "SolveBase"
  },
  {
    id: 8,
    name: "HeyGen",
    category: "影片生成",
    desc: "AI 虛擬人影片平台，可生成真人級數位分身影片，支援多語言配音與翻譯。",
    rating: 4.8,
    ratingSource: "G2",
    estimated: false,
    priceTag: "付費",
    price: "$24/月起",
    audience: "企業、行銷團隊、教育機構",
    color: "#6d28d9",
    emoji: "🧑‍💼",
    officialUrl: "https://www.heygen.com",
    helpUrl: "https://help.heygen.com",
    videoId: "WawX11dvgT0",
    videoTitle: "Full HeyGen Tutorial 2026 for Beginners",
    videoAuthor: "AI Foundry"
  },

  // --- 音樂創作 ---
  {
    id: 9,
    name: "Suno",
    category: "音樂創作",
    desc: "AI 音樂生成工具，輸入文字描述即可產生完整歌曲，包含人聲與伴奏。",
    rating: 4.0,
    ratingSource: "G2",
    estimated: false,
    priceTag: "免費試用",
    price: "$10/月起",
    audience: "音樂愛好者、內容創作者",
    color: "#000000",
    emoji: "🎵",
    officialUrl: "https://suno.com",
    helpUrl: "https://help.suno.com",
    videoId: "MI6vwl_ZHN8",
    videoTitle: "Suno AI Tutorial For Beginners (2026) – Everything You NEED to KNOW!",
    videoAuthor: "Simon Crowe"
  },
  {
    id: 10,
    name: "SOUNDRAW",
    category: "音樂創作",
    desc: "AI 配樂生成工具，可自訂曲風、節奏與樂器，生成免版權背景音樂。",
    rating: 4.3,
    ratingSource: "綜合評估",
    estimated: true,
    priceTag: "付費",
    price: "$16.99/月起",
    audience: "影片製作者、Podcast 創作者",
    color: "#1e3a5f",
    emoji: "🎧",
    officialUrl: "https://soundraw.io",
    helpUrl: "",
    videoId: "yyUErTSOta0",
    videoTitle: "How to Use SOUNDRAW │AI Music Generator SOUNDRAW",
    videoAuthor: "SOUNDRAW Japan"
  },
  {
    id: 11,
    name: "Udio",
    category: "音樂創作",
    desc: "AI 音樂創作平台，支援多種音樂風格生成，可產生高品質的完整歌曲。",
    rating: 4.2,
    ratingSource: "綜合評估",
    estimated: true,
    priceTag: "免費試用",
    price: "$10/月起",
    audience: "音樂創作者、獨立音樂人",
    color: "#7c3aed",
    emoji: "🎶",
    officialUrl: "https://www.udio.com",
    helpUrl: "",
    videoId: "PDyZHDbQv-U",
    videoTitle: "Udio AI Complete Guide (2026) | Create Studio-Quality AI Music Easily",
    videoAuthor: "FUTURE OF AI"
  },
  {
    id: 12,
    name: "ElevenLabs",
    category: "音樂創作",
    desc: "領先的 AI 語音合成平台，支援文字轉語音、語音克隆與多語言配音。",
    rating: 4.5,
    ratingSource: "G2",
    estimated: false,
    priceTag: "免費試用",
    price: "$5/月起",
    audience: "配音員、Podcast 創作者、開發者",
    color: "#1a1a2e",
    emoji: "🗣️",
    officialUrl: "https://elevenlabs.io",
    helpUrl: "https://elevenlabs.io/docs/introduction",
    videoId: "yDTbAxJ3sKI",
    videoTitle: "How to Use ElevenLabs AI (Complete Beginner Tutorial)",
    videoAuthor: "Kevin Stratvert"
  }
];
