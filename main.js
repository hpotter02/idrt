const { app, BrowserWindow, webviewTag } = require('electron')

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
        }
    })
    //mainWindow.removeMenu()
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({ responseHeaders: Object.fromEntries(Object.entries(details.responseHeaders).filter(header => !/x-frame-options/i.test(header[0]))) });
    });

    mainWindow.loadFile('./index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})