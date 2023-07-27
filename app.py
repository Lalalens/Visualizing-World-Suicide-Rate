from flask import Flask, jsonify, render_template
from flask_cors import CORS
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()  # take environment variables from .env.

API_KEY = os.getenv("apiKey")

app = Flask(__name__)
CORS(app)

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")


def connect_db():
    conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
    return conn


@app.route('/heatmap')
def index():
    return render_template('heatmap.html')


@app.route('/ShelontaClusterMap')
def index2():
    return render_template('shelonta_cluster.html', API_KEY=API_KEY)

@app.route('/data')
def data():
    conn = connect_db()
    cur = conn.cursor()
    query = "SELECT s.country, s.year, s.hom, s.suicide_mortality_rate, s.gdp, s.income_level, c.lat, c.long FROM s_h_gdp s INNER JOIN country c ON s.country = c.name;"
    cur.execute(query)
    geojson_data = {
        "type": "FeatureCollection",
        "features": []
    }
    for row in cur.fetchall():
      
        country, year, hom, s_m_r, gdp, income, lat, long = row
        
        feature = {
             "type": "Feature",
            "properties": {
                "name": country,
                "Year": year,
                "homicide rate (per 100k)": hom,
                "suicide rate (per 100k)": s_m_r,
                "GDP": gdp,
                "income level": income
            },
            "geometry": {
                "type": "Point",
                "coordinates": [long, lat]
            }
            
        }
        geojson_data["features"].append(feature)

    cur.close()
    conn.close()
    return jsonify(geojson_data)


if __name__ == '__main__':
    app.run(debug=True,port=8080)
