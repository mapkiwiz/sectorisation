CREATE VIEW postcodes AS
WITH pop as ( 
    SELECT  cp.code_postal, max(fla.population) as max_pop
    FROM codes_postaux cp 
    INNER JOIN communes_fla fla ON cp.code_commune = fla.insee_com
    GROUP BY cp.code_postal)
SELECT DISTINCT cp.code_commune, cp.code_postal, cp.nom_commune, cp.geom
FROM pop INNER JOIN codes_postaux cp ON pop.code_postal = cp.code_postal
INNER JOIN communes_fla fla ON cp.code_commune = fla.insee_com
WHERE fla.population = pop.max_pop ;

