--Create database proj3;
--drop table s_h_gdp;
--drop table country;
CREATE TABLE s_h_gdp (
    country VARCHAR(255),
	year INTEGER,
	hom DOUBLE PRECISION,
    suicide_mortality_rate DOUBLE PRECISION,
	 gdp bigint,
    income_level VARCHAR(100)
);
CREATE TABLE country (
    name VARCHAR(255),
    lat NUMERIC(8, 4),
    long NUMERIC(8, 4)
);

select * from country;
select * from s_h_gdp;
ALTER TABLE s_h_gdp ALTER COLUMN gdp TYPE bigint;
