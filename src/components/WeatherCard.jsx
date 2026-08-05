import { useState, useEffect } from 'react'
import { CloudSun, MapPin, Wind } from 'lucide-react'
import SpotlightCard from './SpotlightCard'
import styles from './WeatherCard.module.css'

// 天气代码映射
const WEATHER_MAP = {
  0: { label: '晴天', icon: '☀️' },
  1: { label: '大部晴', icon: '🌤️' },
  2: { label: '多云', icon: '⛅' },
  3: { label: '阴天', icon: '☁️' },
  45: { label: '雾', icon: '🌫️' },
  48: { label: '霜雾', icon: '🌫️' },
  51: { label: '小毛毛雨', icon: '🌦️' },
  53: { label: '毛毛雨', icon: '🌦️' },
  55: { label: '大毛毛雨', icon: '🌧️' },
  61: { label: '小雨', icon: '🌧️' },
  63: { label: '中雨', icon: '🌧️' },
  65: { label: '大雨', icon: '🌧️' },
  71: { label: '小雪', icon: '🌨️' },
  73: { label: '中雪', icon: '🌨️' },
  75: { label: '大雪', icon: '❄️' },
  77: { label: '雪粒', icon: '🌨️' },
  80: { label: '阵雨', icon: '⛈️' },
  81: { label: '中阵雨', icon: '⛈️' },
  82: { label: '大阵雨', icon: '⛈️' },
  85: { label: '小阵雪', icon: '🌨️' },
  86: { label: '大阵雪', icon: '❄️' },
  95: { label: '雷暴', icon: '⚡' },
  96: { label: '雷暴+冰雹', icon: '⛈️' },
  99: { label: '强雷暴', icon: '⚡' },
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function WeatherCard() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('浏览器不支持定位')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Open-Meteo 免费天气 API（含7天预报）
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=6&timezone=auto`
          )
          const weatherData = await weatherRes.json()
          const cw = weatherData.current_weather

          // 逆地理编码获取城市名
          let city = '当前位置'
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=zh`
            )
            const geoData = await geoRes.json()
            city = geoData.address.city || geoData.address.town || geoData.address.county || '当前位置'
          } catch {}

          const weatherInfo = WEATHER_MAP[cw.weathercode] || { label: '未知', icon: '🌤️' }

          // 处理每日预报（跳过今天）
          const daily = weatherData.daily
          const forecasts = daily.time.slice(1).map((date, i) => {
            const d = new Date(date + 'T00:00:00')
            const code = daily.weather_code[i + 1]
            const info = WEATHER_MAP[code] || { label: '未知', icon: '🌤️' }
            return {
              day: i === 0 ? '明天' : WEEKDAYS[d.getDay()],
              icon: info.icon,
              high: Math.round(daily.temperature_2m_max[i + 1]),
              low: Math.round(daily.temperature_2m_min[i + 1]),
            }
          })

          setWeather({
            temp: Math.round(cw.temperature),
            label: weatherInfo.label,
            icon: weatherInfo.icon,
            windspeed: Math.round(cw.windspeed),
            city,
            forecasts,
          })
        } catch {
          setError('获取天气失败')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('无法获取位置')
        setLoading(false)
      }
    )
  }, [])

  if (error) {
    return (
      <SpotlightCard className={styles.card} spotlightColor="rgba(56, 189, 248, 0.08)">
        <div className={styles.header}>
          <CloudSun size={18} className={styles.icon} />
          <span className={styles.label}>天气</span>
        </div>
        <p className={styles.errorText}>{error}</p>
      </SpotlightCard>
    )
  }

  return (
    <SpotlightCard className={styles.card} spotlightColor="rgba(56, 189, 248, 0.08)">
      <div className={styles.header}>
        <CloudSun size={18} className={styles.icon} />
        <span className={styles.label}>天气</span>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <span className={styles.loadingDot} />
          <span className={styles.loadingDot} />
          <span className={styles.loadingDot} />
        </div>
      ) : weather ? (
        <div className={styles.body}>
          {/* 当前天气 */}
          <div className={styles.currentRow}>
            <div className={styles.main}>
              <span className={styles.weatherIcon}>{weather.icon}</span>
              <div>
                <span className={styles.temp}>{weather.temp}°</span>
                <span className={styles.weatherLabel}>{weather.label}</span>
              </div>
            </div>
            <div className={styles.infoList}>
              <span className={styles.infoItem}>
                <MapPin size={13} />
                {weather.city}
              </span>
              <span className={styles.infoItem}>
                <Wind size={13} />
                {weather.windspeed} km/h
              </span>
            </div>
          </div>

          {/* 多日预报 */}
          <div className={styles.forecastDivider} />
          <div className={styles.forecastRow}>
            {weather.forecasts.map((f, i) => (
              <div key={i} className={styles.forecastItem}>
                <span className={styles.forecastDay}>{f.day}</span>
                <span className={styles.forecastIcon}>{f.icon}</span>
                <span className={styles.forecastTemp}>
                  <span className={styles.forecastHigh}>{f.high}°</span>
                  <span className={styles.forecastLow}>{f.low}°</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </SpotlightCard>
  )
}

export default WeatherCard
