const electron = require("electron");
const { ipcRenderer, contextBridge } = electron;

// document.addEventListener("DOMContentLoaded", (event) => {
//     document.querySelector("form").addEventListener("submit", () => {
//         ipcRenderer.send( "closewindow");
//     })
//     document.querySelector("h1").innerHTML = " This is preload page"
// })

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object

function write(id, text){
    //This is a function that gets the id key from your html page and change the text
    // it should display
    document.getElementById(id).innerHTML = text;
}

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, args) => func(args));
            }
        },
        printLine: (id, data) => {
            // you call this directly in your html file
            write(id, data);
        },
    }
);