const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

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
