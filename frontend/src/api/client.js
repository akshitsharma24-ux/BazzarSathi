const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const API_BASE =
  import.meta.env.VITE_API_BASE || (isLocalHost ? "http://127.0.0.1:8000" : "/api");

async function handle(res) {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

export async function getDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`);
  return handle(res);
}

export async function getForecast({ rainProbability, temperature, localEvent }) {
  const params = new URLSearchParams({
    rain_probability: rainProbability,
    temperature,
    local_event: localEvent,
  });
  const res = await fetch(`${API_BASE}/forecast?${params.toString()}`);
  return handle(res);
}

export async function getModelInfo() {
  const res = await fetch(`${API_BASE}/model-info`);
  return handle(res);
}

export async function getNeighborhoodInsights() {
  const res = await fetch(`${API_BASE}/neighborhood-insights`);
  return handle(res);
}

export async function postMeshMatch({ direction, quantity }) {
  const res = await fetch(`${API_BASE}/mesh/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direction, quantity }),
  });
  return handle(res);
}

export async function postSimulate({ rainProbability, temperature, localEvent, riskMode }) {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rain_probability: rainProbability,
      temperature,
      local_event: localEvent,
      risk_mode: riskMode,
    }),
  });
  return handle(res);
}
