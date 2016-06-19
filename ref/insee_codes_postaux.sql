CREATE TABLE codes_postaux (
    CODE_COMMUNE varchar(5),
    NOM_COMMUNE varchar(100),
    CODE_POSTAL varchar(5),
    ACHEMINEMENT varchar(100),
    LIGNE5 varchar(100)
);

\COPY codes_postaux FROM 'insee_codes_postaux.csv' WITH CSV HEADER DELIMITER ';';

CREATE INDEX codes_postaux_code_commune_idx
ON codes_postaux (CODE_COMMUNE);

CREATE INDEX codes_postaux_code_postal_idx
ON codes_postaux (CODE_POSTAL);
