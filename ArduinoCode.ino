// Include the correct library for the Pololu VL53L0X sensor
#include <VL53L0X.h>
#include "Wire.h"

// Pin definitions
const int STEERING_PIN = A0;    // Potentiometer
const int GAS_PIN = A1;         // FSR402 pressure sensor

// Create the sensor object
VL53L0X tofSensor;

void setup() {
  Serial.begin(9600);
  
  // Initialize the distance sensor
  Serial.println("Initializing VL53L0X...");
  Wire.begin();
  tofSensor.init();
  tofSensor.setTimeout(500);
  tofSensor.startContinuous();
  
  Serial.println("Car Sensor System Ready!");
  Serial.println("Steering\tGas\tBrakeDistance");
}

void loop() {
  // 1. Read Steering (Potentiometer)
  int steeringValue = analogRead(STEERING_PIN);
  int steeringPercent = map(steeringValue, 0, 1023, -100, 100);
  
  // 2. Read Gas Pedal (FSR402)
  int gasValue = analogRead(GAS_PIN);
  int gasPercent = map(gasValue, 0, 800, 0, 100);
  gasPercent = constrain(gasPercent, 0, 100);
  
  // 3. Read Brake Sensor (VL53L0X)
  int brakeDistance = tofSensor.readRangeContinuousMillimeters();
  boolean brakeActive = false;
  
  if (brakeDistance < 200 && brakeDistance > 0) {
    brakeActive = true;
    gasPercent = 0;  // Override gas when brake is active
  }
  
  // 4. Send data to Serial Plotter
  Serial.print(steeringPercent);
  Serial.print(", ");
  Serial.print(gasPercent);
  Serial.print(", ");
  Serial.println(brakeDistance);
  
  delay(50);
}
