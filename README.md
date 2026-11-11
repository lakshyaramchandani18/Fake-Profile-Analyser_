# Fake Social Media Profile Detection and Reporting System (FPDS)

An enterprise-grade cybersecurity investigation interface and forensics intelligence system developed for an Academic Software Development (ASD) Capstone Project.

## 🛡️ Overview

FPDS provides digital forensics analysts with a multi-layered detection platform to uncover synthetic personas, coordinated bot syndicates, astroturfing campaigns, and deceptive impersonation accounts across major social platforms.

### Core Forensic Pillars
1. **Visual & GAN Face Forensics**: StyleGAN artifact detection, eye-alignment symmetry verification, and reverse perceptual hashing.
2. **Temporal Activity Cadence**: Poisson process analysis of posting frequency, circadian sleep/wake cycle deviation, and automated sub-second bursts.
3. **Ego-Graph Topology**: Reciprocal follower-following subgraphs detecting artificial follower injection farms and dense astroturfing clique rings.
4. **NLP Stylometry & Scripting**: Lexical entropy measurement, repeated payload clustering, and sentiment manipulation detection.
5. **Multi-Factor Risk Synthesis**: Normalized 0–100 Threat Index calculated via weighted Bayesian anomaly markers.

---

## 💻 Tech Stack

- **Markup**: HTML5 Semantic Architecture
- **Styles**: Custom Cyber CSS3 Design System (Zero Frameworks)
- **Scripting**: Pure Vanilla JavaScript (ES6+)
- **Iconography**: Lucide Icons
- **Theme**: High-contrast cybersecurity dark theme (`#0B1120`, `#111827`, `#172033`, `#3B82F6`)

---

## 📁 Project Structure

```
fake_profile/
├── client/
│   ├── index.html              # University ASD portal overview & quick scan launcher
│   ├── dashboard.html          # SOC Forensics Command Center
│   ├── favicon.svg             # Application cybersecurity badge icon
│   ├── css/
│   │   ├── style.css           # Design tokens, variables, typography & layout shell
│   │   ├── components.css      # Reusable buttons, cards, badges, inputs, modals, tables
│   │   └── dashboard.css       # Investigation grid, telemetry stream & deep-dive inspector
│   ├── js/
│   │   ├── app.js              # Icon initialization, heartbeat ping, toasts & shortcuts
│   │   ├── navigation.js       # Responsive sidebar drawer, route state & modal triggers
│   │   ├── dashboard.js        # KPI animations, filterable investigations & profile inspector
│   │   └── mock-data.js        # Forensics telemetry dataset (bot farms, StyleGAN faces)
│   └── assets/
│       └── images/             # Vector assets and badge imagery
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Local Development Server

Run a lightweight HTTP server inside the `client/` directory:

```bash
cd client
python3 -m http.server 8080
```

Open your browser:
- **SOC Forensics Dashboard**: [http://localhost:8080/dashboard.html](http://localhost:8080/dashboard.html)
- **Investigation Portal Overview**: [http://localhost:8080/index.html](http://localhost:8080/index.html)

---

## 📜 Academic Project Scope

Developed as part of the **Advanced Software Development (ASD)** curriculum for automated profile threat intelligence and reporting.
