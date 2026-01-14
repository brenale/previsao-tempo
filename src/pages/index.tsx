import { useState, useEffect } from "react";
import { WeatherService } from "../services/WeatherService";
import { groupForecastByDay } from "../utils/GroupForecastByDay";
import { ForecastCard } from "../components/ForecastCard";

export default function Home() {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState<any[]>([]);
  const [cityName, setCityName] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  // consulta historico logo qdo entra na pagina. Apenas 1 vez
  useEffect(() => {
    const savedHistory = localStorage.getItem("weatherHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);
  //history mudar, salva no localstorage
  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }, [history]);

  //Busca clima (input, botão e histórico usam a mesma função)
  const handleSearch = async (cityToSearch?: string) => {
    const cityQuery = cityToSearch ?? city;

    if (!cityQuery) return;

    try {
      const service = new WeatherService(
        process.env.NEXT_PUBLIC_OPENWEATHER_KEY!
      );

      const data = await service.getFiveDayForecast(cityQuery);

      if (!data?.list || !data?.city?.name) {
        throw new Error("Dados incompletos da API");
      }

      const grouped = groupForecastByDay(data.list);
      setForecast(grouped);
      setCity(cityQuery);
      setCityName(data.city.name);

      // 🔹 Atualiza histórico
      setHistory((prev) => {
        if (prev.includes(data.city.name)) return prev;
        return [data.city.name, ...prev];
      });

    } catch (error: any) {
      console.error("Erro ao buscar previsão:", error);
      setForecast([]);
      setCityName("Cidade não encontrada");
    }
  };

  return (
    <div className="h-50 d-inline-block style=width: 60px p-3 mb-2 bg-success-subtle text-success-emphasis">
      <h1 className="text-center mb-4 text-secundário fw-bold">
        Previsão do Tempo
      </h1>

      {/* 🔹 Campo de busca */}
      <div className="input-group mb-4 shadow-sm">
        <input
          type="text"
          className="form-control text-uppercase"
          placeholder="Digite a cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() => handleSearch()}
        >
          Buscar
        </button>
      </div>

      {/* 🔹 Nome da cidade */}
      {cityName && (
        <h2 className="text-center mb-4 text-info">{cityName}</h2>
      )}

      {/* 🔹 Histórico */}
      {history.length > 0 && (
        <div className="mt-4">
          <h5>Histórico de buscas</h5>

          <ul className="list-group mb-2">
            {history.map((item, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
                onClick={() => handleSearch(item)}
              >
                {item}
              </li>
            ))}
          </ul>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => {
              setHistory([]);
              setCity("");
              setCityName("");
              setForecast([]);
              localStorage.removeItem("weatherHistory");
            }}
          >
            Limpar histórico
          </button>

        </div>
      )}

      //Cards de previsão
      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
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
