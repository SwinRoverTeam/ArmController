const { ipcRenderer } = require('electron');
const p5 = require('p5');
// Define an object to store the values
let robotArmControl = {
  firstSwingArm: 0,
  secondSwingArm: 0,
  wrist: 0,
  base: 0,
  gripperRotation: 45,
  claw: 0
};

let armed = false;
let homed = false;
let sketch;
ipcRenderer.on('robot-arm-homed', () => {
  homed = true;
});
ipcRenderer.on('error', (event, err) => {
  alert('An error occurred:', err);
});


window.onload = () => {
  document.getElementById('ARM').innerHTML = 'ARM';
  document.getElementById('ARM').style.backgroundColor = 'green';
  let p = new p5(sketch);
  for (let i = 1; i <= 6; i++) {
    let slider = document.getElementById(`link${i}`);
    let output = document.getElementById(`link${i}Value`);
    output.innerHTML = slider.value;
    slider.oninput = function() {
      output.innerHTML = this.value;
    }
  }
  //document ids
  claw = document.getElementById('link1');
  gripperRotation = document.getElementById('link2');
  wrist = document.getElementById('link3');
  secondSwingArm = document.getElementById('link4');
  firstSwingArm = document.getElementById('link5');
  base = document.getElementById('link6');

    // Listen for button press
  document.getElementById('sendButton').addEventListener('click', () => {
      if (!homed) {
        alert('Please home the robot arm first');
        return;
      }
      // Load values into robotArmControl object
      robotArmControl.claw = claw.value;
      robotArmControl.gripperRotation = gripperRotation.value;
      robotArmControl.wrist = wrist.value;
      robotArmControl.secondSwingArm = secondSwingArm.value;
      robotArmControl.firstSwingArm = firstSwingArm.value;
      robotArmControl.base = base.value;
      
      console.log(robotArmControl);

      // Send the values to the main process
      ipcRenderer.send('updateArm', robotArmControl);
    });
  document.getElementById('homeButton').addEventListener('click', () => {
    ipcRenderer.send('robot-arm-home');
    homed = true;
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
  document.getElementById('ARM').addEventListener('click', () => {
    switArm();
  });
  document.getElementById('NextCam').addEventListener('click', () => {
    ipcRenderer.send('NextCam');
  });
  document.getElementById('PrevCam').addEventListener('click', () => {
    ipcRenderer.send('PrevCam');
  });
  firstSwingArm.addEventListener('change', () => {
    robotArmControl.firstSwingArm = firstSwingArm.value;
    p.draw();
  });
  secondSwingArm.addEventListener('change', () => {
    robotArmControl.secondSwingArm = secondSwingArm.value;
    p.draw();
  });
  wrist.addEventListener('change', () => {
    robotArmControl.wrist = wrist.value;
    p.draw();
  });

};


sketch = function(p) {
  
  let base;
  let links = [];
  let numLinks = 3;
  let segLength = 100;
  let bodyStyle = window.getComputedStyle(document.getElementById('canvasContainer'));
  let bgColor = bodyStyle.backgroundColor;

  let armKeys = Object.keys(robotArmControl);

  p.setup = function() {
      let canvas = p.createCanvas(900, 500);
      p.strokeWeight(30);
      p.stroke(255, 160);

      base = p.createVector(p.width / 2, p.height / 2);

      for (let i = 0; i < numLinks; i++) {
          let angleInRadians = p.radians(robotArmControl[armKeys[i]]);
          let link = new Link(0, 0, segLength, angleInRadians, p);
          links.push(link);
      }
      canvas.parent('canvasContainer');
  };

  p.draw = function() {
      p.background(bgColor);

      let parent = base.copy();
      for (let i = 0; i < numLinks; i++) {
          let link = links[i];
          link.update(parent);
          link.show();
          parent = link.end();
      }
  };

  class Link {
      constructor(x, y, len, angle, p) {
          this.x = x;
          this.y = y;
          this.len = len;
          this.angle = angle;
          this.p = p;
      }

      update(parent) {
          this.x = parent.x;
          this.y = parent.y;
      }

      show() {
          this.p.push();
          this.p.translate(this.x, this.y);
          this.p.rotate(this.angle);
          this.p.line(0, 0, this.len, 0);
          this.p.pop();
      }

      end() {
          let end = this.p.createVector(this.x + this.len * this.p.cos(this.angle), this.y + this.len * this.p.sin(this.angle));
          return end;
      }
  }
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