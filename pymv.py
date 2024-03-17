from pymavlink import mavutil
import sys
import json

# Connect to the autopilot
master = mavutil.mavlink_connection('udp:localhost:14551')

# Wait for the heartbeat message to establish connection
master.wait_heartbeat()


arg = sys.argv[1]
values = json.loads(sys.argv[2])

# Print some information about the autopilot
print(f"Autopilot: {master.target_system}/{master.target_component}")




def ArmRover():
    print("Arming Rover")
    master.mav.command_long_send(
        master.target_system, master.target_component,
        mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0, 1, 0, 0, 0, 0, 0, 0
    )
def MoveArm():
    print("Moving Arm")
    master.mav.command_long_send(
        master.target_system, master.target_component,
        mavutil.mavlink.MAV_CMD_DO_SET_SERVO, 0, 1, values, 0, 0, 0, 0, 0
    )



# Define the switch statement
def cmd(value):
    switch = {
        '0': lambda: ArmRover(),
        '1': lambda: MoveArm(),
        '2': lambda: print("Case 3"),
        # Add more cases as needed
    }
    # Get the corresponding action based on the value
    action = switch.get(value, lambda: print("Invalid case"))
    # Execute the action
    action()

# Example usage
cmd(arg)

# Close the connection
master.close()