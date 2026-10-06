  // app.js
  // Wires up the DOM, holds the in-memory state, and re-renders whenever
  // that state changes. Storage.js and Utils.js do the heavy lifting;
  // this file is mostly "read state -> update the page".

(() => {

  const state = {
    expenses: [],
    budget: null,
    editingId: null,
    filters: {
      month: Utils.currentMonthKey(),
      category: "all",
      sort: "date-desc",
    },
  };

  // ---- DOM references ----
  const el = {
    form: document.getElementById("expenseForm"),
    amount: document.getElementById("fAmount"),
    category: document.getElementById("fCategory"),
    date: document.getElementById("fDate"),
    desc: document.getElementById("fDesc"),

    monthFilter: document.getElementById("monthFilter"),
    categoryFilter: document.getElementById("categoryFilter"),
    sortBy: document.getElementById("sortBy"),
    exportCsv: document.getElementById("exportCsv"),

    entriesBody: document.getElementById("entriesBody"),
    emptyState: document.getElementById("emptyState"),

    totalSpent: document.getElementById("totalSpent"),
    budgetInput: document.getElementById("budgetInput"),
    budgetSave: document.getElementById("budgetSave"),
    budgetStatus: document.getElementById("budgetStatus"),
    budgetStatusLabel: document.getElementById("budgetStatusLabel"),
    budgetBar: document.getElementById("budgetBar"),
    budgetBarFill: document.getElementById("budgetBarFill"),

    chartCanvas: document.getElementById("categoryChart"),
    chartEmpty: document.getElementById("chartEmpty"),
    categoryLegend: document.getElementById("categoryLegend"),

    themeToggle: document.getElementById("themeToggle"),
    iconSun: document.getElementById("iconSun"),
    iconMoon: document.getElementById("iconMoon"),
  };

  // ---- setup ----

  function populateCategorySelects() {
    const optionsHtml = Storage.CATEGORIES
      .map((c) => `<option value="${c.id}">${c.label}</option>`)
      .join("");
    el.category.innerHTML = optionsHtml;
    el.categoryFilter.insertAdjacentHTML("beforeend", optionsHtml);
  }

  function populateMonthFilter() {
    const monthsWithData = new Set(state.expenses.map((e) => Utils.monthKeyOf(e.date)));
    monthsWithData.add(Utils.currentMonthKey());
    const months = Array.from(monthsWithData).sort().reverse();

    const current = state.filters.month;
    el.monthFilter.innerHTML =
      `<option value="all">All time</option>` +
      months.map((m) => `<option value="${m}">${Utils.monthLabel(m)}</option>`).join("");
    el.monthFilter.value = months.includes(current) ? current : "all";
    state.filters.month = el.monthFilter.value;
  }

  function init() {
    state.expenses = Storage.loadExpenses();
    state.budget = Storage.loadBudget();

    populateCategorySelects();
    populateMonthFilter();
    el.date.value = Utils.todayIso();
    if (state.budget !== null) el.budgetInput.value = state.budget;

    applyTheme(Storage.loadTheme());

    el.form.addEventListener("submit", onAddExpense);
    el.monthFilter.addEventListener("change", () => { state.filters.month = el.monthFilter.value; render(); });
    el.categoryFilter.addEventListener("change", () => { state.filters.category = el.categoryFilter.value; render(); });
    el.sortBy.addEventListener("change", () => { state.filters.sort = el.sortBy.value; render(); });
    el.exportCsv.addEventListener("click", onExportCsv);
    el.budgetSave.addEventListener("click", onSaveBudget);
    el.themeToggle.addEventListener("click", onToggleTheme);
    el.entriesBody.addEventListener("click", onTableClick);

    render();
  }

  // ---- derived data ----

  function getFilteredExpenses() {
    const { month, category } = state.filters;
    let list = state.expenses.filter((e) => {
      const monthOk = month === "all" || Utils.monthKeyOf(e.date) === month;
      const catOk = category === "all" || e.category === category;
      return monthOk && catOk;
    });

    const [key, dir] = state.filters.sort.split("-");
    list.sort((a, b) => {
      let cmp = key === "amount" ? a.amount - b.amount : a.date.localeCompare(b.date);
      return dir === "desc" ? -cmp : cmp;
    });
    return list;
  }

  function totalsByCategory(list) {
    const totals = {};
    for (const e of list) totals[e.category] = (totals[e.category] || 0) + e.amount;
    return totals;
  }

  // ---- rendering ----

  function render() {
    const filtered = getFilteredExpenses();
    renderTable(filtered);
    renderTotals(filtered);
    renderBudget(filtered);
    renderChart(filtered);
  }

  function renderTable(list) {
    el.emptyState.hidden = list.length > 0;
    el.entriesBody.innerHTML = list.map((e) => rowHtml(e)).join("");
  }

  function rowHtml(e) {
    if (state.editingId === e.id) return editRowHtml(e);
    const cat = Storage.categoryById(e.category);
    return `
      <tr data-id="${e.id}">
        <td class="cell-date">${Utils.formatDateShort(e.date)}</td>
        <td class="col-desc">${escapeHtml(e.description)}</td>
        <td class="col-cat">
          <span class="cat-tag">
            <span class="cat-tag__swatch" style="background:${cat.color}"></span>
            ${cat.label}
          </span>
        </td>
        <td class="cell-amt">${Utils.formatCurrency(e.amount)}</td>
        <td class="col-actions">
          <div class="row-actions">
            <button type="button" data-action="edit">edit</button>
            <button type="button" data-action="delete">delete</button>
          </div>
        </td>
      </tr>`;
  }

  function editRowHtml(e) {
    const options = Storage.CATEGORIES
      .map((c) => `<option value="${c.id}" ${c.id === e.category ? "selected" : ""}>${c.label}</option>`)
      .join("");
    return `
      <tr data-id="${e.id}" class="is-editing">
        <td><input type="date" data-field="date" value="${e.date}"></td>
        <td><input type="text" data-field="description" value="${escapeAttr(e.description)}"></td>
        <td><select data-field="category">${options}</select></td>
        <td class="cell-amt"><input type="number" step="0.01" min="0.01" data-field="amount" value="${e.amount}"></td>
        <td class="col-actions">
          <div class="row-actions">
            <button type="button" data-action="save">save</button>
            <button type="button" data-action="cancel">cancel</button>
          </div>
        </td>
      </tr>`;
  }

  function renderTotals(filtered) {
    const total = filtered.reduce((sum, e) => sum + e.amount, 0);
    el.totalSpent.textContent = Utils.formatCurrency(total);
  }

  function renderBudget(filtered) {
    if (state.budget === null) {
      el.budgetStatus.textContent = "no limit set";
      el.budgetStatus.className = "summary-strip__value summary-strip__value--status";
      el.budgetBar.hidden = true;
      return;
    }

    // budget only makes sense against a single month's spending
    const monthKey = state.filters.month === "all" ? Utils.currentMonthKey() : state.filters.month;
    const monthTotal = state.expenses
      .filter((e) => Utils.monthKeyOf(e.date) === monthKey)
      .reduce((sum, e) => sum + e.amount, 0);

    const ratio = monthTotal / state.budget;
    el.budgetBar.hidden = false;
    el.budgetBarFill.style.width = Math.min(ratio, 1) * 100 + "%";
    el.budgetBarFill.classList.remove("is-warn", "is-over");
    el.budgetStatus.classList.remove("is-ok", "is-warn", "is-over");

    if (ratio >= 1) {
      el.budgetStatus.textContent = "over the limit";
      el.budgetStatus.classList.add("is-over");
      el.budgetBarFill.classList.add("is-over");
    } else if (ratio >= 0.8) {
      el.budgetStatus.textContent = "cutting it close";
      el.budgetStatus.classList.add("is-warn");
      el.budgetBarFill.classList.add("is-warn");
    } else {
      el.budgetStatus.textContent = "within limit";
      el.budgetStatus.classList.add("is-ok");
    }
    el.budgetStatusLabel.textContent = `Status — ${Utils.monthLabel(monthKey)}`;
  }

  function renderChart(filtered) {
    const totals = totalsByCategory(filtered);
    const hasData = Charting.renderCategoryChart(el.chartCanvas, totals, Storage.CATEGORIES);
    el.chartEmpty.hidden = hasData;

    const total = filtered.reduce((sum, e) => sum + e.amount, 0);
    const rows = Storage.CATEGORIES
      .map((c) => ({ c, amt: totals[c.id] || 0 }))
      .filter((r) => r.amt > 0)
      .sort((a, b) => b.amt - a.amt);

    el.categoryLegend.innerHTML = rows.map(({ c, amt }) => `
      <li>
        <span class="legend-name"><span class="legend-swatch" style="background:${c.color}"></span>${c.label}</span>
        <span class="legend-amount">${Utils.formatCurrency(amt)} · ${Math.round((amt / total) * 100)}%</span>
      </li>`).join("");
  }

  // ---- event handlers ----

  function onAddExpense(evt) {
    evt.preventDefault();
    const expense = {
      id: Utils.uid(),
      amount: Number(el.amount.value),
      category: el.category.value,
      date: el.date.value,
      description: el.desc.value.trim(),
    };
    if (!expense.description || !(expense.amount > 0)) return;

    state.expenses.push(expense);
    Storage.saveExpenses(state.expenses);

    el.form.reset();
    el.date.value = Utils.todayIso();
    el.amount.focus();

    populateMonthFilter();
    render();
  }

  function onTableClick(evt) {
    const button = evt.target.closest("button[data-action]");
    if (!button) return;
    const row = button.closest("tr");
    const id = row.dataset.id;
    const action = button.dataset.action;

    if (action === "delete") return onDeleteExpense(id);
    if (action === "edit") { state.editingId = id; render(); }
    if (action === "cancel") { state.editingId = null; render(); }
    if (action === "save") return onSaveEdit(id, row);
  }

  function onDeleteExpense(id) {
    const expense = state.expenses.find((e) => e.id === id);
    if (!expense) return;
    const ok = confirm(`Delete "${expense.description}" for ${Utils.formatCurrency(expense.amount)}?`);
    if (!ok) return;
    state.expenses = state.expenses.filter((e) => e.id !== id);
    Storage.saveExpenses(state.expenses);
    populateMonthFilter();
    render();
  }

  function onSaveEdit(id, row) {
    const expense = state.expenses.find((e) => e.id === id);
    if (!expense) return;

    const get = (field) => row.querySelector(`[data-field="${field}"]`).value;
    const amount = Number(get("amount"));
    const description = get("description").trim();
    if (!description || !(amount > 0)) return;

    expense.amount = amount;
    expense.description = description;
    expense.category = get("category");
    expense.date = get("date");

    Storage.saveExpenses(state.expenses);
    state.editingId = null;
    populateMonthFilter();
    render();
  }

  function onExportCsv() {
    const rows = getFilteredExpenses().map((e) => ({
      date: e.date,
      description: e.description,
      category: Storage.categoryById(e.category).label,
      amount: e.amount.toFixed(2),
    }));
    if (!rows.length) { alert("Nothing to export for the current filters."); return; }
    const label = state.filters.month === "all" ? "all-time" : state.filters.month;
    Utils.downloadCsv(rows, `hisaab-${label}.csv`);
  }

  function onSaveBudget() {
    const value = el.budgetInput.value === "" ? null : Number(el.budgetInput.value);
    state.budget = value;
    Storage.saveBudget(value);
    render();
  }

  function onToggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    Storage.saveTheme(next);
    render(); // chart colours are read from CSS vars, so it needs a redraw
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
    el.iconSun.style.display = theme === "dark" ? "none" : "block";
    el.iconMoon.style.display = theme === "dark" ? "block" : "none";
  }

  // ---- tiny helpers kept local since they're only used for rendering ----

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[ch]));
  }
  function escapeAttr(str) { return escapeHtml(str); }

  document.addEventListener("DOMContentLoaded", init);

})();
