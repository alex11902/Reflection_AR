const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.get('/api/weather', async (req, res) => {
  const WEATHER_API_KEY = "ccfe51382ba398aa60bb08056f21c443";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Freiburg&appid=${WEATHER_API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data.main.temp); // Nur die Temperatur senden
  } catch (error) {
    res.status(500).send('Fehler beim Abrufen der Wetterdaten');
  }
});

app.get('/api/air-quality', async (req, res) => {
  const AIR_QUALITY_API_KEY = "c3e5367de336c145cdbd0903027a41af955b1579";
  const url = `https://api.waqi.info/feed/Freiburg/?token=${AIR_QUALITY_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data.data.aqi); // Nur die AQI (Luftqualität) senden
  } catch (error) {
    res.status(500).send('Fehler beim Abrufen der Luftqualitätsdaten');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy-Server läuft auf http://localhost:${PORT}`);
});
