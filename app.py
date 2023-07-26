from flask import Flask, jsonify, render_template
import psycopg2

app = Flask(__name__)

DB_HOST = 'localhost'
DB_NAME = 'suicide_vs_gdp'
DB_USER = 'postgres'
DB_PASSWORD = 'postgres'


def connect_db():
    conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
    return conn


@app.route('/')
def index():
    return render_template('map.html')


@app.route('/ShelontaClusterMap')
def index2():
    return render_template('shelonta_cluster.html')

@app.route('/data')
def data():
    conn = connect_db()
    cur = conn.cursor()
    query = "SELECT s.country, s.year, s.hom, s.suicide_mortality_rate, s.gdp, s.income_level, c.lat, c.long FROM s_h_gdp s INNER JOIN country c ON s.country = c.name LIMIT 100;"
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
                "coordinates": [lat, long]
            }
        }
        geojson_data["features"].append(feature)

    cur.close()
    conn.close()
    return jsonify(geojson_data)


if __name__ == '__main__':
    app.run(debug=True,port=8080)
