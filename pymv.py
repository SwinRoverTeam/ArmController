from pymavlink import mavutil
import sys
import json

# Connect to the autopilot
master = mavutil.mavlink_connection('udp:localhost:14551')

# Wait for the heartbeat message to establish connection
master.wait_heartbeat()


arg = sys.argv[1] #Get command
values = json.loads(sys.argv[2]) #get values like motor pos

# Print some information about the autopilot, these are ids to be used in commands
print(f"Autopilot: {master.target_system}/{master.target_component}")




def ArmRover():
    print("Arming Rover")
    master.mav.command_long_send(
        master.target_system, master.target_component,
        mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0, 1, 0, 0, 0, 0, 0, 0
    )
def Disarm():
    print("Disarm Rover")
    master.mav.command_long_send(
        master.target_system, master.target_component,
        mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0, 0, 0, 0, 0, 0, 0, 0
    )

def MoveArm():
    print("Moving Arm") 
    #values is defined as ArmLoc in node.js
    master.mav.command_long_send(
        master.target_system, master.target_component,
        mavutil.mavlink.MAV_CMD_DO_SET_SERVO, 0, 1, values[0], values[1] , values[2], values[3], values[4] , values[5]
    )

def NextCam():
    print("Next Camera")
    master.mav.command_long_send(
        master.target_system, master.target_component,
        mavutil.mavlink.MAV_CMD_DO_SET_CAM_TRIGG_DIST, 0, 1, 0, 0, 0, 0, 0, 0
    )

def PrevCam():
    print("Previous Camera")
    master.mav.command_long_send(
        master.target_system, master.target_component,
        mavutil.mavlink.MAV_CMD_DO_SET_CAM_TRIGG_DIST, 0, 0, 0, 0, 0, 0, 0, 0
    )


# Define the switch statement
def cmd(value):
    switch = {
        '0': lambda: ArmRover(),
        '1': lambda: MoveArm(),
        '2': lambda: NextCam(),
        '3': lambda: PrevCam(),
        '4': lambda: Disarm()
        
    }
    action = switch.get(value, lambda: print("Invalid case"))
    action()


cmd(arg)

# Close the connection
master.close()