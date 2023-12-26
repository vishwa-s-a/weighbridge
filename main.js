const { app, BrowserWindow, Menu } = require("electron");
const server = require("./server");
 
let mainWindow;
 
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
    },
  });
 
  mainWindow.loadURL("http://localhost:3000");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  // Build the menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Print',
          click() {
            printWindow();
          },
        },
        { role: 'quit' }, // Add other menu items if needed
      ],
    },
    {
      label: 'Navigation',
      submenu: [
        {
          label: 'Home',
          click() {
            navigateToHomePage();
          },
        },
      ],
    },
  ]);

  // Set the application menu
  Menu.setApplicationMenu(menu);
}

function printWindow() {
  const printOptions = {
    silent: false,
    printBackground: true,
    color: false,
    margins: {
      marginType: 'printableArea',
    },
    pageRanges: [{
      from: 1,
      to: 1
    }],
    landscape: true,
    pagesPerSheet: 1, // Set number of pages per sheet
    copies: 1, // Number of copies
    pageSize: 'A4', // Change to desired page size, e.g., 'A4', 'Letter', etc.
  };

  mainWindow.webContents.print(printOptions, (success, errorType) => {
    if (!success) {
      console.error(`Failed to print: ${errorType}`);
    }
  });
}

function navigateToHomePage() {
  mainWindow.loadURL("http://localhost:3000");
}

app.on("ready", createWindow);
 
app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});
 
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
 
app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});