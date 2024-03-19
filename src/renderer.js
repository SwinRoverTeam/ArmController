const { ipcRenderer } = require('electron');
// Define an object to store the values
let robotArmControl = {
  claw: 0,
    gripperRotation: 0,
    wrist: 0,
    secondSwingArm: 0,
    firstSwingArm: 0,
    base: 0
};

let armed = false;
let homed = false;
let mousedown = false;
ipcRenderer.on('robot-arm-homed', () => {
  homed = true;
});
ipcRenderer.on('error', (event, err) => {
  alert('An error occurred:', err);
});

function armevents() {
  const parentDiv = document.getElementById('control'); 
  parentDiv.addEventListener('click', (event) => {
    mousedown = true;
    const targetId = event.target.id;
    console.log(targetId);
    if (targetId.includes('l')) {
      const linkNumber = targetId.replace('l', '');
      setRobotArmControl(linkNumber, -1);
    } else if (targetId.includes('r')) {
      const linkNumber = targetId.replace('r', '');
      setRobotArmControl(linkNumber, 1);
    }
  });
  parentDiv.addEventListener('mouseup', (event) => {
    if (mousedown) {
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    }
  });
}
function resetRobotArmControl() {
  robotArmControl = {
    claw: 0,
    gripperRotation: 0,
    wrist: 0,
    secondSwingArm: 0,
    firstSwingArm: 0,
    base: 0
  };
}


function setRobotArmControl(id, value) {
  switch (id) {
    case 'link1':
      robotArmControl.base = value;
      break;
    case 'link2':
      robotArmControl.firstSwingArm = value;
      break;
    case 'link3':
      robotArmControl.secondSwingArm = value;
      break;
    case 'link4':
      robotArmControl.wrist = value;
      break;
    case 'link5':
      robotArmControl.gripperRotation = value;
      break;
    case 'link6':
      robotArmControl.claw = value;
      break;
    default:
      break;
  }

  console.log(robotArmControl);
  ipcRenderer.send('updateArm', robotArmControl);
  resetRobotArmControl();
}

window.onload = () => {
  document.getElementById('ARM').innerHTML = 'ARM';
  document.getElementById('ARM').style.backgroundColor = 'green';

  armevents();
    // Listen for button press
  document.getElementById('stop').addEventListener('click', () => {
      // Send the values to the main process
      resetRobotArmControl();
      ipcRenderer.send('updateArm', robotArmControl);
    });
  document.getElementById('ARM').addEventListener('click', () => {
    switArm();
  });
  document.getElementById('nextCam').addEventListener('click', () => {
    ipcRenderer.send('NextCam');
  });
  document.getElementById('PrevCam').addEventListener('click', () => {
    ipcRenderer.send('PrevCam');
  });

};


function switArm() {
  if (armed) {
    document.getElementById('ARM').innerHTML = 'Disarm';
    document.getElementById('ARM').style.backgroundColor = 'red';
    armed = false;
    ipcRenderer.send('Disarm');
  } else {
    document.getElementById('ARM').innerHTML = 'ARM';
    document.getElementById('ARM').style.backgroundColor = 'green';
    ipcRenderer.send('ARMRover');
    armed = true;
  }
}