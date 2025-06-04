# tasca

## 🇬🇧 | English

### 🛠️ Introduction

**tasca** is a tool for creating and completing templates. Users can create custom templates with defined steps that must be completed one by one.  
This is perfect for:

- setting up PCs
- performing maintenance processes
- managing recurring tasks

---

### ⚙️ Installation

#### 📥 Clone the project

```bash
git clone https://github.com/jqnn/tasca
cd tasca
```

#### 📦 Install dependencies

```bash
npm install
```

#### 🧾 Configure environment variables

Create a `.env` file in the project root and add the following variables:

| **Variable**      | **Required** | Description                                            | Example                                      |
|-------------------|:------------:|--------------------------------------------------------|----------------------------------------------|
| `AUTH_SECRET`     |      ✅      | Key for encrypting session tokens                      | `super_secure_token`                         |
| `DATABASE_URL`    |      ✅      | URL to connect to the database                         | `mysql://user:password@host:port/database`   |
| `ADMIN_PASSWORD`  |      ❌      | Password for the admin account. Set on every restart.  | `super_secure_admin_password`                |

---

### 🌐 Online Demo

Try out **tasca** in your browser:

🔗 **[Open tasca demo](https://tasca.alytic.de)**

**Login credentials for the demo environment:**

- 🛡️ **Admin user:**  
  Username: `admin`  
  Password: `admin1234`

- 👤 **Demo user:**  
  Username: `demo`  
  Password: `demo1234`

---

## 🇩🇪 | Deutsch

### 🛠️ Einführung

**tasca** ist ein Tool zur Erstellung und Abarbeitung von Vorlagen (_Templates_). Nutzer können eigene Templates mit definierten Schritten erstellen, die dann nacheinander abgearbeitet werden.  
Dies eignet sich hervorragend für:

- das Einrichten von PCs
- das Durchführen von Wartungsprozessen
- das Verwalten wiederkehrender Aufgaben

---

### ⚙️ Installation

#### 📥 Projekt klonen

```bash
git clone https://github.com/jqnn/tasca
cd tasca
```

#### 📦 Abhängigkeiten installieren

```bash
npm install
```

#### 🧾 Umgebungsvariablen konfigurieren

Erstelle eine `.env`-Datei im Projektverzeichnis und füge folgende Variablen hinzu:

| **Variable**      | **Erforderlich** | Beschreibung                                                        | Beispiel                                      |
|-------------------|:----------------:|----------------------------------------------------------------------|----------------------------------------------|
| `AUTH_SECRET`     |        ✅        | Schlüssel zur Verschlüsselung von Sitzungstokens                     | `super_sicherer_token`                        |
| `DATABASE_URL`    |        ✅        | URL zur Verbindung mit der Datenbank                                 | `mysql://benutzer:passwort@host:port/dbname` |
| `ADMIN_PASSWORD`  |        ❌        | Passwort für das Admin-Konto. Wird bei jedem Neustart gesetzt.       | `super_sicheres_admin_passwort`              |

---

### 🌐 Online-Demo

Teste **tasca** direkt im Browser:

🔗 **[tasca Demo öffnen](https://tasca.alytic.de)**

**Zugangsdaten für die Demo-Umgebung:**

- 🛡️ **Admin-Benutzer:**  
  Benutzername: `admin`  
  Passwort: `admin1234`

- 👤 **Demo-Benutzer:**  
  Benutzername: `demo`  
  Passwort: `demo1234`