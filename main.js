const { app, BrowserWindow } = require('electron');
const fs = require('fs');

let win = null;

var profileExist = true;
var resourceExist = true;
var content = "";

const path = require('path');

try {
    content = fs.readFileSync(path.join(path.dirname(process.mainModule.filename), "PROFILE"), 'utf-8');
} catch (err) {
    profileExist = false;
}

try {
    content = fs.readFileSync(path.join(path.dirname(process.mainModule.filename), "src", "resources", "mainPath.json"), 'utf-8');
} catch (err) {
    resourceExist = false;
}

if (!profileExist) {
    try {
        fs.writeFileSync(path.join(path.dirname(process.mainModule.filename), "PROFILE"), "Managed Folders:", 'utf-8');
    } catch (err) {
        console.log("ERROR");
        console.log(err);
    }
}

if (!resourceExist) {
    var jsonPath = {
        "mainPath": path.dirname(process.mainModule.filename)
    }
    try {
        fs.writeFileSync(path.join(path.dirname(process.mainModule.filename), "src", "resources", "mainPath.json"), JSON.stringify(jsonPath), 'utf-8');
    } catch (err) {
        console.log("ERROR");
        console.log(err);
    }
}

function createWindow() {
    // Initialize the window to our specified dimensions
    win = new BrowserWindow({ width: 1600, height: 900 });

    const startUrl = process.env.ELECTRON_START_URL || URL.format({
        pathname: path.join(__dirname, './build/index.html'),
        protocol: 'file:',
        slashes: true
    })

    // Specify entry point
    win.loadURL(startUrl);

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