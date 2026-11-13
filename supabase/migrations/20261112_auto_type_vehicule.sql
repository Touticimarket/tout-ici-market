-- Le type précis de véhicule est conservé avec chaque annonce automobile.
-- Les anciennes annonces restent classées « voiture » sans modification de leurs données.
alter table public.annonces_auto
  add column if not exists type_vehicule text not null default 'voiture';

create index if not exists annonces_auto_type_vehicule_idx
  on public.annonces_auto(type_vehicule);
