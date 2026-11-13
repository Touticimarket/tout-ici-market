-- Import non destructif des anciens catalogues dans le référentiel multivéhicules.
-- Les données importées restent « a_verifier » ; toute valeur a une table/id de provenance.
insert into public.ref_vehicules_marques(nom,pays,logo_url)
select distinct on (lower(nom)) nom,pays,logo_url
from (select 1 source_priority,btrim(nom)::text nom,pays::text pays,logo_url::text logo_url
from public.marques_auto where nullif(btrim(nom),'') is not null
union all
select 2,btrim(nom)::text,pays::text,logo_url::text
from public.auto_marques where nullif(btrim(nom),'') is not null
union all
select 3,btrim(nom)::text,pays::text,null::text
from public.moto_marques where nullif(btrim(nom),'') is not null) b
order by lower(nom),source_priority
on conflict (nom_cle) do nothing;

with sources as (select 'modeles_auto'::text source_table, m.id source_id, b.nom::text marque,
m.nom::text nom, 'voiture'::text type_slug, '{}'::jsonb attributs
from public.modeles_auto m join public.marques_auto b on b.id=m.marque_id
where nullif(btrim(m.nom),'') is not null
union all
select 'auto_modeles',m.id,b.nom::text,m.nom::text,
case when lower(coalesce(m.type_vehicule,'')) in ('suv','4x4') then 'suv-4x4'
     when lower(coalesce(m.type_vehicule,''))='utilitaire' then 'utilitaire'
     when lower(coalesce(m.type_vehicule,''))='véhicule loisirs' then 'van'
     else 'voiture' end,
jsonb_build_object('segment',m.segment,'type_vehicule_origine',m.type_vehicule)
from public.auto_modeles m join public.auto_marques b on b.id=m.marque_id
where nullif(btrim(m.nom),'') is not null
union all
select 'moto_modeles',m.id,b.nom::text,m.nom::text,
case when lower(coalesce(m.type_moto,'')) like '%scooter%' then 'scooter'
     when lower(coalesce(m.type_moto,'')) like '%trail%' then 'moto-trail'
     when lower(coalesce(m.type_moto,'')) like '%sportive%' then 'moto-sportive'
     when lower(coalesce(m.type_moto,'')) like '%custom%' then 'moto-custom'
     else 'moto' end,
jsonb_build_object('type_moto_origine',m.type_moto,'cylindree_cm3',m.cylindree,'permis',m.permis)
from public.moto_modeles m join public.moto_marques b on b.id=m.marque_id
where nullif(btrim(m.nom),'') is not null)
insert into public.ref_vehicules_modeles(marque_id,type_slug,nom,attributs)
select distinct on (marque.id,sources.type_slug,lower(btrim(sources.nom)))
  marque.id,sources.type_slug,btrim(sources.nom),sources.attributs
from sources join public.ref_vehicules_marques marque
  on marque.nom_cle=lower(btrim(sources.marque))
join public.ref_vehicules_types typ on typ.slug=sources.type_slug
order by marque.id,sources.type_slug,lower(btrim(sources.nom)),sources.source_table
on conflict (marque_id,type_slug,nom_cle) do nothing;

with sources as (select 'modeles_auto'::text source_table, m.id source_id, b.nom::text marque,
m.nom::text nom, 'voiture'::text type_slug, '{}'::jsonb attributs
from public.modeles_auto m join public.marques_auto b on b.id=m.marque_id
where nullif(btrim(m.nom),'') is not null
union all
select 'auto_modeles',m.id,b.nom::text,m.nom::text,
case when lower(coalesce(m.type_vehicule,'')) in ('suv','4x4') then 'suv-4x4'
     when lower(coalesce(m.type_vehicule,''))='utilitaire' then 'utilitaire'
     when lower(coalesce(m.type_vehicule,''))='véhicule loisirs' then 'van'
     else 'voiture' end,
jsonb_build_object('segment',m.segment,'type_vehicule_origine',m.type_vehicule)
from public.auto_modeles m join public.auto_marques b on b.id=m.marque_id
where nullif(btrim(m.nom),'') is not null
union all
select 'moto_modeles',m.id,b.nom::text,m.nom::text,
case when lower(coalesce(m.type_moto,'')) like '%scooter%' then 'scooter'
     when lower(coalesce(m.type_moto,'')) like '%trail%' then 'moto-trail'
     when lower(coalesce(m.type_moto,'')) like '%sportive%' then 'moto-sportive'
     when lower(coalesce(m.type_moto,'')) like '%custom%' then 'moto-custom'
     else 'moto' end,
jsonb_build_object('type_moto_origine',m.type_moto,'cylindree_cm3',m.cylindree,'permis',m.permis)
from public.moto_modeles m join public.moto_marques b on b.id=m.marque_id
where nullif(btrim(m.nom),'') is not null)
insert into public.ref_vehicules_origines(entite,source_table,source_id,cible_id)
select 'modele',sources.source_table,sources.source_id,modeles.id
from sources
join public.ref_vehicules_marques marques
  on marques.nom_cle=lower(btrim(sources.marque))
