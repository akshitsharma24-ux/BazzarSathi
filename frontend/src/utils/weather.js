// Real (non-synthetic) tomorrow's weather for Mumbai, via Open-Meteo --
// free, no API key/signup required, CORS-open for direct browser calls.
// Used only to *pre-fill* the Simulate sliders with a real starting point;
// the simulation itself still runs on the synthetic-data-trained model, so
// this doesn't change what the prototype's disclosed data sources are.
const MUMBAI = { latitude: 19.076, longitude: 72.8777 };

export async function fetchTomorrowWeather() {
  const params = new URLSearchParams({
    latitude: MUMBAI.latitude,
    longitude: MUMBAI.longitude,
    daily: "precipitation_probability_max,temperature_2m_max",
    timezone: "Asia/Kolkata",
    forecast_days: "2",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Weather API error ${res.status}`);
  const data = await res.json();

  // index 0 is today, 1 is tomorrow
  const tomorrowIdx = data.daily?.time?.length > 1 ? 1 : 0;
  const rainPct = data.daily.precipitation_probability_max[tomorrowIdx];
  const tempMax = data.daily.temperature_2m_max[tomorrowIdx];

  return {
    date: data.daily.time[tomorrowIdx],
    rainProbability: Math.min(1, Math.max(0, rainPct / 100)),
    temperature: Math.round(tempMax),
  };
}
