# 💰 Hisaab — Interactive Expense Tracker

A simple, responsive, browser-based **Expense Tracker** built using HTML, CSS, and JavaScript.

Hisaab helps users record, manage, filter, sort, and analyse their daily expenses. All expense data is stored in the browser using **localStorage**, so the data remains available even after refreshing the page.

---

## ✨ Features

### Core Features

* ➕ Add new expenses

  * Amount
  * Category
  * Date
  * Description
* 📋 View all recorded expenses
* 🔍 Filter expenses by category and month
* 💰 Calculate and display total expenditure
* 📊 Display category-wise spending using a doughnut chart
* 💾 Persist expense data using browser `localStorage`
* 📱 Responsive design for desktop and mobile devices

### Additional Features

* ✏️ Edit existing expenses
* 🗑️ Delete expenses
* 📅 Monthly spending view
* 💵 Set a monthly budget
* ⚠️ Budget warning when spending exceeds the limit
* 🌙 Dark mode
* 📥 Export expenses as CSV
* ↕️ Sort expenses
* 🔄 Chart automatically updates when expenses change

---

## 🛠️ Technologies Used

* **HTML5** — Structure of the application
* **CSS3** — Styling and responsive layout
* **JavaScript (ES6+)** — Application logic and interactivity
* **Chart.js** — Category-wise expense visualization
* **localStorage** — Persistent browser-side data storage

No backend or database server is required.

---

## 📁 Project Structure

```text
expense-tracker/
│
├── index.html
├── styles.css
├── app.js
├── storage.js
├── utils.js
├── charting.js
└── README.md
```

### File Description

| File          | Purpose                                              |
| ------------- | ---------------------------------------------------- |
| `index.html`  | Main webpage structure and UI                        |
| `styles.css`  | Styling, layout, responsive design and dark mode     |
| `app.js`      | Main application logic and event handling            |
| `storage.js`  | Handles saving and retrieving data from localStorage |
| `utils.js`    | Utility/helper functions                             |
| `charting.js` | Creates and updates the expense chart                |
| `README.md`   | Project documentation                                |

---

## 🚀 How to Run Locally

### Method 1 — Using VS Code Live Server

1. Clone or download this repository.
2. Open the project folder in **VS Code**.
3. Make sure all project files are in the same folder.
4. Open `index.html`.
5. Right-click on `index.html`.
6. Select **Open with Live Server**.
7. The application will open in your browser.

### Method 2 — Directly in Browser

Since this is a frontend-only project, you can also open:

```text
index.html
```

directly in a modern web browser.

---

## 🧪 How to Test

The following tests can be used to verify the application.

### 1. Add Expense

Enter:

* Amount
* Category
* Date
* Description

Click the **Add Expense** button.

Expected result:

* The expense appears in the expense table.
* Total expenditure updates.
* The category chart updates.

---

### 2. Test Multiple Expenses

Add expenses from different categories, for example:

```text
Food       ₹200
Transport  ₹100
Shopping   ₹500
Food       ₹150
```

Expected result:

* All expenses appear in the table.
* Total expenditure is calculated correctly.
* The chart displays the spending distribution by category.

---

### 3. Test Filtering

Use the category/month filters to display only selected expenses.

Expected result:

* The table shows only expenses matching the selected filter.
* The displayed totals/chart update accordingly.

---

### 4. Test Sorting

Use the sorting option to sort expenses according to the available sorting choices.

Expected result:

* Expenses are reordered correctly.

---

### 5. Test Edit

Select an existing expense and edit its information.

Expected result:

* The updated information appears in the table.
* Total expenditure and chart are updated.

---

### 6. Test Delete

Delete an existing expense.

Expected result:

* The expense is removed.
* Total expenditure is recalculated.
* The chart updates.

---

### 7. Test localStorage

1. Add several expenses.
2. Refresh the browser.

Expected result:

* Previously added expenses are still available.

This verifies that the application is using browser `localStorage` for persistence.

---

### 8. Test Monthly Budget

Set a monthly budget and add expenses.

Expected result:

* The budget information is displayed.
* A warning is shown when spending exceeds the configured budget.

---

### 9. Test Dark Mode

Toggle the dark mode option.

Expected result:

* The application's theme changes.
* The selected theme remains after refreshing the page.

---

### 10. Test CSV Export

Add some expenses and use the CSV export option.

Expected result:

* The expense data is downloaded as a `.csv` file.

---

### 11. Test Responsive Design

Test the application on:

* Desktop
* Tablet
* Mobile

Expected result:

* The layout remains usable.
* Form fields, table, chart, and controls adapt to smaller screen sizes.

---

## 💾 Data Storage

The application does not require a backend database.

Expense information is stored using the browser's:

```javascript
localStorage
```

The application stores:

* Expenses
* Monthly budget
* Selected theme

This means data remains available after refreshing the page on the same browser/device.

---

## 📊 Expense Analysis

The application provides a category-wise visual breakdown of expenses using **Chart.js**.

For example:

```text
Food        ₹350
Transport   ₹100
Shopping    ₹500
```

The chart represents how the total spending is distributed between these categories.

The chart is updated whenever expenses are added, edited, deleted, or filtered.

---

## 📱 Responsive Design

The application is designed to work on different screen sizes.

The layout adapts for:

* Desktop screens
* Tablets
* Mobile phones

CSS media queries are used to adjust the layout for smaller screens.

---

## 🎯 Task Requirements Covered

This project covers the main requirements of the WebX **Frontend — Interactive Expense Tracker** task:

* [x] Add expenses
* [x] Display expenses
* [x] Filter expenses
* [x] Calculate total expenditure
* [x] Category-wise chart
* [x] Persistent data using localStorage
* [x] Responsive design
* [x] Monthly spending view
* [x] Edit expenses
* [x] Delete expenses
* [x] Budget limit and warning
* [x] Dark mode
* [x] CSV export
* [x] Sorting

---

## 🔒 Privacy

All expense data is stored locally in the user's browser.

No expense information is sent to a backend server by this application.

---

## 🌐 Deployment

This project can be deployed as a static website using services such as:

* GitHub Pages
* Netlify
* Vercel

Because the application is frontend-only, no backend server is required.

---

## 👨‍💻 Author

**Mohd Asad**

WebX Selection Task — Frontend
Interactive Expense Tracker

---

## 📌 Notes

Make sure the filenames referenced in `index.html` exactly match the actual filenames in the repository.

The recommended project filenames are:

```text
index.html
styles.css
app.js
storage.js
utils.js
charting.js
```

Keeping the filenames consistent is important because incorrect file paths can prevent the CSS or JavaScript from loading correctly.
