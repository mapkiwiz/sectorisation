# Master data

Données de référence directement incoporée dans l'application :

* communes_fla_p.geojson : chefs-lieux des communes
  récupérés de GeoFLA ;
  utilisé par le service CommuneGeocoder

* postcodes.geojson : localisation des codes postaux ;
  utilisé par le service PostcodeGeocoder
  
* postcodes.csv : version compacte de postcodes.geojson

* code_insee_to_code_postal.csv :
  relation CODE COMMUNE -> CODE POSTAL ;
  non utilisé dans l'application pour l'instant