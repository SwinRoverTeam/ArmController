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
  
let homed = false;

ipcRenderer.on('robot-arm-homed', () => {
  homed = true;
});
ipcRenderer.on('error', (event, err) => {
  alert('An error occurred:', err);
});


window.onload = () => {
  for (let i = 1; i <= 6; i++) {
    let slider = document.getElementById(`link${i}`);
    let output = document.getElementById(`link${i}Value`);
    output.innerHTML = slider.value;
    slider.oninput = function() {
      output.innerHTML = this.value;
    }
  }
    // Listen for button press
  document.getElementById('sendButton').addEventListener('click', () => {
      if (!homed) {
        alert('Please home the robot arm first');
        return;
      }
      // Get values from sliders
      let clawValue = document.getElementById('link1').value;
      let gripperRotationValue = document.getElementById('link2').value;
      let wristValue = document.getElementById('link3').value;
      let secondSwingArmValue = document.getElementById('link4').value;
      let firstSwingArmValue = document.getElementById('link5').value;
      let baseValue = document.getElementById('link6').value;

      // Load values into robotArmControl object
      robotArmControl.claw = clawValue;
      robotArmControl.gripperRotation = gripperRotationValue;
      robotArmControl.wrist = wristValue;
      robotArmControl.secondSwingArm = secondSwingArmValue;
      robotArmControl.firstSwingArm = firstSwingArmValue;
      robotArmControl.base = baseValue;
      
      console.log(robotArmControl);

      // Send the values to the main process
      ipcRenderer.send('robot-arm-control', robotArmControl);
    });
  document.getElementById('homeButton').addEventListener('click', () => {
    ipcRenderer.send('robot-arm-home');
  });
  document.getElementById('extendForwardsButton').addEventListener('click', () => {
    //
  });
  document.getElementById('extendBackwardsButton').addEventListener('click', () => {
    //
  });
  document.getElementById('extendVerticallyButton').addEventListener('click', () => {
    //
  });
}
