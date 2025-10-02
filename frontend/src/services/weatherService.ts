import axios from 'axios';


interface LocationCoordinates {
  latitude: number;
  longitude: number;
  name?: string;
}

class WeatherService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';
  
  private defaultLocations: { [key: string]: LocationCoordinates } = {
    'johannesburg': { latitude: -26.2041, longitude: 28.0473, name: 'Johannesburg' },
    'cape_town': { latitude: -33.9249, longitude: 18.4241, name: 'Cape Town' },
    'durban': { latitude: -29.8587, longitude: 31.0218, name: 'Durban' },
    'pretoria': { latitude: -25.7479, longitude: 28.2293, name: 'Pretoria' },
    'bloemfontein': { latitude: -29.0852, longitude: 26.1596, name: 'Bloemfontein' },
    'port_elizabeth': { latitude: -33.9608, longitude: 25.6022, name: 'Port Elizabeth' },
  };

  private getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return weatherCodes[code] || 'Unknown';
  }

  private getWeatherIcon(code: number): string {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2 || code === 3) return '⛅';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 57) return '🌦️';
    if (code >= 61 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '🌤️';
  }

  async getCurrentWeather(coordinates?: LocationCoordinates): Promise<any> {
    try {
      const location = coordinates || this.defaultLocations.johannesburg;
      
      const params = {
        latitude: location.latitude,
        longitude: location.longitude,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'wind_speed_10m',
          'wind_direction_10m',
          'weather_code'
        ].join(','),
        timezone: 'Africa/Johannesburg',
        temperature_unit: 'celsius',
        wind_speed_unit: 'kmh'
      };

      const response = await axios.get(this.baseUrl, { params });
      const data = response.data;

      return {
        location: location.name || 'Current Location',
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDirection: data.current.wind_direction_10m,
        description: this.getWeatherDescription(data.current.weather_code),
        icon: this.getWeatherIcon(data.current.weather_code),
        lastUpdated: new Date(data.current.time).toLocaleString('en-ZA'),
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherForecast(coordinates?: LocationCoordinates, days: number = 7): Promise<any> {
    try {
      const location = coordinates || this.defaultLocations.johannesburg;
      
      const params = {
        latitude: location.latitude,
        longitude: location.longitude,
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'weather_code',
          'precipitation_sum',
          'wind_speed_10m_max'
        ].join(','),
        timezone: 'Africa/Johannesburg',
        temperature_unit: 'celsius',
        wind_speed_unit: 'kmh',
        forecast_days: days
      };

      const response = await axios.get(this.baseUrl, { params });
      const data = response.data;

      return {
        location: location.name || 'Current Location',
        forecast: data.daily.time.map((date: string, index: number) => ({
          date: new Date(date).toLocaleDateString('en-ZA', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          maxTemp: Math.round(data.daily.temperature_2m_max[index]),
          minTemp: Math.round(data.daily.temperature_2m_min[index]),
          description: this.getWeatherDescription(data.daily.weather_code[index]),
          icon: this.getWeatherIcon(data.daily.weather_code[index]),
          precipitation: data.daily.precipitation_sum[index],
          windSpeed: Math.round(data.daily.wind_speed_10m_max[index]),
        }))
      };
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }

  async getHourlyWeather(coordinates?: LocationCoordinates, hours: number = 24): Promise<any> {
    try {
      const location = coordinates || this.defaultLocations.johannesburg;
      
      const params = {
        latitude: location.latitude,
        longitude: location.longitude,
        hourly: [
          'temperature_2m',
          'relative_humidity_2m',
          'precipitation',
          'weather_code'
        ].join(','),
        timezone: 'Africa/Johannesburg',
        temperature_unit: 'celsius',
        forecast_hours: hours
      };

      const response = await axios.get(this.baseUrl, { params });
      const data = response.data;

      return {
        location: location.name || 'Current Location',
        hourly: data.hourly.time.slice(0, hours).map((time: string, index: number) => ({
          time: new Date(time).toLocaleTimeString('en-ZA', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          temperature: Math.round(data.hourly.temperature_2m[index]),
          humidity: data.hourly.relative_humidity_2m[index],
          precipitation: data.hourly.precipitation[index],
          description: this.getWeatherDescription(data.hourly.weather_code[index]),
          icon: this.getWeatherIcon(data.hourly.weather_code[index]),
        }))
      };
    } catch (error) {
      console.error('Error fetching hourly weather:', error);
      throw new Error('Failed to fetch hourly weather data');
    }
  }

  async getMultiLocationWeather(): Promise<any[]> {
    const locations = Object.values(this.defaultLocations);
    const weatherPromises = locations.map(location => 
      this.getCurrentWeather(location).catch(error => ({
        location: location.name,
        error: error.message
      }))
    );

    return Promise.all(weatherPromises);
  }

  async getFarmingWeatherInsights(coordinates?: LocationCoordinates): Promise<any> {
    try {
      const [current, forecast] = await Promise.all([
        this.getCurrentWeather(coordinates),
        this.getWeatherForecast(coordinates, 3)
      ]);

      const insights: Array<{type: string; message: string; icon: string}> = [];
      const alerts: Array<{type: string; message: string; icon: string}> = [];

      if (current.temperature > 35) {
        alerts.push({
          type: 'warning',
          message: 'High temperature alert - Consider livestock shade and water availability',
          icon: '🌡️'
        });
      }

      if (current.temperature < 5) {
        alerts.push({
          type: 'warning',
          message: 'Low temperature alert - Protect sensitive crops and livestock',
          icon: '❄️'
        });
      }

      if (current.windSpeed > 30) {
        alerts.push({
          type: 'warning',
          message: 'High wind alert - Secure equipment and structures',
          icon: '💨'
        });
      }

      const upcomingRain = forecast.forecast.some((day: any) => day.precipitation > 5);
      if (upcomingRain) {
        insights.push({
          type: 'info',
          message: 'Rain expected in the next 3 days - Plan field activities accordingly',
          icon: '🌧️'
        });
      }

      if (current.humidity > 80) {
        insights.push({
          type: 'info',
          message: 'High humidity - Monitor for fungal diseases in crops',
          icon: '💧'
        });
      }

      return {
        current,
        forecast: forecast.forecast.slice(0, 3),
        alerts,
        insights,
        lastUpdated: current.lastUpdated
      };
    } catch (error) {
      console.error('Error fetching farming weather insights:', error);
      throw new Error('Failed to fetch weather insights');
    }
  }
}

export default new WeatherService();
