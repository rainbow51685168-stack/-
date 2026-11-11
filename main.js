// ====================================================================
// 【超出範圍】本檔案全部為 JavaScript，課程僅教授 HTML 與 CSS。
// 是什麼：JavaScript 是在瀏覽器裡執行的程式語言，可以讀取、修改網頁內容並回應使用者操作。
// 為什麼：以下功能無法只用 HTML / CSS 做到：
//   - 依 tools-data.js 的資料動態產生卡片（DOM 操作）
//   - 搜尋即時過濾、類別切換、進階篩選（事件監聽）
//   - 進階篩選面板展開 / 收合
//   - 點擊卡片後切換到預覽頁面、返回卡片牆（單頁切換）
//   - 語音 / 圖片搜尋按鈕的「即將推出」提示
//
// 顯示與隱藏的做法：對元素加上或移除 style.css 最下方的 .is-hidden（display: none）。
// 工具資料 tools 定義在 tools-data.js，必須比本檔案先載入。
// ====================================================================

// ===== DOM 元素 =====
const toolsGrid = document.getElementById("toolsGrid");
const searchInput = document.getElementById("searchInput");
const categoryTabs = document.querySelectorAll(".category-tab");
const listView = document.getElementById("listView");
const toolPreview = document.getElementById("toolPreview");
const noResults = document.getElementById("noResults");
const ratingNote = document.getElementById("ratingNote");
const toast = document.getElementById("toast");

let currentCategory = "all";

// ===== 評分文字：固定顯示一位小數，估計值加上 * =====
function formatRating(tool) {
  return tool.rating.toFixed(1) + (tool.estimated ? "*" : "");
}

// ===== 渲染卡片 =====
function renderCards() {
  toolsGrid.innerHTML = "";
  const keyword = searchInput.value.trim().toLowerCase();

  // 進階篩選
  const filterCat = document.getElementById("filterCategory").value;
  const priceChecks = document.querySelectorAll(".price-filter:checked");
  const allowedPrices = Array.from(priceChecks).map(cb => cb.value);
  const minRating = parseFloat(document.getElementById("ratingFilter").value);

  let visibleCount = 0;

  tools.forEach(tool => {
    // 類別篩選
    const catMatch = currentCategory === "all" || tool.category === currentCategory;
    const filterCatMatch = filterCat === "all" || tool.category === filterCat;

    // 關鍵字搜尋
    const keywordMatch = !keyword ||
      tool.name.toLowerCase().includes(keyword) ||
      tool.desc.toLowerCase().includes(keyword) ||
      tool.category.toLowerCase().includes(keyword);

    // 價格篩選
    const priceMatch = allowedPrices.includes(tool.priceTag);

    // 評分篩選
    const ratingMatch = tool.rating >= minRating;

    if (catMatch && filterCatMatch && keywordMatch && priceMatch && ratingMatch) {
      visibleCount++;
      const card = document.createElement("div");
      card.className = "tool-card";

      // 價格標籤樣式
      let tagClass = "tag-free";
      if (tool.priceTag === "免費試用") tagClass = "tag-freemium";
      if (tool.priceTag === "付費") tagClass = "tag-paid";

      card.innerHTML =
        '<div class="card-header">' +
          '<div class="card-icon" style="background-color: ' + tool.color + ';">' + tool.emoji + '</div>' +
          '<div>' +
            '<h3 class="card-name">' + tool.name + '</h3>' +
            '<span class="card-rating">★ ' + formatRating(tool) + ' / 5.0</span>' +
          '</div>' +
        '</div>' +
        '<p class="card-desc">' + tool.desc + '</p>' +
        '<div class="card-meta">' +
          '<span class="tag ' + tagClass + '">' + tool.priceTag + '</span>' +
          '<span class="card-price">' + tool.price + '</span>' +
          '<span class="category-label">' + tool.category + '</span>' +
        '</div>' +
        '<button class="view-btn">查看工具</button>';

      // 點擊卡片 → 開啟預覽
      card.addEventListener("click", function() {
        openPreview(tool);
      });

      toolsGrid.appendChild(card);
    }
  });

  // 顯示/隱藏「無結果」提示與評分註記
  if (visibleCount === 0) {
    noResults.classList.remove("is-hidden");
    ratingNote.classList.add("is-hidden");
  } else {
    noResults.classList.add("is-hidden");
    ratingNote.classList.remove("is-hidden");
  }
}

