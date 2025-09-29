This Homey app integrates the NRG.Watch module with your Homey smart home system, enabling seamless control of Itho Daalderop mechanical ventilation units. With this app, you can automate, monitor, and optimize your home’s air quality and energy efficiency.

Prerequisite
Before using this app, you must purchase and install the NRG.Watch module on your Itho Daalderop ventilation unit. This hardware is required to enable communication between your ventilation system and Homey.

Sample Flows

Here are some example flows to help you get started:

1. Boost Ventilation When Showering

•  Trigger: Bathroom humidity rises above 70%
•  Condition: Time is between 6:00 and 23:00
•  Action: Set ventilation to high for 30 minutes

2. Night Mode Ventilation

•  Trigger: Time is 23:00
•  Action: Set ventilation to low

3. Air Quality Alert

•  Trigger: CO₂ level exceeds 1000 ppm
•  Action: Send push notification: “Air quality is poor. Consider increasing ventilation.”

4. Energy-Saving Mode

•  Trigger: No motion detected in living room for 30 minutes
•  Condition: Ventilation is currently on medium or high
•  Action: Set ventilation to low

5. Manual Boost via Homey App or Voice Assistant

•  Trigger: Virtual button pressed or voice command received
•  Action: Set ventilation to high for 15 minutes
