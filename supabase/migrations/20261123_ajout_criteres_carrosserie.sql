-- TOUT ICI MARKET — nouveaux critères automobiles.
-- A exécuter sur le projet Supabase existant avant activation des filtres.
-- Migration non destructive : aucun enregistrement existant n'est supprimé.
alter table public.annonces_auto
  add column if not exists couleur text,
  add column if not exists nombre_portes integer,
  add column if not exists nombre_places integer,
  add column if not exists carrosserie text;

-- Les anciennes annonces restent accessibles, avec NULL pour les nouveaux critères.
