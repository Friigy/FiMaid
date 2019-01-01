const { app, BrowserWindow } = require('electron');
const fs = require('fs');

let win = null;

try {
    fs.writeFileSync("./PROFILE", "", 'utf-8');
} catch (err) {
    console.log("ERROR");
    console.log(err);
}

function createWindow() {
    // Initialize the window to our specified dimensions
    win = new BrowserWindow({ width: 1600, height: 900 });

    // Specify entry point
    win.loadURL('http://localhost:3000/');

    // Show some dev tools
    // Remove this line before distributing
    // NB: Open the browser inspector
    win.webContents.openDevTools();

    // Remove window once app is closed
    win.on('closed', function() {
        win = null;
    });
}

app.on('ready', function () {
    createWindow();
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});