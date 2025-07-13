import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const city = searchParams.get("city") || "Seoul";
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json(
      { error: errorData.message },
      { status: response.status }
    );
  }

  const data = await response.json();

  //   데이터 항목 (현재 기온, 최저기온, 최고기온, 습도)
  const filteredWeather = {
    temperature: data.main.temp,
    temp_min: data.main.temp_min,
    temp_max: data.main.temp_max,
    humidity: data.main.humidity,
  };

  return NextResponse.json({ weather: filteredWeather });
}
