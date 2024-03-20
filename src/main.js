const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const { spawn } = require('child_process')

const pythonCommand = 'python';
const PyPATH = '.\\pymv.py';
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
  constructCMD(arg);
});

ipcMain.on('stopArm', (event) => {
  console.log("STOP");
  let arg = {'nuts': 'balls'};
  sendMAVLink('5', arg);
  });

function constructCMD(arg){
  let found = false;
  console.log(arg);
  for (let prop in arg) {
      if (arg[prop] !== 0) {
        found = true;
          let name = prop;
          let value = arg[prop];
          console.log(`Name: ${name}, Value: ${value}`);
          // You can now use the name and value variables as needed
          let index;
          switch (name) {
              case 'base':
                  index = 0;
                  console.log("MoveBase");
                  break;
              case 'firstSwingArm':
                  index = 1;
                  break;
              case 'secondSwingArm':
                  index = 2;
                  break;
              case 'wrist':
                  index = 3;
                  break;
              case 'gripperRotation':
                  index = 4;
                  break;
              case 'claw':
                  index = 5;
                  break;
              default:
                  break;
          }
          let ar = [index, value];
          console.log(ar);
          sendMAVLink('1', ar);
          if (found){
            break;
          }
      }
    
  }
}




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




function sendMAVLink(var1, var2){
  console.log('Maving');
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