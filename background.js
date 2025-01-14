const CACHE_NAME = "gameday-weather-v1";
const SERVER_URL = "https://gameday-weather.vercel.app";
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

console.log("API Key:", OPENWEATHER_API_KEY);

// Install event handlers and message listeners
chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.storage.local.set({ OPENWEATHER_API_KEY });
    console.log("API key stored successfully");
  } catch (error) {
    console.error("Failed to store API key:", error);
  }
});

/**
 * Fetches weather data from the server API.
 * @param {number} lat - Latitude of the location.
 * @param {number} lon - Longitude of the location.
 * @returns {Promise<Object>} - The weather data.
 */
async function fetchWeather(lat, lon) {
  try {
    const result = await chrome.storage.local.get(["OPENWEATHER_API_KEY"]);
    const apiKey = result.OPENWEATHER_API_KEY;

    if (!apiKey) {
      throw new Error("API key not found");
    }

    const url = `${SERVER_URL}/api/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    console.log("🌍 Fetching weather from server:", url);

    const response = await fetch(url);
    console.log("📡 Server Response Status:", response.status);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 Weather Data:", data);
    return data;
  } catch (error) {
    console.error("❌ Fetch Weather Error:", error);
    throw error;
  }
}

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_WEATHER") {
    fetchWeather(request.latitude, request.longitude)
      .then((data) => sendResponse(data))
      .catch((error) => sendResponse({ error: error.message }));
    return true; // Indicate asynchronous response
  }
});

// Log service worker initialization
console.log("🚀 Service Worker is active and running.");
