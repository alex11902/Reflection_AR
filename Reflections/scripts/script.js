const Scene = require('Scene');
const Patches = require('Patches');
const TouchGestures = require('TouchGestures');
const Networking = require('Networking');
const Diagnostics = require('Diagnostics');

(async function() {
    // Objekte in der Szene finden
    const mainSphere = await Scene.root.findFirst('MainSphere');
    const smallSphere1 = await Scene.root.findFirst('SmallSphere1');
    const smallSphere2 = await Scene.root.findFirst('SmallSphere2');
    const text1 = await Scene.root.findFirst('Text1'); // Für Luftqualität
    const text2 = await Scene.root.findFirst('Text2'); // Für Temperatur

    // Opacity initialisieren
    mainSphere.material.opacity = 1.0;
    smallSphere1.hidden = true;
    smallSphere2.hidden = true;
    

    // Funktion zum Abrufen der Wetterdaten über den Proxy
    async function fetchWeatherData() {
        const url = `https://reflection-ar.onrender.com/api/weather`; // Proxy-Endpunkt
        try {
            const response = await Networking.fetch(url);
            const temp = await response.json();
            return temp;
        } catch (e) {
            Diagnostics.log(`Fehler beim Abrufen der Wetterdaten: ${e}`);
            return "Keine Daten";
        }
    }

    // Funktion zum Abrufen der Luftqualitätsdaten über den Proxy
    async function fetchAirQualityData() {
        const url = `https://reflection-ar.onrender.com/api/air-quality`; // Proxy-Endpunkt
        try {
            const response = await Networking.fetch(url);
            const aqi = await response.json();
            return aqi;
        } catch (e) {
            Diagnostics.log(`Fehler beim Abrufen der Luftqualitätsdaten: ${e}`);
            return "Keine Daten";
        }
    }

    // Funktion zum Aktualisieren der Texte
    async function updateTextData() {
        const temp = await fetchWeatherData();
        const aqi = await fetchAirQualityData();
        text1.text = `AQI: ${aqi}`;
        text2.text = `${temp}°C`;
    }

    // Tapping auf MainSphere
    TouchGestures.onTap(mainSphere).subscribe(async () => {
        mainSphere.material.opacity = 0.5; // Opacity reduzieren
        smallSphere1.hidden = false; // Kleine Sphären anzeigen
        smallSphere2.hidden = false;

        await updateTextData(); // Texte aktualisieren
    });

    // Tapping auf SmallSphere1
    TouchGestures.onTap(smallSphere1).subscribe(() => {
        mainSphere.material.opacity += 0.25; // Opacity erhöhen
        smallSphere1.hidden = true; // Sphäre verstecken
    });

    // Tapping auf SmallSphere2
    TouchGestures.onTap(smallSphere2).subscribe(() => {
        mainSphere.material.opacity += 0.25; // Opacity erhöhen
        smallSphere2.hidden = true; // Sphäre verstecken
    });
})();
