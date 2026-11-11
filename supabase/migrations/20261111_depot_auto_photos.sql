-- TOUT ICI MARKET | Dépôt de photos automobiles
-- À exécuter une seule fois dans Supabase SQL Editor APRÈS revue des politiques existantes.
-- Ne supprime aucune table existante.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('annonces-auto', 'annonces-auto', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.annonces_auto_medias (
  id bigint generated always as identity primary key,
  annonce_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  ordre integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists annonces_auto_medias_annonce_idx
  on public.annonces_auto_medias(annonce_id, ordre);
create index if not exists annonces_auto_medias_user_idx
  on public.annonces_auto_medias(user_id);
alter table public.annonces_auto_medias enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='annonces_auto_medias' and policyname='medias_auto_public_read') then
    create policy medias_auto_public_read on public.annonces_auto_medias
      for select to anon, authenticated using (
        exists (
          select 1 from public.annonces_auto a
          where a.id::text = annonce_id and a.statut = 'publiee'
        ) or auth.uid() = user_id
      );
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='annonces_auto_medias' and policyname='medias_auto_owner_insert') then
    create policy medias_auto_owner_insert on public.annonces_auto_medias
      for insert to authenticated with check (
        auth.uid() = user_id and exists (
          select 1 from public.annonces_auto a
          where a.id::text = annonce_id and a.user_id = auth.uid()
        )
      );
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='annonces_auto_medias' and policyname='medias_auto_owner_delete') then
    create policy medias_auto_owner_delete on public.annonces_auto_medias
      for delete to authenticated using (auth.uid() = user_id);
  end if;
end $$;

-- L'accès au dépôt est réservé à l'utilisateur connecté, dans son dossier personnel.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='auto_photos_public_read') then
    create policy auto_photos_public_read on storage.objects
      for select to anon, authenticated using (bucket_id = 'annonces-auto');
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='auto_photos_owner_upload') then
    create policy auto_photos_owner_upload on storage.objects
      for insert to authenticated
      with check (bucket_id = 'annonces-auto' and split_part(name,'/',1) = auth.uid()::text);
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='auto_photos_owner_delete') then
    create policy auto_photos_owner_delete on storage.objects
      for delete to authenticated
      using (bucket_id = 'annonces-auto' and split_part(name,'/',1) = auth.uid()::text);
  end if;
end $$;

-- Accès nécessaires à la création, à la lecture et à la publication des annonces.
alter table public.annonces_auto enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='annonces_auto' and policyname='auto_annonces_public_read') then
    create policy auto_annonces_public_read on public.annonces_auto
      for select to anon, authenticated using (statut = 'publiee');
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='annonces_auto' and policyname='auto_annonces_owner_read') then
    create policy auto_annonces_owner_read on public.annonces_auto
      for select to authenticated using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='annonces_auto' and policyname='auto_annonces_owner_insert') then
    create policy auto_annonces_owner_insert on public.annonces_auto
      for insert to authenticated with check (user_id = auth.uid() and mia_verifie = false);
  end if;
end $$;
