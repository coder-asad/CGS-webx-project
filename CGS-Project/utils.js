//  utils.js
//  Small, dependency-free helpers used across the app.
//  Nothing here touches the DOM or localStorage directly.
 
const Utils = (() => {

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function formatCurrency(amount) {
    const n = Number(amount) || 0;
    return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // "2026-09-12" -> "12 Sep"
  function formatDateShort(isoDate) {
    const d = new Date(isoDate + "T00:00:00");
    if (isNaN(d)) return isoDate;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  }

  function todayIso() {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 10);
  }

  // "2026-09-12" -> "2026-09"
  function monthKeyOf(isoDate) {
    return isoDate.slice(0, 7);
  }

  function monthLabel(monthKey) {
    const [y, m] = monthKey.split("-").map(Number);
    const d = new Date(y, m - 1, 1);
    return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }

  function currentMonthKey() {
    return monthKeyOf(todayIso());
  }

  function downloadCsv(rows, filename) {
    if (!rows.length) return;
    const header = Object.keys(rows[0]);
    const escape = (val) => {
      const s = String(val ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [header.join(",")].concat(
      rows.map((row) => header.map((key) => escape(row[key])).join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return { uid, formatCurrency, formatDateShort, todayIso, monthKeyOf, monthLabel, currentMonthKey, downloadCsv };

})();
