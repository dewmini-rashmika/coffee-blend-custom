#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

/* ================= CONFIG ================= */

const char WIFI_SSID[]     = "SLT-4G-3F50";
const char WIFI_PASSWORD[] = "YAA9J5308AM";
const char SERVER_BASE[]   = "http://192.168.1.101:3000/api/iot";

/* ================= PINS ================= */

#define I2C_SDA 0
#define I2C_SCL 2
#define BTN_PIN 4
#define BUZZ_PIN 5

/* ================= LCD ================= */

LiquidCrystal_I2C lcd(0x27, 16, 4);

/* ================= SYSTEM STATE ================= */

String currentOrderId;
bool hasOrder = false;

/* ================= TIMING ================= */

unsigned long lastPollTime = 0;
const unsigned long POLL_INTERVAL = 3000;

unsigned long lastBtnPress = 0;
const unsigned long DEBOUNCE_MS = 250;

/* ================= JSON ================= */

StaticJsonDocument<256> jsonDoc;

/* ================= UTIL ================= */

void beep(uint8_t times = 1)
{
  for (uint8_t i = 0; i < times; i++)
  {
    digitalWrite(BUZZ_PIN, HIGH);
    delay(80);
    digitalWrite(BUZZ_PIN, LOW);
    delay(80);
  }
}

String trimToLCD(const String &s)
{
  return (s.length() > 16) ? s.substring(0, 16) : s;
}

/* ================= LCD SCREENS ================= */

void showWaitingScreen()
{
  lcd.clear();
  lcd.setCursor(0,0); lcd.print(" SYSTEM READY ");
  lcd.setCursor(0,1); lcd.print("Waiting for");
  lcd.setCursor(0,2); lcd.print("New Orders...");
  lcd.setCursor(0,3); lcd.print("----------------");
}

void showOrder(const String &name, const String &item)
{
  lcd.clear();
  lcd.setCursor(0,0); lcd.print("! NEW ORDER !");
  lcd.setCursor(0,1); lcd.print(trimToLCD(name));
  lcd.setCursor(0,2); lcd.print(trimToLCD(item));
  lcd.setCursor(0,3); lcd.print("PRESS BTN ->");
}

void showReadyScreen()
{
  lcd.clear();
  lcd.setCursor(0,1); lcd.print("  ORDER READY!  ");
}

/* ================= WIFI ================= */

void connectWiFi()
{
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.print("Connecting WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 10000)
  {
    delay(300);
    Serial.print(".");
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("WiFi connected");
  }
  else
  {
    Serial.println("WiFi failed");
  }
}

/* ================= SERVER CALLS ================= */

bool httpGET(const String &url, String &response)
{
  WiFiClient client;
  HTTPClient http;

  http.setTimeout(2000);

  if (!http.begin(client, url)) return false;

  int code = http.GET();

  if (code > 0)
  {
    response = http.getString();
    http.end();
    return true;
  }

  Serial.printf("HTTP GET failed: %d\n", code);
  http.end();
  return false;
}

bool httpPOST(const String &url, const String &payload)
{
  WiFiClient client;
  HTTPClient http;

  http.setTimeout(2000);

  if (!http.begin(client, url)) return false;

  http.addHeader("Content-Type", "application/json");

  int code = http.POST(payload);

  http.end();

  if (code == 200) return true;

  Serial.printf("HTTP POST failed: %d\n", code);
  return false;
}

/* ================= ORDER LOGIC ================= */

void checkPending()
{
  String response;

  if (!httpGET(String(SERVER_BASE) + "/pending", response))
    return;

  DeserializationError err = deserializeJson(jsonDoc, response);
  if (err)
  {
    Serial.println("JSON parse error");
    return;
  }

  if (jsonDoc["found"] == true)
  {
    hasOrder = true;
    currentOrderId = jsonDoc["id"].as<String>();

    String name = jsonDoc["customer"].as<String>();
    String item = jsonDoc["item"].as<String>();

    showOrder(name, item);
    beep();
  }
}

void markReady()
{
  String payload = "{\"id\":\"" + currentOrderId + "\"}";

  if (!httpPOST(String(SERVER_BASE) + "/ready", payload))
    return;

  hasOrder = false;
  currentOrderId = "";

  beep(2);
  showReadyScreen();
  delay(1500);
  showWaitingScreen();
}

/* ================= BUTTON ================= */

bool buttonPressed()
{
  if (digitalRead(BTN_PIN) == LOW)
  {
    if (millis() - lastBtnPress > DEBOUNCE_MS)
    {
      lastBtnPress = millis();
      return true;
    }
  }
  return false;
}

/* ================= SETUP ================= */

void setup()
{
  Serial.begin(115200);

  Wire.begin(I2C_SDA, I2C_SCL);

  pinMode(BTN_PIN, INPUT_PULLUP);
  pinMode(BUZZ_PIN, OUTPUT);

  lcd.init();
  lcd.backlight();

  lcd.setCursor(0,0); lcd.print("--COFFEE SHOP--");
  lcd.setCursor(0,1); lcd.print("Connecting WiFi");

  connectWiFi();

  lcd.clear();
  lcd.print("ONLINE!");
  delay(1000);

  showWaitingScreen();
}

/* ================= LOOP ================= */

void loop()
{
  connectWiFi();

  if (!hasOrder)
  {
    if (millis() - lastPollTime > POLL_INTERVAL)
    {
      lastPollTime = millis();
      checkPending();
    }
  }
  else
  {
    if (buttonPressed())
      markReady();
  }
}
