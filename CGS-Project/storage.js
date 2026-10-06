//  storage.js
//  Everything that talks to localStorage lives here, so the rest of the
//  app just deals with plain arrays and numbers.
 

const Storage = (() => {

  const KEYS = {
    EXPENSES: "hisaab.expenses",
    BUDGET: "hisaab.monthlyBudget",
    THEME: "hisaab.theme",
  };

  const CATEGORIES = [
    { id: "chai",      label: "Chai & snacks",     color: "var(--cat-1)" },
    { id: "delivery",  label: "Food delivery",     color: "var(--cat-2)" },
    { id: "mess",      label: "Mess & groceries",  color: "var(--cat-3)" },
    { id: "transport", label: "Transport",         color: "var(--cat-4)" },
    { id: "stationery",label: "Stationery & books",color: "var(--cat-5)" },
    { id: "fun",       label: "Entertainment",     color: "var(--cat-6)" },
    { id: "subs",      label: "Subscriptions",     color: "var(--cat-7)" },
    { id: "misc",      label: "Misc",              color: "var(--cat-8)" },
  ];

  function categoryById(id) {
    return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
  }

  function loadExpenses() {
    try {
      const raw = localStorage.getItem(KEYS.EXPENSES);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Hisaab: could not read stored expenses, starting fresh.", err);
      return [];
    }
  }

  function saveExpenses(expenses) {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
  }

  function loadBudget() {
    const raw = localStorage.getItem(KEYS.BUDGET);
    return raw ? Number(raw) : null;
  }

  function saveBudget(amount) {
    if (amount === null || Number.isNaN(amount)) {
      localStorage.removeItem(KEYS.BUDGET);
    } else {
      localStorage.setItem(KEYS.BUDGET, String(amount));
    }
  }

  function loadTheme() {
    return localStorage.getItem(KEYS.THEME) || "light";
  }

  function saveTheme(theme) {
    localStorage.setItem(KEYS.THEME, theme);
  }

  return { CATEGORIES, categoryById, loadExpenses, saveExpenses, loadBudget, saveBudget, loadTheme, saveTheme };

})();
