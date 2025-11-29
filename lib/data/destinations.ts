// Curated database of popular travel destinations
// Includes cities, regions, and countries with metadata for better search

export interface Destination {
  city: string;
  country: string;
  region?: string;
  aliases?: string[]; // Alternative names/spellings
  tags?: string[]; // For filtering by type
}

export const DESTINATIONS: Destination[] = [
  // Europe
  { city: 'Paris', country: 'France', region: 'Europe', aliases: ['City of Light'], tags: ['romantic', 'culture', 'food'] },
  { city: 'London', country: 'United Kingdom', region: 'Europe', aliases: ['UK', 'England'], tags: ['culture', 'history', 'shopping'] },
  { city: 'Rome', country: 'Italy', region: 'Europe', aliases: ['Roma'], tags: ['history', 'culture', 'food'] },
  { city: 'Barcelona', country: 'Spain', region: 'Europe', tags: ['beach', 'culture', 'nightlife'] },
  { city: 'Amsterdam', country: 'Netherlands', region: 'Europe', aliases: ['Holland'], tags: ['culture', 'cycling', 'canals'] },
  { city: 'Prague', country: 'Czech Republic', region: 'Europe', aliases: ['Praha', 'Czechia'], tags: ['history', 'budget', 'beer'] },
  { city: 'Vienna', country: 'Austria', region: 'Europe', aliases: ['Wien'], tags: ['culture', 'music', 'architecture'] },
  { city: 'Berlin', country: 'Germany', region: 'Europe', tags: ['history', 'nightlife', 'culture'] },
  { city: 'Munich', country: 'Germany', region: 'Europe', aliases: ['München'], tags: ['beer', 'culture', 'christmas'] },
  { city: 'Florence', country: 'Italy', region: 'Europe', aliases: ['Firenze'], tags: ['art', 'culture', 'food'] },
  { city: 'Venice', country: 'Italy', region: 'Europe', aliases: ['Venezia'], tags: ['romantic', 'canals', 'unique'] },
  { city: 'Milan', country: 'Italy', region: 'Europe', aliases: ['Milano'], tags: ['fashion', 'shopping', 'food'] },
  { city: 'Madrid', country: 'Spain', region: 'Europe', tags: ['culture', 'nightlife', 'food'] },
  { city: 'Lisbon', country: 'Portugal', region: 'Europe', aliases: ['Lisboa'], tags: ['culture', 'food', 'budget'] },
  { city: 'Porto', country: 'Portugal', region: 'Europe', tags: ['wine', 'culture', 'food'] },
  { city: 'Athens', country: 'Greece', region: 'Europe', aliases: ['Athina'], tags: ['history', 'ruins', 'culture'] },
  { city: 'Santorini', country: 'Greece', region: 'Europe', tags: ['romantic', 'beach', 'views'] },
  { city: 'Mykonos', country: 'Greece', region: 'Europe', tags: ['beach', 'nightlife', 'luxury'] },
  { city: 'Dubrovnik', country: 'Croatia', region: 'Europe', tags: ['history', 'beach', 'GOT'] },
  { city: 'Split', country: 'Croatia', region: 'Europe', tags: ['history', 'beach', 'budget'] },
  { city: 'Budapest', country: 'Hungary', region: 'Europe', tags: ['spa', 'nightlife', 'budget'] },
  { city: 'Krakow', country: 'Poland', region: 'Europe', aliases: ['Kraków'], tags: ['history', 'budget', 'culture'] },
  { city: 'Warsaw', country: 'Poland', region: 'Europe', aliases: ['Warszawa'], tags: ['history', 'culture', 'food'] },
  { city: 'Copenhagen', country: 'Denmark', region: 'Europe', aliases: ['København'], tags: ['design', 'food', 'cycling'] },
  { city: 'Stockholm', country: 'Sweden', region: 'Europe', tags: ['design', 'nature', 'culture'] },
  { city: 'Oslo', country: 'Norway', region: 'Europe', tags: ['nature', 'fjords', 'expensive'] },
  { city: 'Bergen', country: 'Norway', region: 'Europe', tags: ['fjords', 'nature', 'scenic'] },
  { city: 'Helsinki', country: 'Finland', region: 'Europe', tags: ['design', 'sauna', 'nature'] },
  { city: 'Reykjavik', country: 'Iceland', region: 'Europe', tags: ['nature', 'northern lights', 'unique'] },
  { city: 'Dublin', country: 'Ireland', region: 'Europe', tags: ['pubs', 'culture', 'friendly'] },
  { city: 'Edinburgh', country: 'Scotland', region: 'Europe', aliases: ['UK'], tags: ['history', 'culture', 'festivals'] },
  { city: 'Brussels', country: 'Belgium', region: 'Europe', aliases: ['Bruxelles'], tags: ['food', 'beer', 'chocolate'] },
  { city: 'Bruges', country: 'Belgium', region: 'Europe', aliases: ['Brugge'], tags: ['romantic', 'medieval', 'chocolate'] },
  { city: 'Zurich', country: 'Switzerland', region: 'Europe', aliases: ['Zürich'], tags: ['luxury', 'clean', 'expensive'] },
  { city: 'Geneva', country: 'Switzerland', region: 'Europe', aliases: ['Genève'], tags: ['luxury', 'lakes', 'mountains'] },
  { city: 'Interlaken', country: 'Switzerland', region: 'Europe', tags: ['adventure', 'mountains', 'scenic'] },
  { city: 'Monaco', country: 'Monaco', region: 'Europe', aliases: ['Monte Carlo'], tags: ['luxury', 'casino', 'F1'] },
  { city: 'Nice', country: 'France', region: 'Europe', tags: ['beach', 'riviera', 'relaxing'] },
  { city: 'Cannes', country: 'France', region: 'Europe', tags: ['luxury', 'film', 'beach'] },
  { city: 'Marseille', country: 'France', region: 'Europe', tags: ['port', 'food', 'culture'] },
  { city: 'Lyon', country: 'France', region: 'Europe', tags: ['food', 'culture', 'history'] },

  // Asia
  { city: 'Tokyo', country: 'Japan', region: 'Asia', tags: ['culture', 'food', 'technology'] },
  { city: 'Kyoto', country: 'Japan', region: 'Asia', tags: ['temples', 'culture', 'traditional'] },
  { city: 'Osaka', country: 'Japan', region: 'Asia', tags: ['food', 'nightlife', 'culture'] },
  { city: 'Seoul', country: 'South Korea', region: 'Asia', aliases: ['Korea'], tags: ['kpop', 'food', 'technology'] },
  { city: 'Busan', country: 'South Korea', region: 'Asia', tags: ['beach', 'seafood', 'temples'] },
  { city: 'Bangkok', country: 'Thailand', region: 'Asia', tags: ['temples', 'food', 'nightlife'] },
  { city: 'Phuket', country: 'Thailand', region: 'Asia', tags: ['beach', 'islands', 'nightlife'] },
  { city: 'Chiang Mai', country: 'Thailand', region: 'Asia', tags: ['temples', 'nature', 'budget'] },
  { city: 'Krabi', country: 'Thailand', region: 'Asia', tags: ['beach', 'islands', 'adventure'] },
  { city: 'Koh Samui', country: 'Thailand', region: 'Asia', tags: ['beach', 'luxury', 'relaxing'] },
  { city: 'Singapore', country: 'Singapore', region: 'Asia', tags: ['modern', 'food', 'clean'] },
  { city: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia', aliases: ['KL'], tags: ['modern', 'food', 'shopping'] },
  { city: 'Langkawi', country: 'Malaysia', region: 'Asia', tags: ['beach', 'duty-free', 'nature'] },
  { city: 'Penang', country: 'Malaysia', region: 'Asia', tags: ['food', 'culture', 'heritage'] },
  { city: 'Bali', country: 'Indonesia', region: 'Asia', tags: ['beach', 'spiritual', 'nature'] },
  { city: 'Jakarta', country: 'Indonesia', region: 'Asia', tags: ['urban', 'food', 'shopping'] },
  { city: 'Hanoi', country: 'Vietnam', region: 'Asia', tags: ['culture', 'food', 'history'] },
  { city: 'Ho Chi Minh City', country: 'Vietnam', region: 'Asia', aliases: ['Saigon', 'HCMC'], tags: ['urban', 'food', 'history'] },
  { city: 'Da Nang', country: 'Vietnam', region: 'Asia', tags: ['beach', 'food', 'modern'] },
  { city: 'Hoi An', country: 'Vietnam', region: 'Asia', tags: ['heritage', 'lanterns', 'tailoring'] },
  { city: 'Siem Reap', country: 'Cambodia', region: 'Asia', tags: ['temples', 'Angkor Wat', 'history'] },
  { city: 'Phnom Penh', country: 'Cambodia', region: 'Asia', tags: ['history', 'culture', 'food'] },
  { city: 'Manila', country: 'Philippines', region: 'Asia', tags: ['urban', 'food', 'nightlife'] },
  { city: 'Cebu', country: 'Philippines', region: 'Asia', tags: ['beach', 'diving', 'islands'] },
  { city: 'Boracay', country: 'Philippines', region: 'Asia', tags: ['beach', 'nightlife', 'water sports'] },
  { city: 'Palawan', country: 'Philippines', region: 'Asia', aliases: ['El Nido', 'Coron'], tags: ['beach', 'islands', 'diving'] },
  { city: 'Hong Kong', country: 'Hong Kong', region: 'Asia', aliases: ['HK'], tags: ['shopping', 'food', 'skyline'] },
  { city: 'Macau', country: 'Macau', region: 'Asia', tags: ['casino', 'Portuguese', 'food'] },
  { city: 'Taipei', country: 'Taiwan', region: 'Asia', tags: ['food', 'night markets', 'culture'] },
  { city: 'Beijing', country: 'China', region: 'Asia', aliases: ['Peking'], tags: ['history', 'Great Wall', 'culture'] },
  { city: 'Shanghai', country: 'China', region: 'Asia', tags: ['modern', 'skyline', 'food'] },
  { city: 'Xi\'an', country: 'China', region: 'Asia', aliases: ['Xian'], tags: ['history', 'Terracotta Army', 'food'] },
  { city: 'Guilin', country: 'China', region: 'Asia', tags: ['nature', 'karst', 'scenic'] },
  { city: 'Mumbai', country: 'India', region: 'Asia', aliases: ['Bombay'], tags: ['urban', 'Bollywood', 'food'] },
  { city: 'Delhi', country: 'India', region: 'Asia', aliases: ['New Delhi'], tags: ['history', 'culture', 'food'] },
  { city: 'Jaipur', country: 'India', region: 'Asia', aliases: ['Pink City'], tags: ['palaces', 'culture', 'shopping'] },
  { city: 'Goa', country: 'India', region: 'Asia', tags: ['beach', 'party', 'relaxing'] },
  { city: 'Agra', country: 'India', region: 'Asia', tags: ['Taj Mahal', 'history', 'culture'] },
  { city: 'Varanasi', country: 'India', region: 'Asia', aliases: ['Benares'], tags: ['spiritual', 'Ganges', 'culture'] },
  { city: 'Kerala', country: 'India', region: 'Asia', aliases: ['Kochi', 'Cochin'], tags: ['backwaters', 'nature', 'Ayurveda'] },
  { city: 'Kathmandu', country: 'Nepal', region: 'Asia', tags: ['temples', 'trekking', 'culture'] },
  { city: 'Colombo', country: 'Sri Lanka', region: 'Asia', tags: ['culture', 'colonial', 'food'] },
  { city: 'Maldives', country: 'Maldives', region: 'Asia', aliases: ['Male'], tags: ['luxury', 'beach', 'honeymoon'] },

  // Middle East
  { city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', aliases: ['UAE'], tags: ['luxury', 'shopping', 'modern'] },
  { city: 'Abu Dhabi', country: 'United Arab Emirates', region: 'Middle East', aliases: ['UAE'], tags: ['culture', 'luxury', 'F1'] },
  { city: 'Doha', country: 'Qatar', region: 'Middle East', tags: ['modern', 'museums', 'luxury'] },
  { city: 'Istanbul', country: 'Turkey', region: 'Middle East', aliases: ['Constantinople'], tags: ['history', 'food', 'culture'] },
  { city: 'Cappadocia', country: 'Turkey', region: 'Middle East', aliases: ['Goreme'], tags: ['hot air balloons', 'unique', 'caves'] },
  { city: 'Antalya', country: 'Turkey', region: 'Middle East', tags: ['beach', 'ruins', 'resorts'] },
  { city: 'Tel Aviv', country: 'Israel', region: 'Middle East', tags: ['beach', 'nightlife', 'food'] },
  { city: 'Jerusalem', country: 'Israel', region: 'Middle East', tags: ['religious', 'history', 'culture'] },
  { city: 'Petra', country: 'Jordan', region: 'Middle East', aliases: ['Wadi Musa'], tags: ['ancient', 'UNESCO', 'adventure'] },
  { city: 'Amman', country: 'Jordan', region: 'Middle East', tags: ['history', 'culture', 'food'] },
  { city: 'Muscat', country: 'Oman', region: 'Middle East', tags: ['culture', 'nature', 'authentic'] },
  { city: 'Marrakech', country: 'Morocco', region: 'Africa', aliases: ['Marrakesh'], tags: ['souks', 'culture', 'food'] },

  // Africa
  { city: 'Cape Town', country: 'South Africa', region: 'Africa', tags: ['nature', 'wine', 'adventure'] },
  { city: 'Johannesburg', country: 'South Africa', region: 'Africa', aliases: ['Joburg'], tags: ['urban', 'history', 'safari'] },
  { city: 'Cairo', country: 'Egypt', region: 'Africa', tags: ['pyramids', 'history', 'culture'] },
  { city: 'Luxor', country: 'Egypt', region: 'Africa', tags: ['temples', 'history', 'Nile'] },
  { city: 'Sharm El Sheikh', country: 'Egypt', region: 'Africa', tags: ['beach', 'diving', 'resort'] },
  { city: 'Nairobi', country: 'Kenya', region: 'Africa', tags: ['safari', 'wildlife', 'nature'] },
  { city: 'Zanzibar', country: 'Tanzania', region: 'Africa', tags: ['beach', 'spices', 'culture'] },
  { city: 'Serengeti', country: 'Tanzania', region: 'Africa', tags: ['safari', 'wildlife', 'nature'] },
  { city: 'Victoria Falls', country: 'Zimbabwe', region: 'Africa', aliases: ['Livingstone', 'Zambia'], tags: ['waterfall', 'adventure', 'nature'] },
  { city: 'Mauritius', country: 'Mauritius', region: 'Africa', tags: ['beach', 'luxury', 'honeymoon'] },
  { city: 'Seychelles', country: 'Seychelles', region: 'Africa', tags: ['beach', 'luxury', 'exclusive'] },

  // North America
  { city: 'New York', country: 'United States', region: 'North America', aliases: ['NYC', 'New York City', 'USA', 'America'], tags: ['urban', 'culture', 'food'] },
  { city: 'Los Angeles', country: 'United States', region: 'North America', aliases: ['LA', 'USA', 'America'], tags: ['Hollywood', 'beach', 'entertainment'] },
  { city: 'San Francisco', country: 'United States', region: 'North America', aliases: ['SF', 'USA', 'America'], tags: ['tech', 'culture', 'food'] },
  { city: 'Las Vegas', country: 'United States', region: 'North America', aliases: ['Vegas', 'USA', 'America'], tags: ['casino', 'entertainment', 'nightlife'] },
  { city: 'Miami', country: 'United States', region: 'North America', aliases: ['USA', 'America'], tags: ['beach', 'nightlife', 'art deco'] },
  { city: 'Chicago', country: 'United States', region: 'North America', aliases: ['USA', 'America'], tags: ['architecture', 'food', 'culture'] },
  { city: 'Boston', country: 'United States', region: 'North America', aliases: ['USA', 'America'], tags: ['history', 'universities', 'culture'] },
  { city: 'Washington DC', country: 'United States', region: 'North America', aliases: ['DC', 'USA', 'America'], tags: ['politics', 'museums', 'history'] },
  { city: 'Seattle', country: 'United States', region: 'North America', aliases: ['USA', 'America'], tags: ['tech', 'coffee', 'nature'] },
  { city: 'New Orleans', country: 'United States', region: 'North America', aliases: ['NOLA', 'USA', 'America'], tags: ['music', 'food', 'culture'] },
  { city: 'Nashville', country: 'United States', region: 'North America', aliases: ['USA', 'America'], tags: ['music', 'food', 'nightlife'] },
  { city: 'Austin', country: 'United States', region: 'North America', aliases: ['USA', 'America'], tags: ['music', 'tech', 'food'] },
  { city: 'San Diego', country: 'United States', region: 'North America', aliases: ['USA', 'America'], tags: ['beach', 'zoo', 'relaxing'] },
  { city: 'Hawaii', country: 'United States', region: 'North America', aliases: ['Honolulu', 'Maui', 'USA', 'America'], tags: ['beach', 'nature', 'tropical'] },
  { city: 'Orlando', country: 'United States', region: 'North America', aliases: ['USA', 'America', 'Disney'], tags: ['theme parks', 'family', 'Disney'] },
  { city: 'Denver', country: 'United States', region: 'North America', aliases: ['USA', 'America', 'Colorado'], tags: ['mountains', 'outdoors', 'craft beer'] },
  { city: 'Toronto', country: 'Canada', region: 'North America', tags: ['multicultural', 'food', 'culture'] },
  { city: 'Vancouver', country: 'Canada', region: 'North America', tags: ['nature', 'skiing', 'multicultural'] },
  { city: 'Montreal', country: 'Canada', region: 'North America', aliases: ['Montréal'], tags: ['French', 'food', 'culture'] },
  { city: 'Quebec City', country: 'Canada', region: 'North America', aliases: ['Québec'], tags: ['French', 'history', 'charming'] },
  { city: 'Banff', country: 'Canada', region: 'North America', tags: ['mountains', 'skiing', 'nature'] },
  { city: 'Mexico City', country: 'Mexico', region: 'North America', aliases: ['CDMX', 'Ciudad de Mexico'], tags: ['culture', 'food', 'history'] },
  { city: 'Cancun', country: 'Mexico', region: 'North America', aliases: ['Cancún'], tags: ['beach', 'resorts', 'party'] },
  { city: 'Playa del Carmen', country: 'Mexico', region: 'North America', tags: ['beach', 'nightlife', 'ruins'] },
  { city: 'Tulum', country: 'Mexico', region: 'North America', tags: ['beach', 'ruins', 'wellness'] },
  { city: 'Puerto Vallarta', country: 'Mexico', region: 'North America', tags: ['beach', 'LGBTQ', 'food'] },
  { city: 'Oaxaca', country: 'Mexico', region: 'North America', tags: ['culture', 'food', 'mezcal'] },
  { city: 'Guadalajara', country: 'Mexico', region: 'North America', tags: ['tequila', 'culture', 'mariachi'] },

  // Caribbean
  { city: 'Havana', country: 'Cuba', region: 'Caribbean', aliases: ['La Habana'], tags: ['culture', 'classic cars', 'music'] },
  { city: 'Nassau', country: 'Bahamas', region: 'Caribbean', tags: ['beach', 'resort', 'cruise'] },
  { city: 'Jamaica', country: 'Jamaica', region: 'Caribbean', aliases: ['Montego Bay', 'Negril'], tags: ['beach', 'reggae', 'relaxing'] },
  { city: 'Punta Cana', country: 'Dominican Republic', region: 'Caribbean', tags: ['beach', 'resort', 'all-inclusive'] },
  { city: 'San Juan', country: 'Puerto Rico', region: 'Caribbean', tags: ['history', 'beach', 'food'] },
  { city: 'Aruba', country: 'Aruba', region: 'Caribbean', aliases: ['Oranjestad'], tags: ['beach', 'Dutch', 'happy island'] },
  { city: 'St. Lucia', country: 'Saint Lucia', region: 'Caribbean', aliases: ['St Lucia'], tags: ['romantic', 'Pitons', 'luxury'] },
  { city: 'Barbados', country: 'Barbados', region: 'Caribbean', aliases: ['Bridgetown'], tags: ['beach', 'British', 'rum'] },
  { city: 'Turks and Caicos', country: 'Turks and Caicos', region: 'Caribbean', aliases: ['Providenciales', 'TCI'], tags: ['beach', 'luxury', 'quiet'] },
  { city: 'US Virgin Islands', country: 'US Virgin Islands', region: 'Caribbean', aliases: ['St. Thomas', 'St. John'], tags: ['beach', 'cruise', 'snorkeling'] },

  // South America
  { city: 'Rio de Janeiro', country: 'Brazil', region: 'South America', aliases: ['Rio'], tags: ['beach', 'carnival', 'culture'] },
  { city: 'São Paulo', country: 'Brazil', region: 'South America', aliases: ['Sao Paulo'], tags: ['urban', 'food', 'nightlife'] },
  { city: 'Buenos Aires', country: 'Argentina', region: 'South America', tags: ['tango', 'food', 'culture'] },
  { city: 'Patagonia', country: 'Argentina', region: 'South America', aliases: ['El Calafate', 'Ushuaia'], tags: ['nature', 'glaciers', 'adventure'] },
  { city: 'Mendoza', country: 'Argentina', region: 'South America', tags: ['wine', 'Andes', 'food'] },
  { city: 'Lima', country: 'Peru', region: 'South America', tags: ['food', 'culture', 'history'] },
  { city: 'Cusco', country: 'Peru', region: 'South America', aliases: ['Cuzco'], tags: ['Machu Picchu', 'Inca', 'history'] },
  { city: 'Machu Picchu', country: 'Peru', region: 'South America', tags: ['ancient', 'UNESCO', 'bucket list'] },
  { city: 'Bogota', country: 'Colombia', region: 'South America', aliases: ['Bogotá'], tags: ['culture', 'coffee', 'emerging'] },
  { city: 'Cartagena', country: 'Colombia', region: 'South America', tags: ['colonial', 'beach', 'culture'] },
  { city: 'Medellin', country: 'Colombia', region: 'South America', aliases: ['Medellín'], tags: ['transformation', 'weather', 'digital nomad'] },
  { city: 'Santiago', country: 'Chile', region: 'South America', tags: ['wine', 'mountains', 'modern'] },
  { city: 'Valparaiso', country: 'Chile', region: 'South America', aliases: ['Valparaíso'], tags: ['colorful', 'bohemian', 'port'] },
  { city: 'Easter Island', country: 'Chile', region: 'South America', aliases: ['Rapa Nui', 'Isla de Pascua'], tags: ['mysterious', 'remote', 'moai'] },
  { city: 'Quito', country: 'Ecuador', region: 'South America', tags: ['colonial', 'equator', 'culture'] },
  { city: 'Galapagos Islands', country: 'Ecuador', region: 'South America', aliases: ['Galapagos'], tags: ['wildlife', 'unique', 'nature'] },
  { city: 'La Paz', country: 'Bolivia', region: 'South America', tags: ['altitude', 'culture', 'adventure'] },
  { city: 'Uyuni', country: 'Bolivia', region: 'South America', aliases: ['Salt Flats', 'Salar de Uyuni'], tags: ['salt flats', 'unique', 'photography'] },
  { city: 'Montevideo', country: 'Uruguay', region: 'South America', tags: ['relaxed', 'beach', 'culture'] },

  // Oceania
  { city: 'Sydney', country: 'Australia', region: 'Oceania', tags: ['beach', 'opera house', 'harbour'] },
  { city: 'Melbourne', country: 'Australia', region: 'Oceania', tags: ['coffee', 'culture', 'food'] },
  { city: 'Brisbane', country: 'Australia', region: 'Oceania', tags: ['sunshine', 'outdoor', 'relaxed'] },
  { city: 'Gold Coast', country: 'Australia', region: 'Oceania', aliases: ['Surfers Paradise'], tags: ['beach', 'theme parks', 'surfing'] },
  { city: 'Cairns', country: 'Australia', region: 'Oceania', tags: ['Great Barrier Reef', 'diving', 'tropical'] },
  { city: 'Great Barrier Reef', country: 'Australia', region: 'Oceania', aliases: ['Cairns', 'Whitsundays'], tags: ['diving', 'snorkeling', 'nature'] },
  { city: 'Perth', country: 'Australia', region: 'Oceania', tags: ['beach', 'wine', 'isolated'] },
  { city: 'Tasmania', country: 'Australia', region: 'Oceania', aliases: ['Hobart'], tags: ['nature', 'food', 'wilderness'] },
  { city: 'Uluru', country: 'Australia', region: 'Oceania', aliases: ['Ayers Rock'], tags: ['outback', 'spiritual', 'iconic'] },
  { city: 'Auckland', country: 'New Zealand', region: 'Oceania', tags: ['harbour', 'culture', 'adventure'] },
  { city: 'Queenstown', country: 'New Zealand', region: 'Oceania', tags: ['adventure', 'skiing', 'bungee'] },
  { city: 'Rotorua', country: 'New Zealand', region: 'Oceania', tags: ['geothermal', 'Maori', 'nature'] },
  { city: 'Wellington', country: 'New Zealand', region: 'Oceania', tags: ['culture', 'coffee', 'film'] },
  { city: 'Milford Sound', country: 'New Zealand', region: 'Oceania', aliases: ['Fiordland'], tags: ['fjord', 'nature', 'scenic'] },
  { city: 'Fiji', country: 'Fiji', region: 'Oceania', aliases: ['Nadi', 'Suva'], tags: ['beach', 'tropical', 'honeymoon'] },
  { city: 'Bora Bora', country: 'French Polynesia', region: 'Oceania', aliases: ['Tahiti'], tags: ['luxury', 'overwater', 'honeymoon'] },
  { city: 'Tahiti', country: 'French Polynesia', region: 'Oceania', aliases: ['Papeete'], tags: ['tropical', 'romantic', 'polynesian'] },
  { city: 'Samoa', country: 'Samoa', region: 'Oceania', aliases: ['Apia'], tags: ['authentic', 'beach', 'culture'] },
  { city: 'Vanuatu', country: 'Vanuatu', region: 'Oceania', aliases: ['Port Vila'], tags: ['adventure', 'volcano', 'diving'] },
];

// Simple fuzzy search scoring
function getMatchScore(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Exact match
  if (lowerText === lowerQuery) return 100;

  // Starts with query
  if (lowerText.startsWith(lowerQuery)) return 80;

  // Contains query as a word
  if (lowerText.includes(` ${lowerQuery}`) || lowerText.includes(`${lowerQuery} `)) return 60;

  // Contains query anywhere
  if (lowerText.includes(lowerQuery)) return 40;

  // Check for character-by-character fuzzy match
  let queryIndex = 0;
  let matchCount = 0;
  for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      matchCount++;
      queryIndex++;
    }
  }

  if (queryIndex === lowerQuery.length) {
    // All characters matched in order
    return Math.floor((matchCount / lowerText.length) * 30);
  }

  return 0;
}

export function searchDestinations(query: string, limit: number = 8): Destination[] {
  if (!query || query.length < 1) return [];

  const scored = DESTINATIONS.map(dest => {
    // Check city name
    let score = getMatchScore(dest.city, query);

    // Check country name
    const countryScore = getMatchScore(dest.country, query);
    if (countryScore > score) score = countryScore;

    // Check aliases
    if (dest.aliases) {
      for (const alias of dest.aliases) {
        const aliasScore = getMatchScore(alias, query);
        if (aliasScore > score) score = aliasScore;
      }
    }

    // Check region
    if (dest.region) {
      const regionScore = getMatchScore(dest.region, query) * 0.5; // Lower weight for region
      if (regionScore > score) score = regionScore;
    }

    // Check tags
    if (dest.tags) {
      for (const tag of dest.tags) {
        const tagScore = getMatchScore(tag, query) * 0.7; // Slightly lower weight for tags
        if (tagScore > score) score = tagScore;
      }
    }

    return { dest, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, limit)
  .map(item => item.dest);

  return scored;
}
