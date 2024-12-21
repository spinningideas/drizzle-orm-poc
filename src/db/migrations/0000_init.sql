CREATE TABLE "continents" (
	"continent_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"continent_code" varchar(2) NOT NULL,
	"continent_name" varchar(100) NOT NULL,
	CONSTRAINT "continents_continent_name_unique" UNIQUE("continent_name")
);
CREATE TABLE "countries" (
	"country_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_code" varchar(2) NOT NULL,
	"country_code3" varchar(3) NOT NULL,
	"country_name" varchar(100) NOT NULL,
	"capital" varchar(100),
	"continent_id" uuid NOT NULL,
	"area" integer,
	"population" integer,
	"latitude" numeric(10, 6),
	"longitude" numeric(10, 6),
	"currency_code" varchar(3),
	CONSTRAINT "countries_country_name_unique" UNIQUE("country_name")
);

ALTER TABLE "countries" ADD CONSTRAINT "countries_continent_id_continents_continent_id_fk" FOREIGN KEY ("continent_id") REFERENCES "public"."continents"("continent_id") ON DELETE no action ON UPDATE no action;