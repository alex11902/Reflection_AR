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

    // Fetch weather data from proxy
    async function fetchWeatherData() {
        const url = `https://reflection-ar.onrender.com/api/weather`;
        try {
            const response = await Networking.fetch(url);
            const tempData = await response.json();
            return tempData.temperature || "N/A"; // Replace with actual response structure
        } catch (error) {
            Diagnostics.log(`Weather fetch error: ${error}`);
            return "Error";
        }
    }

    // Fetch air quality data from proxy
    async function fetchAirQualityData() {
        const url = `https://reflection-ar.onrender.com/api/air-quality`;
        try {
            const response = await Networking.fetch(url);
            const airQualityData = await response.json();
            return airQualityData.aqi || "N/A"; // Replace with actual response structure
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
