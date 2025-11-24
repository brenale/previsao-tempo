import axios from "axios";

export class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.openweathermap.org/data/2.5";
  }

  async getFiveDayForecast(city: string) {
    const response = await axios.get(`${this.baseUrl}/forecast`, {
      params: {
        q: city,
        units: "metric",
        lang: "pt_br",
        appid: this.apiKey,
      },
    });

    return response.data;
  }
}
