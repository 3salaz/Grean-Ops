# Grean Ops Automation — System Overview & Implementation Plan

This README documents the full architecture, goals, logic, and implementation plan for the **Grean Ops Automation System**, a separate Firebase project responsible for connecting Slack, Trello, GitHub, and Google Drive into a unified operational backend.

---

## 🚀 Purpose of This Project

The **Grean Ops Automation Project** is a dedicated backend service that powers all internal automations for Grean. It runs independently from the client and driver apps, ensuring clean separation between public-facing logic and internal operational workflows.

This project handles:

- Slack → Trello issue creation
- Slack → Google Drive evidence logging
- Slack → GitHub developer notifications
- GitHub → Slack CI/CD + PR notifications
- GitHub → Trello issue syncing
- Google Drive → Slack notifications for SOPs, Legal, Engineering docs
- Trello → Slack/GitHub sync (future)

This backend acts as the **internal nervous system** of Grean.

---

# 📦 Project Structure

The project is built entirely on Firebase Cloud Functions, with no client-side app.

```
functions/
  src/
    index.ts
    slack/
      events.ts
      commands.ts
      actions.ts
      slackRouter.ts
    github/
      webhook.ts
    trello/
      sync.ts
    drive/
      hooks.ts
    common/
      logger.ts
      secrets.ts
      http.ts
      slackClient.ts
      trelloClient.ts
      githubClient.ts
      firestore.ts
```

### Why this structure?

- **Every integration is isolated** (Slack, GitHub, Trello, Drive)
- **Common utilities are reusable**
- **Routing stays clean**
- **Future features can be added without clutter**

---

# 🧠 High-Level Architecture

```
Slack Events ───────▶ Cloud Functions ───────▶ Trello API
                                     │
                                     ├──────▶ GitHub API
                                     │
                                     └──────▶ Google Drive API

GitHub Webhooks ───▶ Cloud Functions ───────▶ Slack Notifications
                                     │
                                     └──────▶ Trello Sync

Google Drive Hooks ▶ Cloud Functions ───────▶ Slack Alerts
```

---

# 📌 Channels & Automation Rules

## 1. #grean-ops — Operations Intake

This is the primary channel for automations.

### Automations:

- Message contains **`ISSUE:`** → Create Trello card
- Save mapping: SlackMsgID → TrelloCardID
- React 🟢 → Move Trello card to DONE
- Images uploaded → Saved to Google Drive evidence folder
- Thread replies → Synced as Trello comments

This channel = **Ops Command Center**.

---

## 2. #grean-dev — Engineering Notifications

Automations:

- GitHub PR opened → Slack alert
- GitHub PR merged → Slack alert
- GitHub issue created → Slack alert
- CI/CD failed → Slack alert

This channel = **Developer Command Center**.

---

## 3. #grean-business — No Automation (Phase 1)

Reserved for:

- Business strategy
- Pricing
- Branding
- Marketing

Automation stays out to keep it clean.

---

## 4. #grean-announcements — No Automation (Phase 1)

Human-only updates.
Future possibility: SOP or legal updates.

---

# 🔐 Secret & Credential Management

All sensitive API keys are stored in Firebase Secret Manager.

### Secrets Needed:

**Slack**

- SLACK_SIGNING_SECRET
- SLACK_BOT_TOKEN

**GitHub**

- GITHUB_PRIVATE_KEY
- GITHUB_APP_ID
- GITHUB_WEBHOOK_SECRET

**Trello**

- TRELLO_API_KEY
- TRELLO_API_TOKEN
- TRELLO_BOARD_ID_OPS_INTAKE

**Google**

- GOOGLE_SERVICE_ACCOUNT_JSON

---

# 🧩 Cloud Functions Endpoints

### `/slack/events`

Handles:

- Message events
- Reactions
- File uploads
- URL verification

### `/github/webhook`

Handles:

- Issues
- Pull request events
- CI/CD updates

### `/trello/sync`

Handles:

- Card move events
- Comments

### `/drive/hooks`

Handles:

- Document change notifications
- Folder updates

---

# 🗂 Data Storage (Firestore)

We store cross-platform mappings:

```
/mappings/slackToTrello/{slackMsgId}
/mappings/trelloToGithub/{trelloCardId}
/mappings/docsToTrello/{docId}
```

Each mapping includes metadata:

- createdAt
- updatedAt
- integration source
- triggers

---

# 🚀 Development Flow

### 1. Build or modify a function

### 2. Commit changes

### 3. Deploy functions

```bash
firebase deploy --only functions
```

### 4. Test Slack/GitHub/Trello integration manually

### 5. Iterate

---

# 🛠 Phase 1 Roadmap

### ✔ Step 1 — Firebase project initialized

### ✔ Step 2 — Functions deployed (baseline)

### 🔜 Step 3 — Build routing in `index.ts`

- /slack/events
- /github/webhook
- /trello/sync
- /drive/hooks

### 🔜 Step 4 — Slack App Setup

- Create Slack app
- Enable Events API
- Install bot to workspace

### 🔜 Step 5 — Implement Slack → Trello issue creation

- Detect `ISSUE:`
- Create card
- Save mapping

### 🔜 Step 6 — Implement 🟢 reaction → move Trello card

### 🔜 Step 7 — GitHub webhook wiring

### 🔜 Step 8 — Google Drive webhook wiring

### 🔜 Step 9 — Test full automation flow end-to-end

---

# 🎯 Purpose of This Document

This README exists to:

- Keep all goals visible
- Make onboarding new contributors easy
- Prevent architecture drift
- Align business + engineering expectations
- Provide a clear technical north star

This is the single source of truth for Grean Ops Automation.

---

# 📣 Next Step Before Coding

We will now create the function routing structure and prepare Slack integration.

Whenever you're ready to continue, say: **"Let's build routing."**
