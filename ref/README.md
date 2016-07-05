# Scripts de préparation de données

## Sources de données

* Base officielle des codes postaux
  publiée sur data.gouv.fr :
  
  fichier insee_codes_postaux.csv :
  http://www.data.gouv.fr/fr/datasets/base-officielle-des-codes-postaux/
  
* GeoFLA :

  Communes françaises publiées par l'IGN :
  http://professionels.ign.fr/

## Traitements

1. Transformation des codes communes en codes postaux

   le script code_insee_to_code_postal.sql
   extraie la corresponcace CODE INSEE -> CODE POSTAL
   de la base officielle des codes postaux
   en réalisation un traitement approprié pour les grandes communes
   qui sont desservies par plus d'un code postal (le code postal
   le plus petit est retenu)

2. Localisation des codes postaux :

   le script postcodes.sql calcule pour chaque code postal
   une localisation en croisant la base officielle des codes postaux
   avec GeoFLA pour déterminer la commune la plus peuplée
   desservie par le bureau distributeur correspondant au code postal,
   et localise le code postal au chef-lieu de cette commune