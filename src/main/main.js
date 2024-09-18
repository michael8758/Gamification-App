const { app, BrowserWindow, Menu, Tray, ipcMain, Notification, globalShortcut } = require('electron');
const path = require('path');
const { promisePool, testConnection } = require(path.join(__dirname, '../backend/database'));

let mainWindow;
let tray = null;

let items = [];
let deletedIds = [];
let nextId = 1;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "gamification",
        backgroundColor: "#ffffff",
        icon: path.join(__dirname, '../../assets', 'logo.png'),
        webPreferences: {
            preload: path.join(__dirname, './preload.js'), // Add preload script
            nodeIntegration: false, // Disable Node integration for security
            contextIsolation: true, // Enable context isolation
        }
    });

    mainWindow.loadFile('src/renderer/index.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('close', (event) => {
        if (process.platform === 'darwin') {
            event.preventDefault();
            mainWindow.hide();
        } else {
            mainWindow = null;
        }
    });
}

// IPC Event Handlers

// Test the database connection when the app starts
app.on('ready', () => {
    testConnection();
});

// Close the database connection when the app is about to quit
app.on('will-quit', () => {
    promisePool.end((err) => {
        if (err) {
            console.error('Error closing database connection:', err);
        }
    });
});

ipcMain.handle('database-query', async (event, query, params) => {
    try {
        const [rows] = await promisePool.query(query, params);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
});

ipcMain.on('show-notification', (event, message) => {
    const notification = new Notification({
        title: 'My Mac App',
        body: message,
    });
    notification.show();
});

ipcMain.on('toggle-devtools', () => {
    if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools();
    } else {
        mainWindow.webContents.openDevTools();
    }
});

// Create the application menu
function createMenu() {
    const menuTemplate = [
        // Application menu structure here...
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

function createTray() {
    const trayIconPath = path.join(__dirname, '../../assets', 'logo.png');
    try {
        tray = new Tray(trayIconPath);
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show App', click: () => {
                    mainWindow.show();
                }
            },
            {
                label: 'Quit', click: () => {
                    app.quit();
                }
            }
        ]);
        tray.setToolTip('My Mac App');
        tray.setContextMenu(contextMenu);
        tray.on('click', () => {
            mainWindow.show();
        });
    } catch (error) {
        console.error('Failed to create tray:', error);
    }
}

app.whenReady().then(() => {
    createWindow();
    createMenu();
    if (process.platform === 'darwin') {
        createTray();
    }

    // Register a global shortcut to reload the window
    globalShortcut.register('CmdOrCtrl+R', () => {
        if (mainWindow) {
            mainWindow.reload();
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        } else {
            mainWindow.show();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    if (tray) {
        tray.destroy();
    }
    // Unregister all shortcuts
    globalShortcut.unregisterAll();
});