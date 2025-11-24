import { useState } from "react";
import { WeatherService } from "../services/WeatherService";
import { groupForecastByDay } from "../utils/GroupForecastByDay";
import { ForecastCard } from "../components/ForecastCard";

export default function Home() {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState<any[]>([]);
  const [cityName, setCityName] = useState("");

  const handleSearch = async () => {
    try {
      const service = new WeatherService(process.env.NEXT_PUBLIC_OPENWEATHER_KEY!);
      const data = await service.getFiveDayForecast(city);

      if (!data?.list || !data?.city?.name) {
        throw new Error("Dados incompletos da API");
      }

      const grouped = groupForecastByDay(data.list);
      setForecast(grouped);
      setCityName(data.city.name);
    } catch (error: any) {
      console.error("Erro ao buscar previsão:", error);
      setForecast([]);
      setCityName("Cidade não encontrada");
    }
  };

  return (
    <div className="h-50 d-inline-block style=width: 60px p-3 mb-2 bg-success-subtle text-success-emphasis">
      <h1 className="text-center mb-4 text-secundário fw-bold"> Previsão do Tempo</h1>

      <div className="input-group mb-4 shadow-sm">
        <input 
          type="text"
          className="form-control text-uppercase"
          placeholder="Digite a cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {cityName && (
        <h2 className="text-center mb-4 text-info">{cityName}</h2>
      )}

  <div className="d-flex flex-wrap justify-content-center gap-3">
    {forecast.map((item, index) => (
      <ForecastCard
        key={index}
        date={item.dt_txt}
        temp={item.main.temp}
        description={item.weather[0].description}
        icon={item.weather[0].icon}
      />
    ))}
  </div>
</div>

  );
}
