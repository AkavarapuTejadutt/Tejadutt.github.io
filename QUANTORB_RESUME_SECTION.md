# QuantORB Framework — Resume & Portfolio Integration Guide

This document contains ATS-optimized bullet points, LaTeX code, and portfolio summaries for the **QuantORB Framework** added to Akavarapu Teja Dutt's resume and portfolio.

---

## 1. Resume Entry (Standard ATS Format)

### **QuantORB – Automated Quantitative Trading Framework**
**Technologies:** `Python 3.10+`, `FYERS API v3`, `Angel One SmartAPI`, `WebSockets`, `Pandas`, `Event-Driven Architecture`

- **Architected a 24/7 automated quantitative trading engine** in Python executing the 5-minute Opening Range Breakout (ORB) strategy on Nifty 50 Futures and Equities with sub-second order dispatch.
- **Engineered dual-broker connectivity** via FYERS API v3 and Angel One SmartAPI, ingesting live tick-by-tick WebSocket market feeds with automated TOTP session authentication and token caching.
- **Implemented systematic risk management protocols:** Dynamic 1:4 Risk-to-Reward target calculation, prior-candle trailing stop-loss, candle-close breakout validation (filtering false wicks), and automated 15:10 IST intraday square-off.
- **Built dual-mode execution engines** supporting real-time tick paper trading and live market order routing, alongside a historical replay backtesting simulator (`replay.py`) with crash-resilient session recovery.

---

## 2. Role-Tailored Variations

### A. For Quantitative Developer / Algo Trading Roles
> **QuantORB Framework — High-Frequency / Intraday Strategy Engine**
> * Developed an event-driven ORB algorithmic execution system in Python tailored for Nifty 50 derivatives and equities.
> * Implemented sub-second order dispatch using FYERS API v3 and Angel One SmartConnect WebSocket protocols.
> * Enforced strict 1:4 risk-to-reward parameters with zero overnight risk via automated 15:10 IST EOD square-offs.
> * Formulated a historical replay simulator on 5-minute bar intervals to validate execution efficiency and slippage.

### B. For Python Backend / Systems Engineer Roles
> **QuantORB Framework — Distributed Event-Driven Trading Engine**
> * Designed a multi-broker asynchronous execution service with real-time socket connections to Indian financial exchanges.
> * Engineered automated token refresh routines, fault-tolerant session state serialization, and event logs in CSV/JSON.
> * Implemented strict state machine logic for market opening, range calculation (09:15–09:45 IST), order lifecycle, and exit.

---

## 3. LaTeX / Overleaf Code Snippet

```latex
\resumeProjectHeading
  {\textbf{QuantORB -- Automated Quantitative Trading Framework} $|$ \emph{Python, FYERS API v3, Angel One, WebSockets, Pandas}}{}
  \resumeItemListStart
    \resumeItem{Architected an automated 24/7 quantitative trading engine in Python executing the 5-minute Opening Range Breakout (ORB) strategy on Nifty 50 Futures and Equities with sub-second order dispatch.}
    \resumeItem{Engineered dual-broker connectivity via FYERS API v3 and Angel One SmartAPI, processing live tick-by-tick WebSocket streams with automated TOTP session authentication and token caching.}
    \resumeItem{Implemented systematic risk management: 1:4 dynamic Risk-to-Reward targets, prior-candle trailing stop loss, candle-close breakout validation (filtering false wicks), and automated 15:10 IST square-off.}
    \resumeItem{Built dual-mode execution engines supporting real-time tick paper trading and live market order routing, alongside a historical replay backtesting simulator (\texttt{replay.py}) with crash-resilient session recovery.}
  \resumeItemListEnd
```

---

## 4. What Was Done

1. **QuantORB Framework Added to Resume & Portfolio**:
   - **Portfolio Website (`index.html`)**: Added flagship featured project card with comprehensive technical architecture, GitHub repository links, and an interactive **QuantORB Strategy & Replay Terminal**.
   - **Interactive Terminal Engine (`script.js` & `index.css`)**: Built a live simulator allowing recruiters/visitors to simulate 5-min candle breakouts, switch broker adapters (FYERS / Angel One), test risk targets, and view real-time tick execution logs with simulated +₹20.6k P&L.
   - **Hero & Skills Sections**: Added "Download Resume (PDF)" button, updated GitHub repos count to 7+, added Quantitative Finance to competencies, and added FYERS API / Algo Trading to technical skills.
   - **RAG AI Simulator Knowledge Base**: Added QuantORB Framework vector chunk to the interactive RAG bot in `script.js`.
   - **Resume PDF (`Teja_resume.pdf` & `Tejadutt_Resume.pdf`)**: Replaced the previous `NexusQuant` entry with the production-ready `QuantORB Framework`, formatted and compiled into a single-page ATS-compliant PDF.
   - **LaTeX Source (`resume.tex`)**: Created full source code ready to paste into Overleaf or compile locally.

2. **Anirudh Music Completely Removed**:
   - Removed `<audio id="bg-music">` and the `.mp3` source from `index.html`.
   - Removed the ambient music toggle button (`#music-toggle-btn`) from the navbar.
   - Removed `initBackgroundMusic()` and autoplay click handlers from `script.js`.
   - Removed active music animation keyframes from `index.css`.
   - Deleted the `Anirudh_Ravichander_-_The_Paradise_Theme_OST_From_The_Paradise_(mp3.pm).mp3` file from the workspace.
