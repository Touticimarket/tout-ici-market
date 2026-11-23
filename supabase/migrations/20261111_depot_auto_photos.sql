-- TOUT ICI MARKET : activer le stockage des photos automobiles
-- Réutilise les tables EXISTANTES public.annonces_auto et public.annonces_auto_photos.
-- Ne détruit aucune donnée et ne recrée aucune table d'annonces.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'annonces-auto', 'annonces-auto', true, 10485760,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update
set public=excluded.public,
    file_size_limit=excluded.file_size_limit,
    allowed_mime_types=excluded.allowed_mime_types;

-- Voir son propre brouillon est nécessaire pour retourner son id et le publier après l'ajout des photos.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='annonces_auto' and policyname='auto_annonces_owner_read_v1') then
    create policy auto_annonces_owner_read_v1 on public.annonces_auto
      for select to authenticated using ((select auth.uid())=user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='annonces_auto_photos' and policyname='auto_photos_owner_read_v1') then
    create policy auto_photos_owner_read_v1 on public.annonces_auto_photos
      for select to authenticated
      using (exists (
        select 1 from public.annonces_auto a
        where a.id = annonce_id and a.user_id = (select auth.uid())
      ));
  end if;
end $$;

-- Chaque photo doit appartenir à une annonce brouillon de l'utilisateur connecté.
-- Dossiers : <uuid_utilisateur>/<uuid_annonce>/<nom_unique>.<extension>.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='auto_photo_owner_insert_v1') then
    create policy auto_photo_owner_insert_v1 on storage.objects
      for insert to authenticated
      with check (
        bucket_id='annonces-auto'
        and (storage.foldername(name))[1]=(select auth.uid())::text
        and exists (
          select 1 from public.annonces_auto a
          where a.id::text=(storage.foldername(name))[2]
            and a.user_id=(select auth.uid())
            and a.statut='brouillon'
        )
      );
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='auto_photo_owner_select_v1') then
    create policy auto_photo_owner_select_v1 on storage.objects
      for select to authenticated
      using (bucket_id='annonces-auto' and (storage.foldername(name))[1]=(select auth.uid())::text);
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='auto_photo_owner_delete_v1') then
    create policy auto_photo_owner_delete_v1 on storage.objects
      for delete to authenticated
      using (bucket_id='annonces-auto' and (storage.foldername(name))[1]=(select auth.uid())::text);
  end if;
end $$;
