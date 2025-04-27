# Tasca

## 🇩🇪 | Deutsch

### Einführung

Tasca ist ein Tool zur Erstellung und Abarbeitung von Vorlagen (Templates). Nutzer können eigene Templates mit
definierten Schritten erstellen, die dann nacheinander abgearbeitet werden müssen. Dies eignet sich hervorragend für
Aufgaben wie das Einrichten von PCs, das Durchführen von Wartungsprozessen oder das Verwalten von wiederkehrenden
Aufgaben.

### Installation

**Projekt klonen**

```bash
   git clone https://github.com/jqnn/tasca
   cd tasca
```

**Abhängigkeiten installieren**

```bash
   npm install
```

**Umgebungsvariablen konfigurieren**

Erstelle eine ```.env``` Datei im Projektverzeichnis und füge die folgenden Variablen hinzu:

| **Variable**   | **Benötigt** |                                                    **Beschreibung** |                                  **Beispiel** |
|:---------------|:------------:|--------------------------------------------------------------------:|----------------------------------------------:|
| AUTH_SECRET    |      Ja      |                   Schlüssel zur Verschlüsselung von Sitzungstokens. |                          super_sicherer_token |
| DATABASE_URL   |      Ja      |                           Die URL zur Verbindung mit der Datenbank. | mysql://benutzer:passwort@host:port/datenbank |
| ADMIN_PASSWORD |     Nein     | Passwort des Administrator-Kontos. Wird bei jedem Neustart gesetzt. |                  super_sichers_admin_passwort |

## 🇬🇧 | Englisch

Tasca is a tool for creating and completing templates. Users can create their own templates with defined steps, which
must then be completed one by one. This is perfect for tasks like setting up PCs, performing maintenance processes, or
managing recurring tasks.

### Installation

**Clone the project**

```bash
   git clone https://github.com/jqnn/tasca
   cd tasca
```

**Install dependencies**

```bash
   npm install
```

**Configure environment variables**

Create a .env file in the project directory and add the following variables:

| Variable       | Required |                                                  Description |                                  Example |
|:---------------|:--------:|-------------------------------------------------------------:|-----------------------------------------:|
| AUTH_SECRET    |   Yes    |                           Key for encrypting session tokens. |                       super_secure_token |
| DATABASE_URL   |   Yes    |                          The URL to connect to the database. | mysql://user:password@host:port/database |
| ADMIN_PASSWORD |    No    | Password of the administrator account. Set on every restart. |              super_secure_admin_password |