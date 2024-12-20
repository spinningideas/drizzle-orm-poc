CREATE TABLE IF NOT EXISTS continents (
  continent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  continent_code VARCHAR(2) NOT NULL,
  continent_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS countries (
  country_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) NOT NULL,
  country_code3 VARCHAR(3) NOT NULL,
  country_name VARCHAR(100) NOT NULL UNIQUE,
  capital VARCHAR(100),
  continent_id UUID NOT NULL REFERENCES continents(continent_id),
  area INTEGER,
  population INTEGER,
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  currency_code VARCHAR(3)
);