// ===== 開啟預覽頁面 =====
function openPreview(tool) {
  // 填入資料
  document.getElementById("previewIcon").style.backgroundColor = tool.color;
  document.getElementById("previewIcon").textContent = tool.emoji;
  document.getElementById("previewTitle").textContent = tool.name;
  document.getElementById("previewName").textContent = tool.name + " 介紹";
  document.getElementById("previewDesc").textContent = tool.desc;
  document.getElementById("previewRating").textContent = "★ " + formatRating(tool) + " / 5.0";
  document.getElementById("previewSource").textContent =
    tool.estimated ? tool.ratingSource + "（估計值）" : tool.ratingSource;
  document.getElementById("previewPriceTag").textContent = tool.priceTag;
  document.getElementById("previewPrice").textContent =
    tool.priceTag === "免費試用" ? "免費額度，付費 " + tool.price : tool.price;
  document.getElementById("previewCategory").textContent = tool.category;
  document.getElementById("previewAudience").textContent = tool.audience;
  document.getElementById("previewOfficialLink").href = tool.officialUrl;

  var iframe = document.getElementById("previewIframe");
  var fallback = document.getElementById("iframeFallback");
  var videoNote = document.getElementById("videoNote");
  var helpLink = document.getElementById("previewHelpLink");
  var watchUrl = "https://www.youtube.com/watch?v=" + tool.videoId;

  // 教學影片：可以嵌入就用 iframe 顯示 YouTube，否則顯示替代內容
  // （瀏覽器不會告訴網頁「iframe 被對方網站擋下」，所以無法事後偵測載入失敗，
  //   只能事先判斷要顯示影片還是替代內容）
  // 直接點兩下用檔案開啟網頁（網址是 file:// 開頭）時，YouTube 會拒絕嵌入播放並顯示「錯誤 153」，
  // 因為它要求嵌入影片的網頁必須來自網站伺服器（http:// 或 https://）
  var openedAsFile = location.protocol === "file:";
  var fallbackText = document.getElementById("fallbackText");
  var fallbackLink = document.getElementById("fallbackLink");

  if (tool.videoId && !openedAsFile) {
    iframe.src = "https://www.youtube.com/embed/" + tool.videoId;
    iframe.classList.remove("is-hidden");
    fallback.classList.add("is-hidden");
  } else {
    iframe.src = "about:blank";
    iframe.classList.add("is-hidden");
    fallback.classList.remove("is-hidden");
    if (tool.videoId) {
      fallbackText.textContent = "🚫 直接以檔案開啟網頁時，YouTube 不允許嵌入播放。請將網站放到網站伺服器上再開啟，或直接到 YouTube 觀看。";
      fallbackLink.textContent = "在 YouTube 觀看教學影片 →";
      fallbackLink.href = watchUrl;
    } else {
      fallbackText.textContent = "🚫 此工具目前沒有可在預覽視窗中顯示的教學內容";
      fallbackLink.textContent = "前往官方網站 →";
      fallbackLink.href = tool.officialUrl;
    }
  }

  // 影片下方的標題與 YouTube 連結
  if (tool.videoId) {
    document.getElementById("videoTitle").textContent = tool.videoTitle;
    document.getElementById("videoAuthor").textContent = tool.videoAuthor;
    document.getElementById("videoLink").href = watchUrl;
    videoNote.classList.remove("is-hidden");
  } else {
    videoNote.classList.add("is-hidden");
  }

  // 教學連結：優先連到官方說明文件，沒有的話連到 YouTube 教學影片
  if (tool.helpUrl) {
    helpLink.href = tool.helpUrl;
    helpLink.textContent = "官方說明文件 →";
    helpLink.classList.remove("is-hidden");
  } else if (tool.videoId) {
    helpLink.href = watchUrl;
    helpLink.textContent = "YouTube 教學影片 →";
    helpLink.classList.remove("is-hidden");
  } else {
    helpLink.classList.add("is-hidden");
  }

  // 切換畫面：隱藏列表、顯示預覽
  listView.classList.add("is-hidden");
  toolPreview.classList.remove("is-hidden");

  // 捲動到頂部
  window.scrollTo(0, 0);
}

