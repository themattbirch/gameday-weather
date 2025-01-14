// background.js (Manifest V3 service worker)

/**
 * Inlined by dotenv-webpack at build time.
 */
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

/**
 * Store the API key locally when the extension is installed/updated.
 */
chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.storage.local.set({ OPENWEATHER_API_KEY });
    console.log("API key stored successfully");
  } catch (error) {
    console.error("Failed to store API key:", error);
  }
});

/**
 * Fetches weather data directly from OpenWeather.
 * @param {number} lat  Latitude
 * @param {number} lon  Longitude
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeather(lat, lon) {
  try {
    // Read the API key from chrome.storage (in case it was updated)
    const { OPENWEATHER_API_KEY: apiKey } = await chrome.storage.local.get([
      "OPENWEATHER_API_KEY",
    ]);
    if (!apiKey) {
      throw new Error("API key not found");
    }

    // Construct the OpenWeather API URL
    const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
    const url = `${baseUrl}?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    console.log("🌍 Fetching weather from OpenWeather:", url);

    // Hit the API
    const response = await fetch(url);
    console.log("📡 Server Response Status:", response.status);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    // Parse & return JSON data
    const data = await response.json();
    console.log("📦 Weather Data:", data);
    return data;
  } catch (error) {
    console.error("❌ Fetch Weather Error:", error);
    throw error;
  }
}

/**
 * Handle messages from popup.js (or content scripts).
 * If `request.type === "GET_WEATHER"`, we call fetchWeather.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_WEATHER") {
    fetchWeather(request.latitude, request.longitude)
      .then((data) => sendResponse(data))
      .catch((error) => sendResponse({ error: error.message }));
    return true; 
  }
});

/**
 * Manifest V3 background script (service worker) initialization log
 */
console.log("🚀 Service Worker is active and running.");
