from bootstrap import db
from geoalchemy2 import Geometry, shape

class Commune(db.Model):

  __tablename__ = "communes_wgs84"
  __table_args__ = {
    "schema": "bdtopo"
  }

  gid = db.Column(db.Integer, primary_key=True)
  id = db.Column(db.String)
  code_insee = db.Column(db.String(5))
  nom = db.Column(db.String)
  geom = db.Column(Geometry('MULTIPOLYGON', srid=4326))
  centroid = db.Column(Geometry('POINT', srid=4326))

  @property
  def shape(self):
    return shape.to_shape(self.geom)

  @property
  def properties(self):
    return {
      "id": self.id,
      "code_insee": self.code_insee,
      "nom": self.nom
    }
