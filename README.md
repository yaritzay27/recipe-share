# RecipeShare

RecipeShare is a polished React + Vite recipe forum where users can create recipe posts, browse a masonry-style feed, search and sort recipes, upvote posts, comment on recipe pages, and use a creator-set secret key to edit or delete their own recipes.

## Tech Stack

- React
- Vite
- React Router
- Supabase
- JavaScript
- CSS

## Run Locally

```bash
pnpm install
pnpm run dev
```

## Supabase Setup

Create a new Supabase project, open the SQL editor, and run this schema.

```sql
create extension if not exists pgcrypto;

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  ingredients text,
  instructions text,
  image_url text,
  prep_time integer check (prep_time is null or prep_time >= 0),
  cook_time integer check (cook_time is null or cook_time >= 0),
  servings integer check (servings is null or servings >= 0),
  difficulty text,
  meal_type text,
  cuisine text,
  secret_key text not null,
  created_at timestamptz not null default now(),
  upvotes integer not null default 0 check (upvotes >= 0)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  comment text not null,
  created_at timestamptz not null default now()
);

create index recipes_created_at_idx on public.recipes (created_at desc);
create index recipes_upvotes_idx on public.recipes (upvotes desc);
create index recipes_title_idx on public.recipes using gin (to_tsvector('english', title));
create index comments_recipe_id_idx on public.comments (recipe_id);

alter table public.recipes enable row level security;
alter table public.comments enable row level security;

create policy "Recipes are readable by everyone"
on public.recipes for select
to anon, authenticated
using (true);

create policy "Anyone can create recipes"
on public.recipes for insert
to anon, authenticated
with check (true);

create policy "Anyone can update recipes"
on public.recipes for update
to anon, authenticated
using (true)
with check (true);

create policy "Anyone can delete recipes"
on public.recipes for delete
to anon, authenticated
using (true);

create policy "Comments are readable by everyone"
on public.comments for select
to anon, authenticated
using (true);

create policy "Anyone can create comments"
on public.comments for insert
to anon, authenticated
with check (true);
```

The project uses pseudo-auth for the class requirement. The app checks the secret key before navigating to edit/delete, and the Supabase update/delete queries also filter by `secret_key`. For a production app, replace this with Supabase Auth and stricter RLS policies.

## Credentials

You can paste your credentials directly into [src/services/supabaseClient.js](src/services/supabaseClient.js):

```js
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

Or create a local `.env` file:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## Routes

- `/` - Home feed with masonry recipe cards, search, sort, and filters
- `/create` - Create recipe form
- `/post/:id` - Recipe details, upvotes, comments, edit, and delete
- `/edit/:id` - Secret-key-protected edit form
- `*` - 404 page

## Optional Seed Data

Run this after the tables are created if you want a quick visual demo.

```sql
insert into public.recipes
  (title, description, ingredients, instructions, image_url, prep_time, cook_time, servings, difficulty, meal_type, cuisine, secret_key, upvotes)
values
  (
    'Crispy Lemon Herb Chicken',
    'A bright weeknight dinner with crispy edges and a pan sauce.',
    'Chicken thighs\nLemon\nGarlic\nParsley\nOlive oil\nSalt\nBlack pepper',
    'Pat chicken dry.\nSear skin-side down until golden.\nAdd lemon, garlic, and herbs.\nRoast until cooked through.\nSpoon pan sauce over the top.',
    'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80',
    15,
    35,
    4,
    'Easy',
    'Dinner',
    'Mediterranean',
    'demo123',
    18
  ),
  (
    'Mango Chili Breakfast Tacos',
    'Sweet, spicy, and fast enough for a weekday morning.',
    'Corn tortillas\nEggs\nMango\nRed onion\nCilantro\nChili flakes\nLime',
    'Warm tortillas.\nSoft scramble the eggs.\nDice mango and onion.\nAssemble tacos with herbs, chili, and lime.',
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80',
    10,
    8,
    2,
    'Easy',
    'Breakfast',
    'Mexican',
    'demo123',
    31
  );
```

