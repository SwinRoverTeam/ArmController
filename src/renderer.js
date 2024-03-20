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
let mousedown = false;
ipcRenderer.on('robot-arm-homed', () => {
  homed = true;
});
ipcRenderer.on('error', (event, err) => {
  alert('An error occurred:', err);
});

function armevents() {
  const parentDiv = document.getElementById('control'); 
  document.getElementById('link1l').addEventListener('click', () => {
    if (mousedown){
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    } else {
    setRobotArmControl('link1', 1);
    mousedown = true;
    }
  });
  document.getElementById('link1r').addEventListener('click', () => {
    if (mousedown){
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    } else {
    setRobotArmControl('link1', -1);
    mousedown = true;
    }
  });
  document.getElementById('link2l').addEventListener('click', () => {
    if (mousedown){
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    } else {
    setRobotArmControl('link2', 1);
    mousedown = true;
    }
  });
  document.getElementById('link2r').addEventListener('click', () => {
    if (mousedown){
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    } else {
    setRobotArmControl('link2', -1);
    mousedown = true;
    }
  });
  document.getElementById('link3l').addEventListener('click', () => {
    if (mousedown){
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    } else {
    setRobotArmControl('link3', 1);
    mousedown = true;
    }
  });
  document.getElementById('link3r').addEventListener('click', () => {
    if (mousedown){
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    } else {
    setRobotArmControl('link3', -1);
    mousedown = true;
    }
  });
  document.getElementById('link4l').addEventListener('click', () => {
    if (mousedown){
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    } else {
      setRobotArmControl('link4', 1);
      mousedown = true;
    }
  });
  document.getElementById('link4r').addEventListener('click', () => {
    if (mousedown){
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    } else {
    setRobotArmControl('link4', -1);
    mousedown = true;
    }
  });
  document.getElementById('link5l').addEventListener('click', () => {
    if (mousedown){
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    } else {
    setRobotArmControl('link5', 1);
    mousedown = true;
    }
  });
  document.getElementById('link5r').addEventListener('click', () => {
    if (mousedown){
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    } else {
    setRobotArmControl('link5', -1);
    mousedown = true;
    }
  });
  document.getElementById('link6l').addEventListener('click', () => {
    if (mousedown){
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    } else {
      setRobotArmControl('link6', 1);
      mousedown = true;
    }
  });
  document.getElementById('link6r').addEventListener('click', () => {
    if (mousedown){
      mousedown = false;
      console.log('mouseup');
      resetRobotArmControl();
    } else {
      setRobotArmControl('link6', -1);
      mousedown = true;
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
  sendStopMotor()
}

function sendStopMotor(){
  console.log(robotArmControl);
  ipcRenderer.send('stopArm');
}

function setRobotArmControl(id, value) {
  console.log('setting ctrol')
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
  //resetRobotArmControl();
}

window.onload = () => {
  document.getElementById('ARM').innerHTML = 'ARM';
  document.getElementById('ARM').style.backgroundColor = 'green';

  armevents();
    // Listen for button press
  document.getElementById('stop').addEventListener('click', () => {
      // Send the values to the main process
      resetRobotArmControl();
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