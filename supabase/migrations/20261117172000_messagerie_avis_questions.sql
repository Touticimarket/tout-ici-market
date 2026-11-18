
-- TOUT ICI MARKET — Messagerie et retours d'expérience sécurisés.
-- Les deux types d'annonces publiées sont pris en charge sans toucher à leurs tables.
create table if not exists public.market_conversations (
  id uuid primary key default gen_random_uuid(),
  listing_type text not null check (listing_type in ('auto','market')),
  listing_id uuid not null,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  titre_annonce text not null check (char_length(btrim(titre_annonce)) between 1 and 180),
  statut text not null default 'ouverte' check (statut in ('ouverte','terminee')),
  created_at timestamptz not null default now(),
  unique (listing_type,listing_id,buyer_id),
  check (buyer_id <> seller_id)
);
create index if not exists market_conversations_seller_idx on public.market_conversations(seller_id,created_at desc);
create index if not exists market_conversations_buyer_idx on public.market_conversations(buyer_id,created_at desc);
alter table public.market_conversations enable row level security;
create policy "Lire mes conversations" on public.market_conversations
  for select to authenticated using (
    buyer_id=(select auth.uid()) or seller_id=(select auth.uid())
  );
create policy "Contacter le vendeur de l annonce" on public.market_conversations
  for insert to authenticated with check (
    buyer_id=(select auth.uid())
    and seller_id <> (select auth.uid())
    and (
      (listing_type='auto' and exists (
        select 1 from public.annonces_auto a
        where a.id=listing_id and a.user_id=seller_id and a.statut='publiee'
      ))
      or
      (listing_type='market' and exists (
        select 1 from public.annonces_marketplace a
        where a.id=listing_id and a.user_id=seller_id and a.statut='publiee'
      ))
    )
  );
create policy "Cloturer uniquement mes conversations vendeur" on public.market_conversations
  for update to authenticated using (seller_id=(select auth.uid()))
  with check (seller_id=(select auth.uid()));
revoke all on public.market_conversations from public,anon,authenticated;
grant select,insert on public.market_conversations to authenticated;
grant update(statut) on public.market_conversations to authenticated;

create table if not exists public.market_blocages (
  bloqueur_id uuid not null references auth.users(id) on delete cascade,
  bloque_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(bloqueur_id,bloque_id),
  check(bloqueur_id <> bloque_id)
);
alter table public.market_blocages enable row level security;
create policy "Lire mes blocages" on public.market_blocages for select to authenticated
  using(bloqueur_id=(select auth.uid()));
create policy "Bloquer un utilisateur" on public.market_blocages for insert to authenticated
  with check(bloqueur_id=(select auth.uid()));
create policy "Debloquer un utilisateur" on public.market_blocages for delete to authenticated
  using(bloqueur_id=(select auth.uid()));
revoke all on public.market_blocages from public,anon,authenticated;
grant select,insert,delete on public.market_blocages to authenticated;

