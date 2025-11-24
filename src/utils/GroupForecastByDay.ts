export function groupForecastByDay(list: any[] = []) {
  const grouped: Record<string, any> = {};

  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!grouped[date]) {
      grouped[date] = item;
    }
  });

  return Object.values(grouped);
}

