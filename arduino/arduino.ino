#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h> 

// --- 1. WIFI SETTINGS ---
const char* ssid = "SLT-4G-3F50";
const char* password = "YAA9J5308AM";



// --- 2. SERVER SETTINGS ---
// MAKE SURE THIS IS YOUR LAPTOP IP!
String serverBase = "http://192.168.1.101:3000/api/iot"; 

// --- 3. PIN DEFINITIONS ---
#define I2C_SDA 0  // D3 (GPIO 0)
#define I2C_SCL 2  // D4 (GPIO 2)
#define BTN_PIN 4  // D2 (GPIO 4)
#define BUZZ_PIN 5 // D1 (GPIO 5)

// --- 4. LCD SETUP (16 Columns, 4 Rows) ---
LiquidCrystal_I2C lcd(0x27, 16, 4); 

String currentOrderId = "";
bool hasOrder = false;

void setup() {
  Serial.begin(115200);

  // Initialize Custom I2C Pins (D3 & D4)
  Wire.begin(I2C_SDA, I2C_SCL); 

  pinMode(BTN_PIN, INPUT_PULLUP);
  pinMode(BUZZ_PIN, OUTPUT);
  
  lcd.init(); 
  lcd.backlight();
  
  // Startup Screen
  lcd.setCursor(0,0); lcd.print("--COFFEE SHOP--");
  lcd.setCursor(0,1); lcd.print("Connecting to:");
  lcd.setCursor(0,2); lcd.print(ssid);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { 
    delay(500); 
    Serial.print("."); 
  }
  
  // Connection Success
  lcd.clear(); 
  lcd.print("   ONLINE!    ");
  delay(1000);
  
  showWaitingScreen();
}

void loop() {
  if (!hasOrder) {
    checkPending();
    delay(3000); 
  } else {
    // If button pressed (LOW)
    if (digitalRead(BTN_PIN) == LOW) { 
      markReady();
      delay(1000); 
    }
  }
}

// --- HELPER: Show Idle Screen ---
void showWaitingScreen() {
  lcd.clear();
  lcd.setCursor(0,0); lcd.print(" SYSTEM READY ");  // 14 chars
  lcd.setCursor(0,1); lcd.print("Waiting for");    // 11 chars
  lcd.setCursor(0,2); lcd.print("New Orders...");  // 13 chars
  lcd.setCursor(0,3); lcd.print("----------------"); 
}

// --- FUNCTION: Check Server ---
void checkPending() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    client.setTimeout(2000);

    http.begin(client, serverBase + "/pending");
    int httpCode = http.GET();

    if (httpCode > 0) {
      String payload = http.getString();
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);
      
      if (doc["found"] == true) {
        hasOrder = true;
        currentOrderId = doc["id"].as<String>();
        String name = doc["customer"].as<String>();
        String item = doc["item"].as<String>();
        
        // --- 16x4 DISPLAY LAYOUT ---
        lcd.clear();
        
        // Line 0: Alert
        lcd.setCursor(0,0); 
        lcd.print("! NEW ORDER !"); 
        
        // Line 1: Name (Cut off if > 16 chars)
        lcd.setCursor(0,1); 
        if(name.length() > 16) name = name.substring(0, 16);
        lcd.print(name); 
        
        // Line 2: Item
        lcd.setCursor(0,2); 
        if(item.length() > 16) item = item.substring(0, 16);
        lcd.print(item); 
        
        // Line 3: Instruction
        lcd.setCursor(0,3); 
        lcd.print("PRESS BTN ->"); 

        // Alert Beep
        digitalWrite(BUZZ_PIN, HIGH); delay(200); digitalWrite(BUZZ_PIN, LOW);
      } 
    }
    http.end();
  }
}

// --- FUNCTION: Mark Ready ---
void markReady() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    http.begin(client, serverBase + "/ready");
    http.addHeader("Content-Type", "application/json");
    
    String json = "{\"id\":\"" + currentOrderId + "\"}";
    int httpCode = http.POST(json);
    
    if (httpCode == 200) {
      hasOrder = false;
      currentOrderId = "";
      
      // Success Beep
      digitalWrite(BUZZ_PIN, HIGH); delay(100); digitalWrite(BUZZ_PIN, LOW);
      delay(100);
      digitalWrite(BUZZ_PIN, HIGH); delay(100); digitalWrite(BUZZ_PIN, LOW);
      
      lcd.clear(); 
      lcd.setCursor(0,1); lcd.print("  ORDER READY!  ");
      delay(2000);
      
      showWaitingScreen();
    }
    http.end();
  }
}