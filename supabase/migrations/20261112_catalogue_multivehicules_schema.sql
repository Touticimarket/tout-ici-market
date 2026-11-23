-- TOUT ICI MARKET — Référentiel technique multivéhicules v1
-- Crée un catalogue unifié sans supprimer ni modifier les catalogues historiques.
-- Données héritées : marquées « a_verifier » jusqu'à une validation de source.
-- Administration de ce référentiel réservée aux opérations SQL/serveur privilégiées.

create table if not exists public.ref_vehicules_types (
  slug text primary key,
  nom text not null,
  groupe text not null,
  nature text not null check (nature in ('vehicule','equipement','service')),
  motorise boolean not null default false,
  catalogue_auto boolean not null default false,
  ordre integer not null default 0,
  actif boolean not null default true
);

create table if not exists public.ref_vehicules_marques (
  id uuid primary key default gen_random_uuid(),
  nom text not null check (length(btrim(nom))>0),
  nom_cle text generated always as (lower(btrim(nom))) stored unique,
  pays text,
  logo_url text,
  actif boolean not null default true,
  statut_validation text not null default 'a_verifier'
    check (statut_validation in ('a_verifier','verifie')),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ref_vehicules_modeles (
  id uuid primary key default gen_random_uuid(),
  marque_id uuid not null references public.ref_vehicules_marques(id) on delete restrict,
  type_slug text not null references public.ref_vehicules_types(slug) on delete restrict,
  nom text not null check (length(btrim(nom))>0),
  nom_cle text generated always as (lower(btrim(nom))) stored,
  annee_debut integer check (annee_debut between 1886 and 2100),
  annee_fin integer check (annee_fin between 1886 and 2100),
  attributs jsonb not null default '{}'::jsonb,
  statut_validation text not null default 'a_verifier'
    check (statut_validation in ('a_verifier','verifie')),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  constraint ref_vehicules_modeles_unique unique (marque_id,type_slug,nom_cle),
  constraint ref_vehicules_modeles_annees check (annee_fin is null or annee_debut is null or annee_fin>=annee_debut)
);

create table if not exists public.ref_vehicules_generations (
  id uuid primary key default gen_random_uuid(),
  modele_id uuid not null references public.ref_vehicules_modeles(id) on delete cascade,
  nom text not null,
  code_constructeur text,
  annee_debut integer check (annee_debut between 1886 and 2100),
  annee_fin integer check (annee_fin between 1886 and 2100),
  carrosserie text,
  caracteristiques jsonb not null default '{}'::jsonb,
  statut_validation text not null default 'a_verifier'
    check (statut_validation in ('a_verifier','verifie')),
  created_at timestamptz not null default now(),
  constraint ref_generations_dates check (annee_fin is null or annee_debut is null or annee_fin>=annee_debut)
);

create table if not exists public.ref_vehicules_versions (
  id uuid primary key default gen_random_uuid(),
  modele_id uuid not null references public.ref_vehicules_modeles(id) on delete cascade,
  generation_id uuid references public.ref_vehicules_generations(id) on delete set null,
  nom text not null check (length(btrim(nom))>0),
  nom_cle text generated always as (lower(btrim(nom))) stored,
  annee_debut integer check (annee_debut between 1886 and 2100),
  annee_fin integer check (annee_fin between 1886 and 2100),
  caracteristiques jsonb not null default '{}'::jsonb,
  statut_validation text not null default 'a_verifier'
    check (statut_validation in ('a_verifier','verifie')),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  constraint ref_vehicules_versions_unique unique (modele_id,nom_cle),
  constraint ref_versions_annees check (annee_fin is null or annee_debut is null or annee_fin>=annee_debut)
);

create table if not exists public.ref_vehicules_motorisations (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.ref_vehicules_versions(id) on delete cascade,
  nom text not null,
  energie text,
  boite text,
  transmission text,
  puissance_ch integer,
  puissance_kw numeric(9,2),
  couple_nm integer,
  cylindree_cm3 integer,
  chevaux_fiscaux integer,
  batterie_kwh numeric(9,2),
  autonomie_km integer,
  co2_g_km integer,
  consommation_l_100km numeric(8,2),
  norme_euro text,
  ptac_kg integer,
  charge_utile_kg integer,
  volume_m3 numeric(10,2),
  longueur_mm integer,
  hauteur_mm integer,
  largeur_mm integer,
  permis text,
  homologation text,
  caracteristiques jsonb not null default '{}'::jsonb,
  statut_validation text not null default 'a_verifier'
    check (statut_validation in ('a_verifier','verifie')),
  created_at timestamptz not null default now()
);

create table if not exists public.ref_vehicules_equipements (
  id uuid primary key default gen_random_uuid(),
  type_slug text references public.ref_vehicules_types(slug) on delete restrict,
  groupe text not null default 'Autres',
  nom text not null check (length(btrim(nom))>0),
  nom_cle text generated always as (lower(btrim(nom))) stored,
  actif boolean not null default true,
  statut_validation text not null default 'a_verifier'
    check (statut_validation in ('a_verifier','verifie')),
  created_at timestamptz not null default now()
);
create unique index if not exists ref_vehicules_equipements_unique
  on public.ref_vehicules_equipements (coalesce(type_slug,''),nom_cle);

create table if not exists public.ref_vehicules_version_equipements (
  version_id uuid not null references public.ref_vehicules_versions(id) on delete cascade,
  equipement_id uuid not null references public.ref_vehicules_equipements(id) on delete cascade,
  statut text not null default 'inconnu'
    check (statut in ('serie','option','pack','inconnu')),
  annee_debut integer,
  annee_fin integer,
  source text,
  primary key(version_id,equipement_id)
);

create table if not exists public.ref_vehicules_attributs (
  code text primary key check (code ~ '^[a-z0-9_]+$'),
  nom text not null,
  rubrique text not null,
  type_valeur text not null check (type_valeur in ('texte','nombre','booleen')),
  unite text,
  types_applicables text[] not null default '{}',
  ordre integer not null default 0
);

create table if not exists public.ref_vehicules_fiches (
  version_id uuid not null references public.ref_vehicules_versions(id) on delete cascade,
  attribut_code text not null references public.ref_vehicules_attributs(code) on delete restrict,
  valeur_texte text,
  valeur_nombre numeric(14,4),
  valeur_booleenne boolean,
  source text,
  verified_at timestamptz,
  primary key(version_id,attribut_code),
  constraint ref_fiches_une_valeur check (
    (case when valeur_texte is not null then 1 else 0 end)
    +(case when valeur_nombre is not null then 1 else 0 end)
    +(case when valeur_booleenne is not null then 1 else 0 end) = 1
  )
);

-- Traçabilité de chaque enregistrement importé (source et identifiant d'origine).
create table if not exists public.ref_vehicules_origines (
  entite text not null check (entite in ('modele','version','motorisation')),
  source_table text not null check (source_table in (
    'modeles_auto','auto_modeles','moto_modeles',
    'finitions_auto','auto_finitions','moto_versions',
    'motorisations_auto','auto_motorisations'
  )),
  source_id uuid not null,
  cible_id uuid not null,
  importe_le timestamptz not null default now(),
  primary key(entite,source_table,source_id)
);

create index if not exists ref_vehicules_modeles_marque_idx on public.ref_vehicules_modeles(marque_id,nom);
create index if not exists ref_vehicules_modeles_type_idx on public.ref_vehicules_modeles(type_slug,nom);
create index if not exists ref_vehicules_versions_modele_idx on public.ref_vehicules_versions(modele_id,nom);
create index if not exists ref_vehicules_mot_version_idx on public.ref_vehicules_motorisations(version_id);
create index if not exists ref_vehicules_equipements_type_idx on public.ref_vehicules_equipements(type_slug,groupe);
create index if not exists ref_vehicules_origines_cible_idx on public.ref_vehicules_origines(entite,cible_id);

-- Données de référence publiquement consultables mais NON modifiables par les utilisateurs.
do $$
declare table_ref text;
begin
  foreach table_ref in array array[
    'ref_vehicules_types','ref_vehicules_marques','ref_vehicules_modeles',
    'ref_vehicules_generations','ref_vehicules_versions','ref_vehicules_motorisations',
    'ref_vehicules_equipements','ref_vehicules_version_equipements',
    'ref_vehicules_attributs','ref_vehicules_fiches'
  ] loop
    execute format('alter table public.%I enable row level security',table_ref);
    execute format('revoke all on public.%I from public,anon,authenticated',table_ref);
    execute format('grant select on public.%I to anon,authenticated',table_ref);
    execute format('create policy "Lecture catalogue multivehicules" on public.%I for select to anon,authenticated using (true)',table_ref);
  end loop;
end $$;
-- Seuls les administrateurs (SQL/serveur privilégié) voient la traçabilité des imports.
alter table public.ref_vehicules_origines enable row level security;
revoke all on public.ref_vehicules_origines from public,anon,authenticated;
