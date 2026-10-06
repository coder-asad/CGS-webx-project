/**
 * charting.js
 * Thin wrapper around Chart.js so app.js doesn't need to know about
 * chart internals or manage the instance lifecycle itself.
 */

const Charting = (() => {

  let chartInstance = null;

  function resolveColor(cssVarOrColor) {
    if (!cssVarOrColor.startsWith("var(")) return cssVarOrColor;
    const name = cssVarOrColor.slice(4, -1).trim();
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function renderCategoryChart(canvas, totalsByCategory, categories) {
    const entries = categories
      .map((cat) => ({ cat, total: totalsByCategory[cat.id] || 0 }))
      .filter((e) => e.total > 0);

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    if (!entries.length) return false;

    const ink = resolveColor("var(--ink)");
    const paper = resolveColor("var(--paper)");

    chartInstance = new Chart(canvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: entries.map((e) => e.cat.label),
        datasets: [{
          data: entries.map((e) => e.total),
          backgroundColor: entries.map((e) => resolveColor(e.cat.color)),
          borderColor: paper,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: ink,
            titleFont: { family: "Source Serif 4" },
            bodyFont: { family: "Space Mono" },
            callbacks: {
              label: (ctx) => " ₹" + Number(ctx.parsed).toLocaleString("en-IN", { minimumFractionDigits: 2 }),
            },
          },
        },
      },
    });
    return true;
  }

  return { renderCategoryChart };

})();