// ===== 返回卡片牆 =====
function closePreview() {
  toolPreview.classList.add("is-hidden");
  listView.classList.remove("is-hidden");
  // 清空 iframe，影片才會停止播放
  document.getElementById("previewIframe").src = "about:blank";
  window.scrollTo(0, 0);
}

// ===== 類別標籤切換 =====
categoryTabs.forEach(function(tab) {
  tab.addEventListener("click", function() {
    categoryTabs.forEach(function(t) { t.classList.remove("category-tab-active"); });
    tab.classList.add("category-tab-active");
    currentCategory = tab.value;
    renderCards();
  });
});

// ===== 搜尋即時過濾 =====
searchInput.addEventListener("input", renderCards);
document.getElementById("searchBtn").addEventListener("click", renderCards);

// ===== 進階篩選面板切換 =====
document.getElementById("filterToggle").addEventListener("click", function() {
  var panel = document.getElementById("advancedFilter");
  if (panel.classList.contains("is-hidden")) {
    panel.classList.remove("is-hidden");
    this.textContent = "▲ 收起篩選";
  } else {
    panel.classList.add("is-hidden");
    this.textContent = "▼ 進階篩選";
  }
});

// ===== 進階篩選變更時重新渲染 =====
function updateRatingDisplay() {
  var value = document.getElementById("ratingFilter").value;
  document.getElementById("ratingDisplay").textContent = parseFloat(value).toFixed(1);
}

document.getElementById("filterCategory").addEventListener("change", renderCards);
document.querySelectorAll(".price-filter").forEach(function(cb) {
  cb.addEventListener("change", renderCards);
});
document.getElementById("ratingFilter").addEventListener("input", function() {
  updateRatingDisplay();
  renderCards();
});

// 按下「重設篩選」(<input type="reset">) 時，瀏覽器會在這個事件結束之後才把欄位改回預設值，
// 所以用 setTimeout 等它改完再重新渲染
document.getElementById("advancedFilter").addEventListener("reset", function() {
  setTimeout(function() {
    updateRatingDisplay();
    renderCards();
  }, 0);
});

// ===== 返回按鈕 =====
document.getElementById("backBtn").addEventListener("click", closePreview);

// ===== Logo 與導覽列 =====
document.getElementById("logoBtn").addEventListener("click", function() {
  closePreview();
});
document.getElementById("navHome").addEventListener("click", function(e) {
  e.preventDefault();
  closePreview();
});
document.getElementById("navCategory").addEventListener("click", function(e) {
  e.preventDefault();
  closePreview();
  // 捲動到類別標籤
  document.getElementById("categoryTabs").scrollIntoView({ behavior: "smooth" });
});
// 「關於」是頁內書籤連結（#about）：先切回列表讓關於區塊出現，瀏覽器再自己跳過去
document.getElementById("navAbout").addEventListener("click", function() {
  closePreview();
});

// ===== 語音 / 圖片搜尋按鈕 (UI only) =====
function showToast() {
  toast.classList.remove("is-hidden");
  setTimeout(function() {
    toast.classList.add("is-hidden");
  }, 2000);
}
document.getElementById("voiceBtn").addEventListener("click", showToast);
document.getElementById("imageBtn").addEventListener("click", showToast);

// ===== 初始渲染 =====
renderCards();
