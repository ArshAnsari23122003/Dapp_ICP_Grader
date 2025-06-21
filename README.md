# 🎓 Dapp ICP Grader

A fully functional CRUD DApp built on the **Internet Computer (ICP)** using **Rust (backend)** and **React.js (frontend)**. This app stores student data, calculates averages, and assigns grades with a clean, animated UI and dark/light theme support.

---

## ✨ Features

- 📅 Add student name, subject-wise marks, and max marks
- 📊 Calculates average and assigns grades (A/B/C/D)
- 🔍 Search student by name
- 🗑️ Delete student
- 🧱 Grade distribution stats (A, B, C, D)
- 🔄 Sort by name or grade
- 🌑 Dark/Light theme toggle
- 🔔 Toast notifications
- 🧠 All grading logic on frontend (for flexibility)

---

## 🛠️ Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| 🧠 Backend | Rust + Candid (DFINITY SDK) |
| 🌐 Frontend | React.js (custom design)  |
| 🔗 Deploy  | DFX Localnet / Internet Computer |

---

## 📦 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/ArshAnsari23122003/Dapp_ICP_Grader.git
cd Dapp_ICP_Grader
```

### 2. Install DFX SDK

```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

### 3. Start local ICP network

```bash
dfx start --background
```

### 4. Deploy the project

```bash
dfx deploy
```

### 5. Open in browser

```bash
dfx canister frontend-url crud_app_frontend
```

Copy the URL (usually `http://localhost:4943/...`) and open in your browser.

---

## 🚀 Deployment Options

- Local: `dfx start` + `dfx deploy`
- Mainnet: `dfx deploy --network ic` (requires cycles)

---

## 🧠 Grade Criteria

| Percentage | Grade |
|------------|-------|
| 90+        | A     |
| 75–89      | B     |
| 60–74      | C     |
| Below 60   | D     |

---

## 🙌 Credits

Built by [Arsh Ansari](https://github.com/ArshAnsari23122003) during internship 🚀  
Uses the power of Rust, React, and the Internet Computer ✨

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
