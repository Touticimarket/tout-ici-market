-- Localisation à la commune pour les annonces automobiles françaises
-- Les coordonnées sont celles du centre de commune (pas de divulgation d'une adresse privée).
alter table public.annonces_auto
 add column if not exists code_postal text,
 add column if not exists code_insee text,
 add column if not exists latitude double precision,
 add column if not exists longitude double precision;
-- Les communes sont proposées via l'API officielle geo.api.gouv.fr,
-- ce qui évite une copie locale qui serait à actualiser à chaque changement administratif.
