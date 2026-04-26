# Turning Lumina into a Desktop App (PC Background Utility)

To make Lumina work while you are browsing other sites or looking at local files, you need to run it as a **Desktop App** using Electron.

## Steps to run on your PC:

### 1. Initialize Electron
On your local machine, open your terminal in the project folder and run:
`npm install --save-dev electron`

### 2. Create `electron-main.js`
Create a file named `electron-main.js` in your root directory:

```javascript
const { app, BrowserWindow, globalShortcut, clipboard } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    alwaysOnTop: true, // Keep it visible
    frame: false,      // Sleek borderless window
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load your hosted app or local build
  win.loadURL('http://localhost:3000'); 

  // GLOBAL SHORTCUT: Ctrl+Shift+E
  globalShortcut.register('CommandOrControl+Shift+E', () => {
    // This is the trick: 
    // 1. We assume the user has selected text
    // 2. We don't even need them to copy it if we use robotjs (advanced)
    // 3. Simple way: user copies text, presses shortcut, app reads clipboard.
    win.webContents.send('global-explain-request');
    win.show();
  });
}

app.whenReady().then(createWindow);
```

### 3. Update `package.json`
Add these to your `scripts`:
`"electron": "electron ."`

---

## How to use it right now (Web Version)
Since I cannot install software on your PC directly, I have added a **"Clipboard Sync"** feature to the preview:

1. **Copy text** from any file on your computer or any website (`Ctrl + C`).
2. Click anywhere on this page.
3. Press **Alt + V**.
4. Lumina will instantly explain the text you copied from outside!
