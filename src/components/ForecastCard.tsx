import React from "react";
import { WeatherIcon } from "./WeatherIcon";

interface ForecastCardProps {
  date: string;
  temp: number;
  description: string;
  icon: string;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ date, temp, description, icon }) => {
  return (
    <div className="card text-center m-2">
        <p className="fw-light">{new Date(date).toLocaleDateString("pt-BR")}</p>
        <h5 className="fw-bold text-primary fs-4">{temp.toFixed(1)}°C</h5>
      <div className="my-2">
        <WeatherIcon icon={icon} size="100px" />
      </div>
      <p className="text-capitalize text-secondary">{description}</p>
    </div>
  );
};
