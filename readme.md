# Electron Mavlink Controller

[![License](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)

## Description
A Much better arm controller build to send mavlink commands taht allow for direct control of the a robotic arm

## Features
- Sliders
- Dokickeys
- Sends Mavlink
- Might work

## Installation
1. Clone the repository: `git clone`
2. Install dependencies: `npm install` and `pip install pymavlink`
3. Install Mavproxy

## Usage
1. Run the application: `npm start`
2. Pray
3. Plug the Herelink controller into a USB port
4. Enable USB tethering on Herelink
5. Run MavProxy with the command `mavproxy --master:udpout:192.168.42.129:14552`
6. In the same CMD after verifying connection type `output add localhost:14551`
7. Pray Some more


## License
This project is licensed under the [GPLv3 License](LICENSE).
