const {  app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// make your main_window global
let main_window;

// Modules to control application life and create native browser window
function createWindow() {
    // create the browser window prefrence
    main_window = new BrowserWindow({
        width: 700, height: 600,
        webPreferences:{
            // nodeIntegration : false is the default value from electron 5 and over
            nodeIntegration : false,
            // contextIsolation : true protect against prototype pollution
            contextIsolation : true,
            // turn off remote
            enableRemoteModule: false,
            // use preload to connect html to main script
            preload: path.join(__dirname, "preload.js")
        }
    });
    // load the html file to make the window
    main_window.loadFile(path.join(__dirname, "index.html"));
}

// recieve your data(item) from the html to the main script
// using the channel ("toMain"). Send data("item") to the html
//window using the channel ("fromMain")
ipcMain.on("toMain", function(e, item){
    main_window.webContents.send("fromMain", item)
})


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function(){
    if (process.platform !== "darwin") app.quit()
})