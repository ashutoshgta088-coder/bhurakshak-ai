// ===== Mock Data for BhuRakshak AI Platform =====

export const nerStates = [
  'Assam', 'Meghalaya', 'Mizoram', 'Manipur', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim'
];

export const districts = {
  'Assam': ['Kamrup', 'Dibrugarh', 'Nagaon', 'Jorhat', 'Tinsukia', 'Silchar', 'Guwahati'],
  'Meghalaya': ['East Khasi Hills', 'West Khasi Hills', 'Ri Bhoi', 'Jaintia Hills', 'West Garo Hills'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib'],
  'Manipur': ['Imphal East', 'Imphal West', 'Thoubal', 'Churachandpur', 'Senapati'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Mon'],
  'Tripura': ['West Tripura', 'South Tripura', 'North Tripura', 'Dhalai'],
  'Arunachal Pradesh': ['Itanagar', 'Tawang', 'Papum Pare', 'East Siang', 'West Kameng'],
  'Sikkim': ['East Sikkim', 'West Sikkim', 'North Sikkim', 'South Sikkim']
};

export const riskLevels = ['Critical', 'High', 'Moderate', 'Low', 'Very Low'];

export const monitoredLocations = [
  { id: 1, name: 'NH-44 Barak Valley', state: 'Assam', district: 'Silchar', lat: 24.8333, lng: 92.7789, riskScore: 87, riskLevel: 'Critical', rainfall: 245, soilMoisture: 89, elevation: 450, slope: 35, lastUpdated: '2026-09-28 18:30' },
  { id: 2, name: 'Cherrapunji Hills', state: 'Meghalaya', district: 'East Khasi Hills', lat: 25.2700, lng: 91.7100, riskScore: 92, riskLevel: 'Critical', rainfall: 380, soilMoisture: 94, elevation: 1484, slope: 42, lastUpdated: '2026-09-28 18:25' },
  { id: 3, name: 'Mawsynram Road', state: 'Meghalaya', district: 'East Khasi Hills', lat: 25.2970, lng: 91.5822, riskScore: 78, riskLevel: 'High', rainfall: 310, soilMoisture: 82, elevation: 1400, slope: 38, lastUpdated: '2026-09-28 18:20' },
  { id: 4, name: 'Aizawl-Lunglei Highway', state: 'Mizoram', district: 'Aizawl', lat: 23.7271, lng: 92.7176, riskScore: 65, riskLevel: 'High', rainfall: 180, soilMoisture: 72, elevation: 1132, slope: 30, lastUpdated: '2026-09-28 18:15' },
  { id: 5, name: 'Imphal Valley Edge', state: 'Manipur', district: 'Imphal East', lat: 24.8170, lng: 93.9368, riskScore: 45, riskLevel: 'Moderate', rainfall: 120, soilMoisture: 58, elevation: 786, slope: 22, lastUpdated: '2026-09-28 18:10' },
  { id: 6, name: 'Kohima Ridge', state: 'Nagaland', district: 'Kohima', lat: 25.6747, lng: 94.1100, riskScore: 72, riskLevel: 'High', rainfall: 195, soilMoisture: 76, elevation: 1444, slope: 33, lastUpdated: '2026-09-28 18:05' },
  { id: 7, name: 'Tawang Monastery Road', state: 'Arunachal Pradesh', district: 'Tawang', lat: 27.5860, lng: 91.8600, riskScore: 56, riskLevel: 'Moderate', rainfall: 140, soilMoisture: 64, elevation: 3048, slope: 28, lastUpdated: '2026-09-28 18:00' },
  { id: 8, name: 'Gangtok-Nathula Pass', state: 'Sikkim', district: 'East Sikkim', lat: 27.3314, lng: 88.6138, riskScore: 83, riskLevel: 'Critical', rainfall: 260, soilMoisture: 87, elevation: 1650, slope: 40, lastUpdated: '2026-09-28 17:55' },
  { id: 9, name: 'Agartala Hills', state: 'Tripura', district: 'West Tripura', lat: 23.8315, lng: 91.2868, riskScore: 38, riskLevel: 'Low', rainfall: 90, soilMoisture: 48, elevation: 150, slope: 15, lastUpdated: '2026-09-28 17:50' },
  { id: 10, name: 'Dimapur Foothills', state: 'Nagaland', district: 'Dimapur', lat: 25.9042, lng: 93.7270, riskScore: 52, riskLevel: 'Moderate', rainfall: 135, soilMoisture: 61, elevation: 260, slope: 20, lastUpdated: '2026-09-28 17:45' },
  { id: 11, name: 'Shillong Peak Area', state: 'Meghalaya', district: 'East Khasi Hills', lat: 25.5667, lng: 91.8833, riskScore: 68, riskLevel: 'High', rainfall: 210, soilMoisture: 74, elevation: 1966, slope: 32, lastUpdated: '2026-09-28 17:40' },
  { id: 12, name: 'Jorhat Tea Gardens', state: 'Assam', district: 'Jorhat', lat: 26.7509, lng: 94.2037, riskScore: 25, riskLevel: 'Low', rainfall: 75, soilMoisture: 42, elevation: 116, slope: 8, lastUpdated: '2026-09-28 17:35' },
];

export const activeAlerts = [
  { id: 1, location: 'Cherrapunji Hills', state: 'Meghalaya', type: 'Critical', message: 'Extreme landslide risk detected. Heavy rainfall exceeding 350mm in 24 hours.', time: '15 min ago', riskScore: 92, isNew: true },
  { id: 2, location: 'NH-44 Barak Valley', state: 'Assam', type: 'Critical', message: 'Soil saturation at critical levels. Immediate evacuation advisory issued.', time: '32 min ago', riskScore: 87, isNew: true },
  { id: 3, location: 'Gangtok-Nathula Pass', state: 'Sikkim', type: 'Critical', message: 'Ground movement sensors detecting micro-tremors. Enhanced monitoring activated.', time: '1 hour ago', riskScore: 83, isNew: false },
  { id: 4, location: 'Mawsynram Road', state: 'Meghalaya', type: 'High', message: 'Continuous heavy rainfall. Soil moisture above threshold. Road closure recommended.', time: '2 hours ago', riskScore: 78, isNew: false },
  { id: 5, location: 'Kohima Ridge', state: 'Nagaland', type: 'High', message: 'Increasing soil moisture levels detected. Monitoring intensified.', time: '3 hours ago', riskScore: 72, isNew: false },
  { id: 6, location: 'Shillong Peak Area', state: 'Meghalaya', type: 'High', message: 'Heavy rainfall forecast for next 48 hours. Precautionary alert issued.', time: '4 hours ago', riskScore: 68, isNew: false },
];

export const alertHistory = [
  { id: 101, location: 'Cherrapunji Hills', date: '2026-09-27', type: 'Critical', message: 'Major landslide event predicted and confirmed. Evacuation completed successfully.', status: 'Resolved' },
  { id: 102, location: 'NH-44 Barak Valley', date: '2026-09-25', type: 'High', message: 'Road closure due to debris flow risk.', status: 'Resolved' },
  { id: 103, location: 'Gangtok-Nathula Pass', date: '2026-09-23', type: 'Critical', message: 'Severe ground instability detected.', status: 'Resolved' },
  { id: 104, location: 'Aizawl-Lunglei Highway', date: '2026-09-20', type: 'High', message: 'Slope failure risk elevated after extended rainfall.', status: 'Resolved' },
  { id: 105, location: 'Imphal Valley Edge', date: '2026-09-18', type: 'Moderate', message: 'Precautionary advisory due to weather forecast.', status: 'Resolved' },
];

export const sensorData = [
  { id: 'SM-001', type: 'Soil Moisture', location: 'Cherrapunji Hills', value: 94, unit: '%', status: 'Online', battery: 78, lastReading: '2 min ago' },
  { id: 'SM-002', type: 'Soil Moisture', location: 'NH-44 Barak Valley', value: 89, unit: '%', status: 'Online', battery: 65, lastReading: '3 min ago' },
  { id: 'RF-001', type: 'Rainfall', location: 'Cherrapunji Hills', value: 380, unit: 'mm', status: 'Online', battery: 82, lastReading: '1 min ago' },
  { id: 'RF-002', type: 'Rainfall', location: 'Mawsynram Road', value: 310, unit: 'mm', status: 'Online', battery: 71, lastReading: '2 min ago' },
  { id: 'GM-001', type: 'Ground Movement', location: 'Gangtok-Nathula Pass', value: 2.4, unit: 'mm/day', status: 'Online', battery: 54, lastReading: '5 min ago' },
  { id: 'GM-002', type: 'Ground Movement', location: 'Kohima Ridge', value: 1.8, unit: 'mm/day', status: 'Online', battery: 88, lastReading: '3 min ago' },
  { id: 'SM-003', type: 'Soil Moisture', location: 'Gangtok-Nathula Pass', value: 87, unit: '%', status: 'Online', battery: 45, lastReading: '4 min ago' },
  { id: 'RF-003', type: 'Rainfall', location: 'Gangtok-Nathula Pass', value: 260, unit: 'mm', status: 'Warning', battery: 32, lastReading: '6 min ago' },
  { id: 'SM-004', type: 'Soil Moisture', location: 'Aizawl-Lunglei Highway', value: 72, unit: '%', status: 'Online', battery: 91, lastReading: '2 min ago' },
  { id: 'GM-003', type: 'Ground Movement', location: 'Cherrapunji Hills', value: 3.1, unit: 'mm/day', status: 'Warning', battery: 67, lastReading: '1 min ago' },
  { id: 'RF-004', type: 'Rainfall', location: 'Kohima Ridge', value: 195, unit: 'mm', status: 'Online', battery: 73, lastReading: '3 min ago' },
  { id: 'SM-005', type: 'Soil Moisture', location: 'Tawang Monastery Road', value: 64, unit: '%', status: 'Offline', battery: 12, lastReading: '2 hours ago' },
];

export const weatherData = [
  { district: 'East Khasi Hills', state: 'Meghalaya', temp: 18, humidity: 95, rainfall: 380, windSpeed: 25, condition: 'Heavy Rain', forecast: 'Very Heavy Rain expected', alertLevel: 'Red' },
  { district: 'Silchar', state: 'Assam', temp: 28, humidity: 88, rainfall: 245, windSpeed: 18, condition: 'Heavy Rain', forecast: 'Continued heavy rain', alertLevel: 'Orange' },
  { district: 'East Sikkim', state: 'Sikkim', temp: 12, humidity: 92, rainfall: 260, windSpeed: 30, condition: 'Heavy Rain', forecast: 'Thunderstorms likely', alertLevel: 'Red' },
  { district: 'Kohima', state: 'Nagaland', temp: 20, humidity: 82, rainfall: 195, windSpeed: 15, condition: 'Moderate Rain', forecast: 'Rain to continue', alertLevel: 'Orange' },
  { district: 'Aizawl', state: 'Mizoram', temp: 22, humidity: 78, rainfall: 180, windSpeed: 12, condition: 'Light Rain', forecast: 'Gradual clearing', alertLevel: 'Yellow' },
  { district: 'Imphal East', state: 'Manipur', temp: 25, humidity: 70, rainfall: 120, windSpeed: 10, condition: 'Cloudy', forecast: 'Light rain possible', alertLevel: 'Yellow' },
  { district: 'Tawang', state: 'Arunachal Pradesh', temp: 8, humidity: 75, rainfall: 140, windSpeed: 20, condition: 'Light Rain', forecast: 'Partly cloudy', alertLevel: 'Yellow' },
  { district: 'West Tripura', state: 'Tripura', temp: 30, humidity: 65, rainfall: 90, windSpeed: 8, condition: 'Partly Cloudy', forecast: 'Fair weather', alertLevel: 'Green' },
];

export const historicalLandslides = [
  { id: 1, date: '2026-08-15', location: 'Cherrapunji Hills', state: 'Meghalaya', district: 'East Khasi Hills', casualties: 0, severity: 'Major', rainfall: 420, description: 'Major landslide on NH-6, road blocked for 3 days' },
  { id: 2, date: '2026-07-22', location: 'NH-44 Barak Valley', state: 'Assam', district: 'Silchar', casualties: 2, severity: 'Severe', rainfall: 350, description: 'Debris flow affecting residential area' },
  { id: 3, date: '2026-06-10', location: 'Gangtok-Nathula Road', state: 'Sikkim', district: 'East Sikkim', casualties: 0, severity: 'Moderate', rainfall: 280, description: 'Slope failure near tourist route' },
  { id: 4, date: '2025-09-05', location: 'Kohima Ridge', state: 'Nagaland', district: 'Kohima', casualties: 1, severity: 'Major', rainfall: 310, description: 'Landslide damaging infrastructure' },
  { id: 5, date: '2025-08-18', location: 'Aizawl Highway', state: 'Mizoram', district: 'Aizawl', casualties: 0, severity: 'Minor', rainfall: 200, description: 'Small slope failure, quickly cleared' },
  { id: 6, date: '2025-07-30', location: 'Imphal Outer Ring', state: 'Manipur', district: 'Imphal East', casualties: 0, severity: 'Minor', rainfall: 175, description: 'Minor mudslide on hill road' },
  { id: 7, date: '2025-06-14', location: 'Tawang Road', state: 'Arunachal Pradesh', district: 'Tawang', casualties: 3, severity: 'Severe', rainfall: 290, description: 'Major landslide blocking strategic route' },
  { id: 8, date: '2024-09-22', location: 'Shillong Bypass', state: 'Meghalaya', district: 'East Khasi Hills', casualties: 0, severity: 'Moderate', rainfall: 250, description: 'Rock fall on bypass road' },
  { id: 9, date: '2024-08-11', location: 'Dimapur Hills', state: 'Nagaland', district: 'Dimapur', casualties: 0, severity: 'Minor', rainfall: 190, description: 'Small debris flow near settlement' },
  { id: 10, date: '2024-07-05', location: 'Mawsynram Region', state: 'Meghalaya', district: 'East Khasi Hills', casualties: 1, severity: 'Major', rainfall: 450, description: 'Large-scale landslide after record rainfall' },
];

export const citizenReports = [
  { id: 1, reporter: 'Ramesh Kumar', location: 'Near Cherrapunji Market', date: '2026-09-28', description: 'Cracks visible on hillside near market area. Water seeping through.', status: 'Under Review', priority: 'High', image: true },
  { id: 2, reporter: 'Lalhmingmawii', location: 'Aizawl-Lunglei Km 45', date: '2026-09-27', description: 'Road surface sinking. Visible cracks on road shoulder.', status: 'Verified', priority: 'Critical', image: true },
  { id: 3, reporter: 'Bikash Sharma', location: 'NH-44 near Jatinga', date: '2026-09-26', description: 'Small mudslide blocking one lane. Needs clearing.', status: 'Resolved', priority: 'Moderate', image: false },
  { id: 4, reporter: 'Nungsang Ozukum', location: 'Kohima Bypass Road', date: '2026-09-25', description: 'Unusual water flow from hillside. Soil appears loose.', status: 'Under Review', priority: 'High', image: true },
  { id: 5, reporter: 'Tenzing Bhutia', location: 'Gangtok Ring Road', date: '2026-09-24', description: 'Retaining wall showing cracks after heavy rain.', status: 'Action Taken', priority: 'High', image: true },
];

export const recentActivities = [
  { id: 1, type: 'alert', message: 'Critical alert issued for Cherrapunji Hills', time: '15 min ago', icon: '🚨' },
  { id: 2, type: 'prediction', message: 'AI model updated risk score for Gangtok-Nathula Pass', time: '32 min ago', icon: '🤖' },
  { id: 3, type: 'sensor', message: 'Ground movement sensor GM-003 readings elevated', time: '1 hour ago', icon: '📡' },
  { id: 4, type: 'weather', message: 'IMD Red Alert for East Khasi Hills district', time: '2 hours ago', icon: '🌧️' },
  { id: 5, type: 'report', message: 'New citizen report verified for Aizawl-Lunglei Highway', time: '3 hours ago', icon: '📋' },
  { id: 6, type: 'system', message: 'AI prediction model retrained with latest data', time: '4 hours ago', icon: '⚙️' },
  { id: 7, type: 'alert', message: 'Alert level upgraded for NH-44 Barak Valley', time: '5 hours ago', icon: '🚨' },
  { id: 8, type: 'sensor', message: 'Sensor SM-005 went offline at Tawang', time: '6 hours ago', icon: '📡' },
];

export const monthlyRainfallData = [
  { month: 'Jan', rainfall: 15, landslides: 0 },
  { month: 'Feb', rainfall: 25, landslides: 0 },
  { month: 'Mar', rainfall: 80, landslides: 0 },
  { month: 'Apr', rainfall: 180, landslides: 1 },
  { month: 'May', rainfall: 320, landslides: 3 },
  { month: 'Jun', rainfall: 580, landslides: 8 },
  { month: 'Jul', rainfall: 720, landslides: 12 },
  { month: 'Aug', rainfall: 650, landslides: 10 },
  { month: 'Sep', rainfall: 480, landslides: 6 },
  { month: 'Oct', rainfall: 200, landslides: 2 },
  { month: 'Nov', rainfall: 45, landslides: 0 },
  { month: 'Dec', rainfall: 10, landslides: 0 },
];

export const predictionFactors = [
  { factor: 'Rainfall Intensity', weight: 35, value: 92, status: 'Critical' },
  { factor: 'Soil Moisture', weight: 25, value: 87, status: 'High' },
  { factor: 'Slope Gradient', weight: 15, value: 72, status: 'High' },
  { factor: 'Geological Formation', weight: 10, value: 65, status: 'Moderate' },
  { factor: 'Vegetation Cover', weight: 8, value: 45, status: 'Moderate' },
  { factor: 'Historical Pattern', weight: 7, value: 80, status: 'High' },
];

export const systemStatus = {
  apiServer: { name: 'API Server', status: 'Online', uptime: '99.98%', latency: '45ms' },
  database: { name: 'Database', status: 'Online', uptime: '99.99%', latency: '12ms' },
  aiEngine: { name: 'AI Engine', status: 'Online', uptime: '99.95%', latency: '150ms' },
  sensorNetwork: { name: 'Sensor Network', status: 'Degraded', uptime: '98.50%', latency: '320ms' },
  notifications: { name: 'Notification Service', status: 'Online', uptime: '99.97%', latency: '28ms' },
  gisService: { name: 'GIS Service', status: 'Online', uptime: '99.96%', latency: '85ms' },
  imdFeed: { name: 'IMD Data Feed', status: 'Online', uptime: '99.90%', latency: '200ms' },
  storage: { name: 'Cloud Storage', status: 'Online', uptime: '99.99%', latency: '35ms' },
};

export const dashboardStats = {
  totalLocations: 142,
  criticalZones: 12,
  activeAlerts: 6,
  sensorsOnline: 89,
  totalSensors: 96,
  aiAccuracy: 94.7,
  avgRiskScore: 58,
  totalReports: 234,
};

export const riskTrends = [
  { date: 'Sep 21', avgRisk: 42, alerts: 1 },
  { date: 'Sep 22', avgRisk: 48, alerts: 2 },
  { date: 'Sep 23', avgRisk: 55, alerts: 3 },
  { date: 'Sep 24', avgRisk: 52, alerts: 2 },
  { date: 'Sep 25', avgRisk: 61, alerts: 4 },
  { date: 'Sep 26', avgRisk: 68, alerts: 5 },
  { date: 'Sep 27', avgRisk: 72, alerts: 5 },
  { date: 'Sep 28', avgRisk: 78, alerts: 6 },
];
