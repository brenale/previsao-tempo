import axios from "axios";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../src/pages/index";
import { WeatherService } from "../src/services/WeatherService";
import "@testing-library/jest-dom";


// O MOCK TEM QUE FICAR AQUI EM CIMA!
jest.mock("../src/services/WeatherService");

describe("Home Page", () => {
  it("renders title", () => {
    render(<Home />);
    expect(screen.getByText("Previsão do Tempo")).toBeInTheDocument();
  });

  it("mostra previsão mockada quando clicar em Buscar", async () => {
    const mockForecast = {
      city: { name: "São Paulo" },
      list: [
        {
          dt_txt: "2025-11-24 12:00:00",
          main: { temp: 30 },
          weather: [{ description: "céu limpo", icon: "01d" }],
        },
      ],
    };

    (WeatherService as jest.Mock).mockImplementation(() => ({
      getFiveDayForecast: jest.fn().mockResolvedValue(mockForecast),
    }));

    render(<Home />);

    const input = screen.getByPlaceholderText("Digite a cidade");
    fireEvent.change(input, { target: { value: "São Paulo" } });

    const btn = screen.getByText("Buscar");
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText("São Paulo")).toBeInTheDocument();
    });

    expect(screen.getByText("céu limpo")).toBeInTheDocument();
    expect(screen.getByText("30.0°C")).toBeInTheDocument();
  });

  it("mostra mensagem de erro quando a API falha", async () => {
    (WeatherService as jest.Mock).mockImplementation(() => ({
      getFiveDayForecast: jest.fn().mockRejectedValue(new Error("Cidade inválida")),
    }));

    render(<Home />);

    const input = screen.getByPlaceholderText("Digite a cidade");
    fireEvent.change(input, { target: { value: "xxx" } });

    const btn = screen.getByText("Buscar");
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText("Cidade não encontrada")).toBeInTheDocument();
    });
  });
});
