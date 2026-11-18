-- TOUT ICI MARKET — Annonces multi-catégories persistantes.
-- Complète annonces_auto sans remplacer les catalogues historiques.
create table if not exists public.annonces_marketplace (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  categorie text not null check (categorie in (
    'automobile','immobilier','emploi','maison-jardin','telephones','bricolage',
    'mode','jeux-consoles','nautisme','vacances-loisirs','autres'
  )),
  sous_categorie text not null,
  titre text not null check (char_length(btrim(titre)) between 4 and 160),
  description text not null check (char_length(btrim(description)) between 10 and 15000),
  prix numeric(12,2) check (prix is null or prix >= 0),
  ville text not null check (char_length(btrim(ville)) between 2 and 150),
  code_postal text,
  caracteristiques jsonb not null default '{}'::jsonb,
  photos text[] not null default '{}'::text[] check (coalesce(array_length(photos,1),0)<=10),
  statut text not null default 'brouillon'
    check (statut in ('brouillon','publiee','reservee','vendue','archivee')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists annonces_marketplace_public_idx
  on public.annonces_marketplace(categorie,created_at desc) where statut='publiee';
create index if not exists annonces_marketplace_owner_idx
  on public.annonces_marketplace(user_id,updated_at desc);
create index if not exists annonces_marketplace_type_idx
  on public.annonces_marketplace(categorie,sous_categorie);
alter table public.annonces_marketplace enable row level security;

drop policy if exists "Annonces marketplace publiques" on public.annonces_marketplace;
create policy "Annonces marketplace publiques" on public.annonces_marketplace
  for select to anon,authenticated using (statut='publiee');
drop policy if exists "Mes annonces marketplace" on public.annonces_marketplace;
create policy "Mes annonces marketplace" on public.annonces_marketplace
  for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists "Créer mes annonces marketplace" on public.annonces_marketplace;
create policy "Créer mes annonces marketplace" on public.annonces_marketplace
  for insert to authenticated with check (user_id=(select auth.uid()));
drop policy if exists "Modifier mes annonces marketplace" on public.annonces_marketplace;
create policy "Modifier mes annonces marketplace" on public.annonces_marketplace
  for update to authenticated using (user_id=(select auth.uid()))
  with check (user_id=(select auth.uid()));
drop policy if exists "Supprimer mes annonces marketplace" on public.annonces_marketplace;
create policy "Supprimer mes annonces marketplace" on public.annonces_marketplace
  for delete to authenticated using (user_id=(select auth.uid()));
revoke all on public.annonces_marketplace from public,anon,authenticated;
grant select on public.annonces_marketplace to anon;
grant select,insert,update,delete on public.annonces_marketplace to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('annonces-marketplace','annonces-marketplace',true,10485760,
  ARRAY['image/jpeg','image/png','image/webp']::text[])
on conflict (id) do nothing;
drop policy if exists "Marketplace upload propriétaire" on storage.objects;
create policy "Marketplace upload propriétaire" on storage.objects
  for insert to authenticated with check (
    bucket_id='annonces-marketplace'
    and (storage.foldername(name))[1]=(select auth.uid())::text
  );
drop policy if exists "Marketplace lecture propriétaire" on storage.objects;
create policy "Marketplace lecture propriétaire" on storage.objects
  for select to authenticated using (
    bucket_id='annonces-marketplace'
    and (storage.foldername(name))[1]=(select auth.uid())::text
  );
drop policy if exists "Marketplace suppression propriétaire" on storage.objects;
create policy "Marketplace suppression propriétaire" on storage.objects
  for delete to authenticated using (
    bucket_id='annonces-marketplace'
    and (storage.foldername(name))[1]=(select auth.uid())::text
  );
