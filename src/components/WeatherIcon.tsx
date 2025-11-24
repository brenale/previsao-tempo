interface WeatherIconProps {
  icon: string;
  size?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ icon, size = "64px" }) => {
  return (
    <img
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt="Ícone do clima"
      style={{ width: size, height: size }}
    />
  );
};

