const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const { spawn } = require('child_process')

const pythonCommand = 'python';
const PyPATH = '.\\pymv.py';
const IPAddr = 'localhost'
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
    width: 1920,
    height: 1080,
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


ipcMain.on('updateArm', (event, arg) => {
    ArmLoc = arg;
    console.log(ArmLoc);
    sendArmLoc();
});
ipcMain.on('ARMRover', (event) => {
    sendMAVLink('0', ArmLoc);
});
ipcMain.on('Disarm',(event) => {
  sendMAVLink('4', ArmLoc);
});

ipcMain.on('NextCam', (event) => {
    sendMAVLink('2', ArmLoc);
});

ipcMain.on('PrevCam', (event) => {
    sendMAVLink('3', ArmLoc);
});

function sendArmLoc() {
    // Create a new MAVLink message
    // Replace 'COMMAND_LONG' with the name of the command you want to send
    // Replace the array with the parameters for the command
    let msg = new mavlink.messages.COMMAND_LONG(1, 1, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0]);

    // Serialize the message to a Buffer
    let message = Buffer.from(msg.pack(myMAV));

    // Send the message over the UDP socket
    socket.send(message, 0, message.length, 14550, IPAddr);
    console.log('Sent message:', msg);
}

function sendMAVLink(var1, var2){
  const python = spawn(pythonCommand, [PyPATH,var1, JSON.stringify(var2)]);

  python.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
  });

  python.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
  });

  python.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
  });
}