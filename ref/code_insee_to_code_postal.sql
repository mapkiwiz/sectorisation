-- Extraction de la table de correspondance
-- CODE_INSEE -> CODE_POSTAL
-- depuis la table des codes postaux
CREATE TEMP TABLE tmp_code_insee_code_postal AS
SELECT DISTINCT code_commune, code_postal
FROM codes_postaux ;

-- Communes ayant plus d'un code postal (200+ communes)
-- On choisit arbitrairement le plus petit code postal
WITH grandes_communes AS (
    SELECT code_commune, min(code_postal) as code_postal
    FROM (
        SELECT DISTINCT code_commune, code_postal
        FROM codes_postaux) s1
    GROUP BY code_commune
    HAVING count(code_postal) > 1 )
UPDATE tmp_code_insee_code_postal cc
SET code_postal = gco.code_postal
FROM grandes_communes gco
WHERE cc.code_commune = gco.code_commune;

-- Suppression des derniers doublons
CREATE TABLE code_insee_code_postal AS
SELECT DISTINCT * FROM tmp_code_insee_code_postal;
