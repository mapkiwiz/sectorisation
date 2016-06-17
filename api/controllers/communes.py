from bootstrap import app, db
from models import Commune
from config import API_PREFIX
from ModestMaps.OpenStreetMap import Provider
from ModestMaps.Core import Coordinate
from shapely.geometry import box
from flask import request, jsonify, abort
from flask_cors import cross_origin

OSM = Provider()

def as_bbox(se, nw, srid=4326):
  wkt = box(nw.lon, se.lat, se.lon, nw.lat).wkt
  return 'SRID=%d;%s' % (srid, wkt)

@app.route(API_PREFIX + '/communes/tiles/<int:z>/<int:x>/<int:y>.geojson', methods=[ 'GET' ])
@cross_origin()
def tile(x, y, z):

  # start = time()
  # TODO Add z limit -> 204 No Content
  c = Coordinate(y, x, z)
  nw = OSM.coordinateLocation(c)
  se = OSM.coordinateLocation(c.down().right())
  box = as_bbox(se, nw, 4326)
  query = Commune.query.filter(Commune.centroid.intersects(box))
  features = []
  for f in query:
    feature = {
      'type': 'Feature',
      'id': f.id,
      'properties': f.properties,
      'geometry': f.shape.__geo_interface__
    }
    features.append(feature)
  # data_time = time() - start
  response = jsonify({
    'type': 'FeatureCollection',
    'features': features
  })
  # serialize_time = time() - start - data_time
  # print (x,y,z), "Data:", data_time, "Serialize:", serialize_time
  return response

@app.route(API_PREFIX + '/communes/search/byloc', methods = [ 'GET' ])
def search_by_location():

  lon = float(request.args.get('lon'))
  lat = float(request.args.get('lat'))
  query = Commune.query.filter(Commune.geom.contains('SRID=%d;POINT(%f %f)' % (4326, lon, lat)))
  c = query.first()
  if c is  None:
    return abort(404)
  else:
    return jsonify({
      'type': 'Feature',
      'id': c.id,
      'properties': c.properties,
      'geometry': c.shape.__geo_interface__
    })