create table if not exists public.market_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.market_conversations(id) on delete cascade,
  expediteur_id uuid not null references auth.users(id) on delete cascade,
  contenu text not null check (char_length(btrim(contenu)) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists market_messages_by_chat_idx on public.market_messages(conversation_id,created_at,id);
alter table public.market_messages enable row level security;
create policy "Lire messages de mes conversations" on public.market_messages
  for select to authenticated using(
    exists(select 1 from public.market_conversations c where c.id=conversation_id
      and ((select auth.uid())=c.buyer_id or (select auth.uid())=c.seller_id))
  );
create policy "Envoyer un message dans ma conversation" on public.market_messages
  for insert to authenticated with check (
    expediteur_id=(select auth.uid())
    and exists(select 1 from public.market_conversations c where c.id=conversation_id
      and c.statut='ouverte'
      and ((select auth.uid())=c.buyer_id or (select auth.uid())=c.seller_id))
  );
revoke all on public.market_messages from public,anon,authenticated;
grant select,insert on public.market_messages to authenticated;

-- Les notifications sont privées et ne peuvent pas être créées depuis le navigateur.
create table if not exists public.market_notifications (
  id uuid primary key default gen_random_uuid(),
  destinataire_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.market_conversations(id) on delete cascade,
  message_id uuid not null unique references public.market_messages(id) on delete cascade,
  lu boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists market_notifications_unread_idx
  on public.market_notifications(destinataire_id,created_at desc) where lu=false;
alter table public.market_notifications enable row level security;
create policy "Lire mes notifications messages" on public.market_notifications
  for select to authenticated using(destinataire_id=(select auth.uid()));
create policy "Marquer lues mes notifications" on public.market_notifications
  for update to authenticated using(destinataire_id=(select auth.uid()))
  with check(destinataire_id=(select auth.uid()));
revoke all on public.market_notifications from public,anon,authenticated;
grant select on public.market_notifications to authenticated;
grant update(lu) on public.market_notifications to authenticated;

-- Questions publiques et réponses du vendeur pour une annonce encore publiée.
create table if not exists public.market_questions (
  id uuid primary key default gen_random_uuid(),
  listing_type text not null check (listing_type in ('auto','market')),
  listing_id uuid not null,
  auteur_id uuid not null references auth.users(id) on delete cascade,
  vendeur_id uuid not null references auth.users(id) on delete cascade,
  question text not null check (char_length(btrim(question)) between 5 and 1000),
  reponse text check (reponse is null or char_length(btrim(reponse)) between 1 and 1500),
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  check(auteur_id <> vendeur_id)
);
create index if not exists market_questions_listing_idx on public.market_questions(listing_type,listing_id,created_at desc) where visible=true;
alter table public.market_questions enable row level security;
create policy "Questions visibles annonce publiee" on public.market_questions
  for select to anon,authenticated using (
    visible and (
      (listing_type='auto' and exists(
        select 1 from public.annonces_auto a where a.id=listing_id and a.user_id=vendeur_id and a.statut='publiee'
      )) or
      (listing_type='market' and exists(
        select 1 from public.annonces_marketplace a where a.id=listing_id and a.user_id=vendeur_id and a.statut='publiee'
      ))
    )
  );
create policy "Question acheteur sur annonce publiee" on public.market_questions
  for insert to authenticated with check (
    auteur_id=(select auth.uid()) and vendeur_id <> (select auth.uid())
    and (
      (listing_type='auto' and exists(
        select 1 from public.annonces_auto a where a.id=listing_id and a.user_id=vendeur_id and a.statut='publiee'
      )) or
      (listing_type='market' and exists(
        select 1 from public.annonces_marketplace a where a.id=listing_id and a.user_id=vendeur_id and a.statut='publiee'
      ))
    )
  );
create policy "Reponse du vendeur uniquement" on public.market_questions
  for update to authenticated using (vendeur_id=(select auth.uid()) and visible)
  with check (vendeur_id=(select auth.uid()) and visible);
revoke all on public.market_questions from public,anon,authenticated;
grant select on public.market_questions to anon,authenticated;
grant insert on public.market_questions to authenticated;
grant update(reponse) on public.market_questions to authenticated;

-- Avis liés à une conversation réellement échangée et clôturée.
create table if not exists public.market_avis (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.market_conversations(id) on delete cascade,
  auteur_id uuid not null references auth.users(id) on delete cascade,
  cible_id uuid not null references auth.users(id) on delete cascade,
  note integer not null check(note between 1 and 5),
  commentaire text not null check (char_length(btrim(commentaire)) between 10 and 1200),
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  unique (conversation_id,auteur_id),
  check (auteur_id <> cible_id)
);
create index if not exists market_avis_target_idx on public.market_avis(cible_id,created_at desc) where visible=true;
alter table public.market_avis enable row level security;
create policy "Avis publics non masques" on public.market_avis for select
  to anon,authenticated using(visible);
create policy "Avis entre participants apres transaction" on public.market_avis
  for insert to authenticated with check (
    auteur_id=(select auth.uid())
    and exists (
      select 1 from public.market_conversations c
      where c.id=conversation_id and c.statut='terminee'
        and (
          (c.buyer_id=auteur_id and c.seller_id=cible_id) or
          (c.seller_id=auteur_id and c.buyer_id=cible_id)
        )
        and exists(select 1 from public.market_messages m
           where m.conversation_id=c.id and m.expediteur_id=c.buyer_id)
        and exists(select 1 from public.market_messages m
           where m.conversation_id=c.id and m.expediteur_id=c.seller_id)
    )
  );
revoke all on public.market_avis from public,anon,authenticated;
grant select on public.market_avis to anon,authenticated;
grant insert on public.market_avis to authenticated;

create table if not exists public.market_signalements (
  id uuid primary key default gen_random_uuid(),
  auteur_id uuid not null references auth.users(id) on delete cascade,
  cible_type text not null check(cible_type in ('message','conversation','question','avis','utilisateur')),
  cible_id uuid not null,
  motif text not null check (char_length(btrim(motif)) between 5 and 500),
  created_at timestamptz not null default now()
);
create index if not exists market_signalements_date_idx on public.market_signalements(created_at desc);
alter table public.market_signalements enable row level security;
create policy "Signaler un contenu" on public.market_signalements
  for insert to authenticated with check(auteur_id=(select auth.uid()));
create policy "Voir mes signalements" on public.market_signalements
  for select to authenticated using(auteur_id=(select auth.uid()));
revoke all on public.market_signalements from public,anon,authenticated;
grant select,insert on public.market_signalements to authenticated;

-- Des déclencheurs non exposés empêchent les messages aux utilisateurs ayant bloqué l'émetteur.
create schema if not exists private_market;
create or replace function private_market.verify_message_unblocked()
returns trigger language plpgsql security definer set search_path=''
as $$
declare v_buyer uuid; v_seller uuid;
begin
  select c.buyer_id,c.seller_id into v_buyer,v_seller
  from public.market_conversations c where c.id=new.conversation_id;
  if v_buyer is null or new.expediteur_id not in (v_buyer,v_seller) then
    raise exception 'Participant non autorisé';
  end if;
  if new.expediteur_id is distinct from auth.uid() then
    raise exception 'Expéditeur non autorisé';
  end if;
  if exists(select 1 from public.market_blocages b where
    (b.bloqueur_id=v_buyer and b.bloque_id=v_seller)
    or (b.bloqueur_id=v_seller and b.bloque_id=v_buyer)) then
    raise exception 'Échange bloqué par un participant';
  end if;
  return new;
end;
$$;
revoke all on function private_market.verify_message_unblocked() from public;
drop trigger if exists market_messages_block_before_insert on public.market_messages;
create trigger market_messages_block_before_insert before insert on public.market_messages
  for each row execute function private_market.verify_message_unblocked();

create or replace function private_market.notify_new_message()
returns trigger language plpgsql security definer set search_path=''
as $$
declare v_recipient uuid;
begin
  select case when c.buyer_id=new.expediteur_id then c.seller_id else c.buyer_id end
    into v_recipient from public.market_conversations c where c.id=new.conversation_id;
  if v_recipient is not null then
    insert into public.market_notifications(destinataire_id,conversation_id,message_id)
      values(v_recipient,new.conversation_id,new.id);
  end if;
  return new;
end;
$$;
revoke all on function private_market.notify_new_message() from public;
drop trigger if exists market_messages_notify_after_insert on public.market_messages;
create trigger market_messages_notify_after_insert after insert on public.market_messages
  for each row execute function private_market.notify_new_message();
