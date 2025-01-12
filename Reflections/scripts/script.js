const Scene = require('Scene');
const Patches = require('Patches');
const TouchGestures = require('TouchGestures');
const Networking = require('Networking');
const Diagnostics = require('Diagnostics');

(async function() {
    // Find objects in the scene
    const planeTracker = await Scene.root.findFirst('PlaneTracker');
    const mainSphere = await planeTracker.findFirst('MainSphere');
    const smallSphere1 = await planeTracker.findFirst('SmallSphere1');
    const smallSphere2 = await planeTracker.findFirst('SmallSphere2');

    const text1 = await smallSphere1.findFirst('Text1'); // Air Quality Text
    const text2 = await smallSphere2.findFirst('Text2'); // Temperature Text

    // Initialize visibility and opacity
    mainSphere.material.opacity = 1.0;
    smallSphere1.hidden = true;
    smallSphere2.hidden = true;

    // Fetch weather data directly
    async function fetchWeatherData() {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=Freiburg&appid=ccfe51382ba398aa60bb08056f21c443&units=metric`;
        try {
            const response = await Networking.fetch(url);
            const data = await response.json();
            return data.main.temp || "N/A"; // Extract temperature
        } catch (error) {
            Diagnostics.log(`Weather fetch error: ${error}`);
            return "Error";
        }
    }

    // Fetch air quality data directly
    async function fetchAirQualityData() {
        const url = `https://api.waqi.info/feed/Freiburg/?token=c3e5367de336c145cdbd0903027a41af955b1579`;
        try {
            const response = await Networking.fetch(url);
            const data = await response.json();
            return data.data.aqi || "N/A"; // Extract AQI
        } catch (error) {
            Diagnostics.log(`Air Quality fetch error: ${error}`);
            return "Error";
        }
    }

    // Update text data
    async function updateTextData() {
        const temp = await fetchWeatherData();
        const aqi = await fetchAirQualityData();
        text1.text = `AQI: ${aqi}`;
        text2.text = `${temp}°C`;
    }

    // Tap gestures
    TouchGestures.onTap(mainSphere).subscribe(async () => {
        mainSphere.material.opacity = 0.5; // Reduce opacity
        smallSphere1.hidden = false; // Show smaller spheres
        smallSphere2.hidden = false;
        await updateTextData(); // Update texts
    });

    TouchGestures.onTap(smallSphere1).subscribe(() => {
        mainSphere.material.opacity = Math.min(mainSphere.material.opacity + 0.25, 1.0); // Increase opacity
        smallSphere1.hidden = true; // Hide sphere
    });

    TouchGestures.onTap(smallSphere2).subscribe(() => {
        mainSphere.material.opacity = Math.min(mainSphere.material.opacity + 0.25, 1.0); // Increase opacity
        smallSphere2.hidden = true; // Hide sphere
    });
})();
