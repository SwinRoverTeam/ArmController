const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const dgram = require('dgram');
const mavlink = require('mavlink');


let win;
let ArmLoc = {
    claw: 0,
    gripperRotation: 0,
    wrist: 0,
    secondSwingArm: 0,
    firstSwingArm: 0,
    base: 0
    };



function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false
    }
  })

  win.loadFile('./public/index.html')
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

const IPAddr = '192.168.144.11'

// Create a new MAVLink instance
let myMAV = new mavlink(1,1);

// Create a UDP socket
let socket = dgram.createSocket('udp4');

// Set up the socket to listen for incoming messages
socket.on('message', (msg, rinfo) => {
  // Parse the incoming message with MAVLink
  myMAV.parse(msg);
});

// Bind the socket to a port
socket.bind(14550); // Use the appropriate port for your application

// Set up MAVLink to handle decoded messages
myMAV.on('message', function(message) {
  console.log(message);
});

ipcMain.on('updateArm', (event, arg) => {
    ArmLoc = arg;
    console.log(ArmLoc);
    sendArmLoc();
});

function sendArmLoc() {
    // Create a new MAVLink message
    // Replace 'COMMAND_LONG' with the name of the command you want to send
    // Replace the array with the parameters for the command
    let msg = new mavlink.messages.COMMAND_LONG(1, 1, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0]);

    // Serialize the message to a Buffer
    let message = new Buffer(msg.pack(myMAV));

    // Send the message over the UDP socket
    socket.send(message, 0, message.length, 14550, IPAddr);
}