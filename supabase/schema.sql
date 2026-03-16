create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  studio_name text not null,
  tagline text not null,
  description text not null,
  email text not null,
  phone text not null,
  address text not null,
  location_name text not null,
  map_embed_url text,
  instagram_url text,
  facebook_url text,
  hero_primary_cta text default 'Orarend megtekintese',
  hero_secondary_cta text default 'Ora foglalasa',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'owner' check (role in ('owner', 'editor', 'assistant')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null,
  description text not null,
  audience text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  price_label text not null,
  delivery_mode text not null,
  is_active boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 10,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  title text not null,
  description text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location_name text not null,
  location_address text not null,
  capacity integer not null check (capacity > 0),
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled', 'completed')),
  is_recurring boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete restrict,
  class_id uuid references public.classes(id) on delete set null,
  request_type text not null default 'scheduled' check (request_type in ('scheduled', 'custom')),
  preferred_date timestamptz,
  name text not null,
  email text not null,
  phone text not null,
  note text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'archived')),
  privacy_accepted boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.blog_categories(id) on delete restrict,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image_url text not null,
  featured boolean not null default false,
  published_at timestamptz not null default timezone('utc', now()),
  read_time text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  meta_title text not null,
  meta_description text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text not null,
  quote text not null,
  is_visible boolean not null default true,
  sort_order integer not null default 10,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  );
$$;

alter table public.settings enable row level security;
alter table public.admin_users enable row level security;
alter table public.services enable row level security;
alter table public.classes enable row level security;
alter table public.bookings enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.testimonials enable row level security;

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings for select using (true);

drop policy if exists "admins manage settings" on public.settings;
create policy "admins manage settings" on public.settings
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage admin_users" on public.admin_users;
create policy "admins manage admin_users" on public.admin_users
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active services" on public.services;
create policy "public read active services" on public.services
for select using (is_active = true);

drop policy if exists "admins manage services" on public.services;
create policy "admins manage services" on public.services
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read scheduled classes" on public.classes;
create policy "public read scheduled classes" on public.classes
for select using (status = 'scheduled');

drop policy if exists "admins manage classes" on public.classes;
create policy "admins manage classes" on public.classes
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage bookings" on public.bookings;
create policy "admins manage bookings" on public.bookings
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read categories" on public.blog_categories;
create policy "public read categories" on public.blog_categories for select using (true);

drop policy if exists "admins manage categories" on public.blog_categories;
create policy "admins manage categories" on public.blog_categories
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read published posts" on public.blog_posts;
create policy "public read published posts" on public.blog_posts
for select using (status = 'published');

drop policy if exists "admins manage posts" on public.blog_posts;
create policy "admins manage posts" on public.blog_posts
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage contact messages" on public.contact_messages;
create policy "admins manage contact messages" on public.contact_messages
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read visible testimonials" on public.testimonials;
create policy "public read visible testimonials" on public.testimonials
for select using (is_visible = true);

drop policy if exists "admins manage testimonials" on public.testimonials;
create policy "admins manage testimonials" on public.testimonials
for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at before update on public.settings
for each row execute procedure public.set_updated_at();

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at before update on public.admin_users
for each row execute procedure public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at before update on public.services
for each row execute procedure public.set_updated_at();

drop trigger if exists set_classes_updated_at on public.classes;
create trigger set_classes_updated_at before update on public.classes
for each row execute procedure public.set_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at before update on public.bookings
for each row execute procedure public.set_updated_at();

drop trigger if exists set_blog_categories_updated_at on public.blog_categories;
create trigger set_blog_categories_updated_at before update on public.blog_categories
for each row execute procedure public.set_updated_at();

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at before update on public.blog_posts
for each row execute procedure public.set_updated_at();

drop trigger if exists set_contact_messages_updated_at on public.contact_messages;
create trigger set_contact_messages_updated_at before update on public.contact_messages
for each row execute procedure public.set_updated_at();

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at before update on public.testimonials
for each row execute procedure public.set_updated_at();

insert into public.settings (
  studio_name,
  tagline,
  description,
  email,
  phone,
  address,
  location_name,
  facebook_url
)
select
  'Ohm Joga',
  'Kapcsolat onmagaddal a test, a legzes es a figyelem altal.',
  'Premium, nyugodt, modern jogaelmeny foglalasi rendszerrel es tudastarral.',
  'jogaattilaval@gmail.com',
  '+36 30 123 4567',
  'A pontos szemelyes helyszint a foglalas visszaigazolasaban kuldjuk el.',
  'Szemelyes alkalmak es online kapcsolodas',
  'https://www.facebook.com/attila.valkovszki'
where not exists (select 1 from public.settings);

insert into storage.buckets (id, name, public)
select 'media', 'media', true
where not exists (select 1 from storage.buckets where id = 'media');

drop policy if exists "public read media bucket" on storage.objects;
create policy "public read media bucket" on storage.objects
for select using (bucket_id = 'media');

drop policy if exists "admins upload media bucket" on storage.objects;
create policy "admins upload media bucket" on storage.objects
for all using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());
