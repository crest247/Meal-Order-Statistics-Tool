// backend/Code.js

// 部署為網路應用程式 (Deploy as Web App) 的設定：
// 1. 執行身分: 我 (Me)
// 2. 存取權限: 所有人 (Anyone)

const SPREADSHEET_ID = '1t_EUafkwqdeQRr6rpxHs1MLVeAzjmk58uFxMc5qEIuw'; // <-- 請將此替換為您的 Google 試算表 ID

// 定義試算表的工作表名稱
const MENU_SHEET_NAME = 'Menu';
const SUMMARY_SHEET_NAME = 'OrdersSummary';

/**
 * 處理 GET 請求
 */
function doGet(e) {
  try {
    const action = e.parameter.action || 'getMenu';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (action === 'getOrders') {
      return respond({ success: true, orders: getOrdersData(ss) });
    }

    if (action === 'init') {
      return respond({
        success: true,
        items: getMenuData(ss),
        orders: getOrdersData(ss)
      });
    }

    // --- 預設為 getMenu ---
    return respond({ success: true, items: getMenuData(ss) });

  } catch (err) {
    return respond({ success: false, error: "Backend Error: " + err.message });
  }
}

/**
 * 取得餐點清單資料
 */
function getMenuData(ss) {
  const HEADER_ROW_COUNT = 1;
  const sheet = ss.getSheetByName(MENU_SHEET_NAME);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const items = [];
  for (let i = HEADER_ROW_COUNT; i < data.length; i++) {
    const row = data[i];
    if (row[0]) { // A 欄為餐點名稱
      items.push({
        name: String(row[0]),
        price: Number(row[1])
      });
    }
  }
  return items;
}

/**
 * 取得訂單資料
 */
function getOrdersData(ss) {
  const HEADER_ROW_COUNT = 1;
  const sheet = ss.getSheetByName(SUMMARY_SHEET_NAME);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const orderMap = {};

  for (let i = HEADER_ROW_COUNT; i < data.length; i++) {
    const row = data[i];
    const orderTimestamp = row[0] instanceof Date ? row[0].toISOString().slice(0, 19).replace('T', ' ') : String(row[0]);
    const fillerName = String(row[1]);
    const key = fillerName + '_' + orderTimestamp;
    if (!orderTimestamp) continue;

    if (!orderMap[key]) {
      orderMap[key] = {
        timestamp: orderTimestamp,
        filler_name: fillerName,
        total_price: Number(row[5]), // F 欄 (Index 5)
        items: [],
        items_summary_parts: []
      };
    }
    // 從每行重建 item
    if (row[2] && row[3] && row[4]) {
      const quantity = Number(row[3]);
      const subtotal = Number(row[4]);
      const price = subtotal / quantity;
      orderMap[key].items.push({
        id: 'item-' + i,
        meal: { name: String(row[2]), price: price },
        quantity: quantity,
        subtotal: subtotal
      });
      orderMap[key].items_summary_parts.push(String(row[2]) + " × " + String(row[3]));
    }
  }

  return Object.values(orderMap).map(function (o) {
    o.items_summary = o.items_summary_parts.join('\n');
    delete o.items_summary_parts;
    return o;
  });
}

/**
 * 處理 POST 請求 (提交、更新或刪除訂單)
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const filler_name = payload.filler_name;
    const timestamp = payload.timestamp; // 用於刪除舊記錄

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SUMMARY_SHEET_NAME);
    if (!sheet) return respond({ success: false, error: "OrdersSummary sheet not found" });

    // 1. 先刪除所有具有相同 filler_name 和 timestamp 的舊列 (如果是編輯更新或直接刪除)
    const HEADER_ROW_COUNT = 1;
    const data = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i >= HEADER_ROW_COUNT; i--) {
      const rowTimestamp = data[i][0] instanceof Date ? data[i][0].toISOString().slice(0, 19).replace('T', ' ') : String(data[i][0]);
      if (rowTimestamp === timestamp && String(data[i][1]) === filler_name) {
        sheet.deleteRow(i + 1);
      }
    }

    // 2. 如果 payload 中包含 delete: true，則直接結束 (已完成刪除)
    if (payload.delete === true) {
      return respond({ success: true, message: "Order deleted!" });
    }

    // 3. 逐行寫入新資料 (提交或更新)
    const items = payload.items;
    const grand_total = payload.total_price;
    const newTimestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"); // 編輯時更新時間

    // 欄位: A:時間, B:姓名, C:餐點, D:數量, E:小計, F:總計
    items.forEach(function (item) {
      sheet.appendRow([
        newTimestamp,
        filler_name,
        item.meal.name,
        item.quantity,
        item.subtotal,
        grand_total
      ]);
    });

    return respond({ success: true, message: "OK" });
  } catch (err) {
    return respond({ success: false, error: err.message });
  }
}

/**
 * 處理 CORS 及回傳 JSON 格式的輔助函式
 */
function respond(responseObj) {
  // 將結果轉成 JSON 字串
  return ContentService.createTextOutput(JSON.stringify(responseObj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 處理 OPTIONS 請求 (解決 CORS 預檢問題)
 */
function doOptions(e) {
  return respond({ success: true });
}
