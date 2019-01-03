const { app, BrowserWindow } = require('electron');
const fs = require('fs');

let win = null;

var profileExist = true;
var resourceExist = true;
var content = "";

const path = require('path');

try {
    content = fs.readFileSync("./PROFILE", 'utf-8');
} catch (err) {
    profileExist = false;
}

try {
    content = fs.readFileSync("./src/resources/mainPath", 'utf-8');
} catch (err) {
    resourceExist = false;
}

if (!profileExist) {
    try {
        fs.writeFileSync("./PROFILE", "Managed Folders:", 'utf-8');
    } catch (err) {
        console.log("ERROR");
        console.log(err);
    }
}

if (!resourceExist) {
    try {
        fs.writeFileSync("./src/resources/mainPath", path.dirname(process.mainModule.filename), 'utf-8');
    } catch (err) {
        console.log("ERROR");
        console.log(err);
    }
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