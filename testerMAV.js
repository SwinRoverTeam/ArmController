
const path = require('path')

const { spawn } = require('child_process')

const pythonCommand = 'python';
const PyPATH = '.\\pymv.py';

let ArmLoc = {
    claw: 0,
    gripperRotation: 0,
    wrist: 0,
    secondSwingArm: 0,
    firstSwingArm: 0,
    base: 0
    };

let id = 'move';

function sendDummy(){
    switch (id) {
        case 'move':
          let index;
          let motor = 'base';
          switch (motor) {
              case 'base':
                  index = 0;
                  value = -1;
                  break;
              case 'firstSwingArm':
                  index = 1;
                  value = 1;
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
        break;
        case 'ARMRover':
            sendMAVLink('0', ArmLoc);
        break;
        case 'Disarm':
            sendMAVLink('4', ArmLoc);
        break;
        case 'NextCam':
            sendMAVLink('2', ArmLoc);
        break;
        case 'PrevCam':
            sendMAVLink('3', ArmLoc);
        break;
    }
}


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

sendDummy();