join public.ref_vehicules_modeles modeles
  on modeles.marque_id=marques.id
  and modeles.type_slug=sources.type_slug
  and modeles.nom_cle=lower(btrim(sources.nom))
on conflict(entite,source_table,source_id) do nothing;

with versions_source as (select 'finitions_auto'::text source_table,f.id source_id,f.nom::text nom,
'modeles_auto'::text modele_source,f.modele_id modele_source_id
from public.finitions_auto f where nullif(btrim(f.nom),'') is not null
union all
select 'auto_finitions',f.id,f.nom::text,'auto_modeles',f.modele_id
from public.auto_finitions f where nullif(btrim(f.nom),'') is not null
union all
select 'moto_versions',v.id,v.nom::text,'moto_modeles',v.modele_id
from public.moto_versions v where nullif(btrim(v.nom),'') is not null)
insert into public.ref_vehicules_versions(modele_id,nom,caracteristiques)
select distinct on (origine.cible_id,lower(btrim(versions_source.nom)))
  origine.cible_id,btrim(versions_source.nom),
  jsonb_build_object('source_version','catalogue interne historique')
from versions_source
join public.ref_vehicules_origines origine
  on origine.entite='modele'
 and origine.source_table=versions_source.modele_source
 and origine.source_id=versions_source.modele_source_id
order by origine.cible_id,lower(btrim(versions_source.nom)),versions_source.source_table
on conflict (modele_id,nom_cle) do nothing;

with versions_source as (select 'finitions_auto'::text source_table,f.id source_id,f.nom::text nom,
'modeles_auto'::text modele_source,f.modele_id modele_source_id
from public.finitions_auto f where nullif(btrim(f.nom),'') is not null
union all
select 'auto_finitions',f.id,f.nom::text,'auto_modeles',f.modele_id
from public.auto_finitions f where nullif(btrim(f.nom),'') is not null
union all
select 'moto_versions',v.id,v.nom::text,'moto_modeles',v.modele_id
from public.moto_versions v where nullif(btrim(v.nom),'') is not null)
insert into public.ref_vehicules_origines(entite,source_table,source_id,cible_id)
select 'version',versions_source.source_table,versions_source.source_id,versions.id
from versions_source
join public.ref_vehicules_origines modele_origine
  on modele_origine.entite='modele'
 and modele_origine.source_table=versions_source.modele_source
 and modele_origine.source_id=versions_source.modele_source_id
join public.ref_vehicules_versions versions
  on versions.modele_id=modele_origine.cible_id
 and versions.nom_cle=lower(btrim(versions_source.nom))
on conflict(entite,source_table,source_id) do nothing;

-- Identifiants historiques conservés sur les motorisations pour empêcher toute duplication.
alter table public.ref_vehicules_motorisations
  add column if not exists source_table text;
alter table public.ref_vehicules_motorisations
  add column if not exists source_id uuid;
create unique index if not exists ref_vehicules_motorisations_source_idx
  on public.ref_vehicules_motorisations(source_table,source_id)
  where source_table is not null and source_id is not null;

-- Deux sources historiques : 3 737 et 2 466 configurations moteur.
insert into public.ref_vehicules_motorisations(
  version_id,nom,energie,boite,puissance_ch,source_table,source_id
)
select versions.cible_id,m.nom,m.carburant,m.boite,m.puissance_ch,
  'motorisations_auto',m.id
from public.motorisations_auto m
join public.ref_vehicules_origines versions
  on versions.entite='version'
 and versions.source_table='finitions_auto'
 and versions.source_id=m.finition_id
where nullif(btrim(m.nom),'') is not null
on conflict do nothing;

insert into public.ref_vehicules_motorisations(
 version_id,nom,energie,boite,transmission,puissance_ch,chevaux_fiscaux,
 batterie_kwh,autonomie_km,co2_g_km,consommation_l_100km,norme_euro,
 ptac_kg,charge_utile_kg,volume_m3,longueur_mm,hauteur_mm,permis,
 caracteristiques,source_table,source_id
)
select versions.cible_id,
  coalesce(nullif(btrim(m.moteur),''),'Motorisation non précisée'),
  m.carburant,m.boite_vitesse,m.transmission,coalesce(m.puissance_ch,m.puissance),
  m.chevaux_fiscaux,m.batterie_kwh,m.autonomie_km,m.co2_g_km,
  m.consommation_l_100km,m.norme_euro,m.ptac_kg,m.charge_utile_kg,m.volume_m3,
  m.longueur_mm,m.hauteur_mm,m.permis,
  jsonb_build_object(
    'places_carte_grise',m.places_carte_grise,
    'couchages',m.couchages,
    'longueur_cellule_mm',m.longueur_cellule_mm,
    'hauteur_cellule_mm',m.hauteur_cellule_mm,
    'type_couchage',m.type_couchage,
    'eau_propre_l',m.eau_propre_l,
    'eau_usee_l',m.eau_usee_l,
    'chauffage',m.chauffage,
    'panneau_solaire',m.panneau_solaire
  ),
  'auto_motorisations',m.id
from public.auto_motorisations m
join public.ref_vehicules_origines versions
  on versions.entite='version'
 and versions.source_table='auto_finitions'
 and versions.source_id=m.finition_id
on conflict do nothing;
