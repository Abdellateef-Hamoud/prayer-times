import React, { useEffect, useState } from "react"
import Prayer from "./components/Prayer"

function App() {
  const [prayerTimes, setPrayerTimes] = useState({})
  const [city, setCity] = useState({ name: "القاهرة", value: "Cairo" })
  const [searchTerm, setSearchTerm] = useState("")

  const cities = [
    { name: "القاهرة", value: "Cairo" },
    { name: "الإسكندرية", value: "Alexandria" },
    { name: "الجيزة", value: "Giza" },
    { name: "المنصورة", value: "Mansoura" },
    { name: "أسوان", value: "Aswan" },
    { name: "الأقصر", value: "Luxor" },
    { name: "طنطا", value: "Tanta" },
    { name: "الفيوم", value: "Faiyum" },
    { name: "سوهاج", value: "Sohag" },
    { name: "دمياط", value: "Damietta" },
    { name: "بورسعيد", value: "Port Said" },
    { name: "السويس", value: "Suez" },
    { name: "بني سويف", value: "Beni Suef" },
    { name: "المنوفية", value: "Monufia" },
    { name: "قنا", value: "Qena" },
    { name: "أسيوط", value: "Asyut" },
    { name: "الشرقية", value: "Sharqia" },
    { name: "كفر الشيخ", value: "Kafr El Sheikh" },
    { name: "مطروح", value: "Marsa Matruh" },
    { name: "العريش", value: "Arish" },
  ]

  const filteredCities = cities.filter((c) =>
    c.name.includes(searchTerm.trim())
  )

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const today = new Date()
        const dateString = today
          .toLocaleDateString("en-GB")
          .split("/")
          .reverse()
          .join("-")

        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${city.value}&country=Egypt`
        )
        const data = await response.json()
        setPrayerTimes(data.data.timings)
      } catch (error) {
        console.error(error)
      }
    }

    fetchPrayerTimes()
  }, [city])

  const formatTimes = (time) => {
    if (!time) return "00:00"
    let [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "م" : "ص"
    hours = hours % 12 || 12
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${period}`
  }

  return (
    <section>
      <div className="container">
        <h1 className="title">مواقيت الصلاة</h1>

        <div className="top-sec">
          <div className="city">
            <input
              type="text"
              placeholder="ابحث عن مدينة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              onChange={(e) => setCity(filteredCities[e.target.value])}
              value={filteredCities.findIndex((c) => c.value === city.value)}
            >
              {filteredCities.map((city, index) => (
                <option key={index} value={index}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="date">
            <h3>التاريخ</h3>
            <h4>{new Date().toLocaleDateString("ar-EG")}</h4>
          </div>
        </div>

        <Prayer name="الفجر" time={formatTimes(prayerTimes.Fajr)} />
        <Prayer name="الظهر" time={formatTimes(prayerTimes.Dhuhr)} />
        <Prayer name="العصر" time={formatTimes(prayerTimes.Asr)} />
        <Prayer name="المغرب" time={formatTimes(prayerTimes.Maghrib)} />
        <Prayer name="العشاء" time={formatTimes(prayerTimes.Isha)} />
      </div>
    </section>
  )
}

export default App
