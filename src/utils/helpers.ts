export const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

export const padMealName = (name: string, targetLen = 22) => {
    let len = 0;
    for (let i = 0; i < name.length; i++) {
        // 粗略計算佔位：ASCII 算 1，中文等全型字元算 2
        len += name.charCodeAt(i) > 255 ? 2 : 1;
    }
    const diff = targetLen - len;
    if (diff <= 0) return name + '\u00A0';

    // 使用全型空格 \u3000 (佔 2 單位) 與半型空格 \u00A0 (佔 1 單位) 
    // 這是解決網頁原生下拉選單中英混排對齊的最佳方案
    const fullSpaces = Math.floor(diff / 2);
    const halfSpaces = diff % 2;
    return name + '\u3000'.repeat(fullSpaces) + '\u00A0'.repeat(halfSpaces);
};
