import { useEffect, useState } from "react";

type WeatherData = {
  temperature: number;
  windspeed: number;
};

type Location = {
  city: string;
  state?: string;
  country?: string;
};

export default function WeatherApp() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatLocation = (loc: Location) => {
    if (loc.state) return `${loc.city}, ${loc.state}`;
    if (loc.country) return `${loc.city}, ${loc.country}`;
    return loc.city;
  };

  // -----------------------------
  // Fetch weather by coordinates
  // -----------------------------
  const fetchWeatherByCoords = async (
    latitude: number,
    longitude: number,
    loc?: Location,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
      );
      const data = await res.json();

      setWeather({
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
      });

      setLocation(loc ?? { city: "Current Location" });
    } catch {
      setError("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Fetch weather by city name
  // -----------------------------
  const fetchWeatherByCity = async () => {
    try {
      setLoading(true);
      setError(null);

      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1`,
      );
      const geoData = await geoRes.json();

      if (!geoData.results?.length) {
        throw new Error("City not found");
      }

      const result = geoData.results[0];

      await fetchWeatherByCoords(result.latitude, result.longitude, {
        city: result.name,
        state: result.admin1,
        country: result.country,
      });
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  // -----------------------------
  // Auto-detect user location
  // -----------------------------
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Optional: Try to guess nearby city with forward geocoding
        try {
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=&latitude=${latitude}&longitude=${longitude}&count=1`,
          );
          const geoData = await geoRes.json();
          const result = geoData.results?.[0];

          await fetchWeatherByCoords(
            latitude,
            longitude,
            result
              ? {
                  city: result.name,
                  state: result.admin1,
                  country: result.country,
                }
              : undefined,
          );
        } catch {
          // Fallback to just coordinates
          fetchWeatherByCoords(latitude, longitude);
        }
      },
      () => {
        setError("Location access denied");
      },
    );
  }, []);

  return (
    <div className="flex flex-col h-full">
      <h2 className="m-auto flex-none">Weather</h2>
      <div className="max-w-[1000px] m-auto flex-none mt-[20px]">
        This is an example using the https://geocoding-api.open-meteo.com api to get the current temperature and wind speed. Enter a city and click search.
      </div>
      <div className="special-flex max-w-[1000px] m-auto h-full mt-[20px] mb-[40px]">
        <input
          value={query}
          placeholder="Search city"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeatherByCity()}
          className="input"
          type="text"
        />

        <button
          onClick={fetchWeatherByCity}
          disabled={loading}
          className="btn mt-[20px]"
        >
          {loading ? "Loading..." : "Search"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {weather && location && (
          <div style={{ marginTop: "1rem" }}>
            <p>
              <strong>{formatLocation(location)}</strong>
            </p>
            <p>Temperature: {weather.temperature}°C</p>
            <p>Wind Speed: {weather.windspeed} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
}
