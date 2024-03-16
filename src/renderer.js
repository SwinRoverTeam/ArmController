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
  

  // Listen for button press
document.getElementById('submitButton').addEventListener('click', () => {
    // Get values from sliders
    let clawValue = document.getElementById('clawSlider').value;
    let gripperRotationValue = document.getElementById('gripperRotationSlider').value;
    let wristValue = document.getElementById('wristSlider').value;
    let secondSwingArmValue = document.getElementById('secondSwingArmSlider').value;
    let firstSwingArmValue = document.getElementById('firstSwingArmSlider').value;
    let baseValue = document.getElementById('baseSlider').value;

    // Load values into robotArmControl object
    robotArmControl.claw = clawValue;
    robotArmControl.gripperRotation = gripperRotationValue;
    robotArmControl.wrist = wristValue;
    robotArmControl.secondSwingArm = secondSwingArmValue;
    robotArmControl.firstSwingArm = firstSwingArmValue;
    robotArmControl.base = baseValue;

    // Send the values to the main process
    ipcRenderer.send('robot-arm-control', robotArmControl);
  });
