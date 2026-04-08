export type Language = 'en' | 'uz' | 'ru';

export type Translations = {
  appName: string;
  nav: {
    dashboard: string;
    history: string;
    alerts: string;
    map: string;
    snake: string;
  };
  status: {
    connected: string;
    offline: string;
  };
  dashboard: {
    loading: string;
    noData: string;
    refresh: string;
    lastUpdated: string;
  };
  alerts: {
    title: string;
    unseenCount: string; // use {n} placeholder
    noUnseen: string;
    unseen: string;
    all: string;
    loading: string;
    allCaughtUp: string;
    noUnseenDesc: string;
    noAlertsDesc: string;
    markAsSeen: string;
    aqi: string;
  };
  history: {
    title: string;
    subtitle: string;
    loading: string;
    trend48h: string;
    line: string;
    bar: string;
    dailyAvg: string;
    recentReadings: string;
    time: string;
    aqi: string;
    level: string;
    avg: string;
  };
  gauge: {
    good: string;
    moderate: string;
    unhealthy: string;
  };
  levels: Record<string, string>;
  pollutants: {
    title: string;
    dominant: string;
    noData: string;
    pm25: string;
    pm10: string;
    co: string;
    no2: string;
    so2: string;
    o3: string;
  };
  weather: {
    title: string;
    temperature: string;
    humidity: string;
    windSpeed: string;
    pressure: string;
    noData: string;
  };
  chart: {
    noData: string;
    noDataDesc: string;
    title: string;
    aqi: string;
  };
};

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'AQI Monitor',
    nav: {
      dashboard: 'Dashboard',
      history: 'History',
      alerts: 'Alerts',
      map: 'Map',
      snake: 'Snake',
    },
    status: {
      connected: 'Connected',
      offline: 'Offline',
    },
    dashboard: {
      loading: 'Loading air quality data...',
      noData: 'No data available for',
      refresh: 'Refresh',
      lastUpdated: 'Last updated',
    },
    alerts: {
      title: 'Air Quality Alerts',
      unseenCount: 'You have {n} unseen alert(s)',
      noUnseen: 'No unseen alerts',
      unseen: 'Unseen',
      all: 'All',
      loading: 'Loading alerts...',
      allCaughtUp: 'All caught up!',
      noUnseenDesc: 'You have no unseen alerts.',
      noAlertsDesc: 'No alerts yet. Air quality is being monitored.',
      markAsSeen: 'Mark as seen',
      aqi: 'AQI',
    },
    history: {
      title: 'Air Quality History',
      subtitle: 'View historical data and trends for',
      loading: 'Loading history...',
      trend48h: '48-Hour Trend',
      line: 'Line',
      bar: 'Bar',
      dailyAvg: 'Daily Average AQI',
      recentReadings: 'Recent Readings',
      time: 'Time',
      aqi: 'AQI',
      level: 'Level',
      avg: 'Avg',
    },
    gauge: {
      good: 'Good (0–50)',
      moderate: 'Moderate (51–100)',
      unhealthy: 'Unhealthy (150+)',
    },
    levels: {
      'Good': 'Good',
      'Moderate': 'Moderate',
      'Unhealthy for Sensitive Groups': 'Unhealthy for Sensitive Groups',
      'Unhealthy': 'Unhealthy',
      'Very Unhealthy': 'Very Unhealthy',
      'Hazardous': 'Hazardous',
    },
    pollutants: {
      title: 'Pollutants',
      dominant: 'Dominant',
      noData: 'No data',
      pm25: 'Fine particulate matter',
      pm10: 'Coarse particulate matter',
      co: 'Carbon monoxide',
      no2: 'Nitrogen dioxide',
      so2: 'Sulfur dioxide',
      o3: 'Ozone',
    },
    weather: {
      title: 'Weather Conditions',
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      pressure: 'Pressure',
      noData: 'No data',
    },
    chart: {
      noData: 'No data available',
      noDataDesc: 'Data will appear as new readings are received',
      title: 'AQI Trend (24 hours)',
      aqi: 'AQI',
    },
  },

  uz: {
    appName: 'AQI Monitor',
    nav: {
      dashboard: 'Bosh sahifa',
      history: 'Tarix',
      alerts: "Ogohlantirishlar",
      map: 'Xarita',
      snake: 'Ilon',
    },
    status: {
      connected: 'Ulangan',
      offline: "Aloqa yo'q",
    },
    dashboard: {
      loading: "Havo sifati ma'lumotlari yuklanmoqda...",
      noData: "Ma'lumot mavjud emas:",
      refresh: 'Yangilash',
      lastUpdated: 'Oxirgi yangilanish',
    },
    alerts: {
      title: 'Havo sifati ogohlantirishlari',
      unseenCount: "Sizda {n} ta o'qilmagan ogohlantirish bor",
      noUnseen: "O'qilmagan ogohlantirishlar yo'q",
      unseen: "O'qilmagan",
      all: 'Hammasi',
      loading: 'Ogohlantirishlar yuklanmoqda...',
      allCaughtUp: "Hammasi ko'rib chiqildi!",
      noUnseenDesc: "O'qilmagan ogohlantirishlar yo'q.",
      noAlertsDesc: "Hali ogohlantirishlar yo'q. Havo sifati kuzatilmoqda.",
      markAsSeen: "O'qildi deb belgilash",
      aqi: 'AQI',
    },
    history: {
      title: 'Havo sifati tarixi',
      subtitle: "Tarixiy ma'lumotlar va tendensiyalar:",
      loading: 'Tarix yuklanmoqda...',
      trend48h: '48 soatlik tendensiya',
      line: 'Chiziq',
      bar: 'Ustun',
      dailyAvg: "Kunlik o'rtacha AQI",
      recentReadings: "Oxirgi o'lchovlar",
      time: 'Vaqt',
      aqi: 'AQI',
      level: 'Daraja',
      avg: "O'rt",
    },
    gauge: {
      good: 'Yaxshi (0–50)',
      moderate: "O'rtacha (51–100)",
      unhealthy: 'Zararli (150+)',
    },
    levels: {
      'Good': 'Yaxshi',
      'Moderate': "O'rtacha",
      'Unhealthy for Sensitive Groups': 'Sezgirlar uchun zararli',
      'Unhealthy': 'Zararli',
      'Very Unhealthy': 'Juda zararli',
      'Hazardous': 'Xavfli',
    },
    pollutants: {
      title: 'Ifloslantiruvchi moddalar',
      dominant: 'Ustunlovchi',
      noData: "Ma'lumot yo'q",
      pm25: 'Mayda zarrachalar',
      pm10: 'Yirik zarrachalar',
      co: 'Uglerod oksidi',
      no2: 'Azot dioksidi',
      so2: 'Oltingugurt dioksidi',
      o3: 'Ozon',
    },
    weather: {
      title: 'Ob-havo sharoiti',
      temperature: 'Harorat',
      humidity: 'Namlik',
      windSpeed: 'Shamol tezligi',
      pressure: 'Bosim',
      noData: "Ma'lumot yo'q",
    },
    chart: {
      noData: "Ma'lumot mavjud emas",
      noDataDesc: "Yangi o'lchovlar qabul qilinganida ma'lumotlar ko'rinadi",
      title: 'AQI tendensiyasi (24 soat)',
      aqi: 'AQI',
    },
  },

  ru: {
    appName: 'AQI Monitor',
    nav: {
      dashboard: 'Главная',
      history: 'История',
      alerts: 'Оповещения',
      map: 'Карта',
      snake: 'Змейка',
    },
    status: {
      connected: 'Подключено',
      offline: 'Нет связи',
    },
    dashboard: {
      loading: 'Загрузка данных о качестве воздуха...',
      noData: 'Нет данных для',
      refresh: 'Обновить',
      lastUpdated: 'Последнее обновление',
    },
    alerts: {
      title: 'Оповещения о качестве воздуха',
      unseenCount: 'У вас {n} непрочитанных оповещений',
      noUnseen: 'Нет непрочитанных оповещений',
      unseen: 'Непрочитанные',
      all: 'Все',
      loading: 'Загрузка оповещений...',
      allCaughtUp: 'Всё прочитано!',
      noUnseenDesc: 'Нет непрочитанных оповещений.',
      noAlertsDesc: 'Оповещений пока нет. Качество воздуха отслеживается.',
      markAsSeen: 'Отметить как прочитанное',
      aqi: 'AQI',
    },
    history: {
      title: 'История качества воздуха',
      subtitle: 'Исторические данные и тренды для',
      loading: 'Загрузка истории...',
      trend48h: 'Тренд за 48 часов',
      line: 'Линия',
      bar: 'Столбец',
      dailyAvg: 'Среднесуточный AQI',
      recentReadings: 'Последние показания',
      time: 'Время',
      aqi: 'AQI',
      level: 'Уровень',
      avg: 'Ср.',
    },
    gauge: {
      good: 'Хорошо (0–50)',
      moderate: 'Умеренно (51–100)',
      unhealthy: 'Вредно (150+)',
    },
    levels: {
      'Good': 'Хорошо',
      'Moderate': 'Умеренно',
      'Unhealthy for Sensitive Groups': 'Вредно для чувствительных',
      'Unhealthy': 'Вредно',
      'Very Unhealthy': 'Очень вредно',
      'Hazardous': 'Опасно',
    },
    pollutants: {
      title: 'Загрязнители',
      dominant: 'Доминирующий',
      noData: 'Нет данных',
      pm25: 'Мелкие частицы',
      pm10: 'Крупные частицы',
      co: 'Угарный газ',
      no2: 'Диоксид азота',
      so2: 'Диоксид серы',
      o3: 'Озон',
    },
    weather: {
      title: 'Погодные условия',
      temperature: 'Температура',
      humidity: 'Влажность',
      windSpeed: 'Скорость ветра',
      pressure: 'Давление',
      noData: 'Нет данных',
    },
    chart: {
      noData: 'Данные отсутствуют',
      noDataDesc: 'Данные появятся по мере получения новых показаний',
      title: 'Тренд AQI (24 часа)',
      aqi: 'AQI',
    },
  },
};
