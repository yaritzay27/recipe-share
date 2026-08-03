# Web Development Final Project - RecipeShare

Submitted by: **Yaritza**

This web app: **RecipeShare is a social recipe forum where users can publish recipes, browse a polished masonry-style feed, search and sort posts, upvote recipes, comment on recipe pages, and edit or delete their own posts using a secret key.**

Time spent: **X** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add:
    - additional textual content
    - an image added as an external image URL
- [x] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    - creation time
    - upvotes count
  - Users can search for posts by title
- [x] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page.
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times
- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:

- [x] Web app implements pseudo-authentication
  - Users can only edit and delete posts by entering the secret key, which is set by the user during post creation
  - Only the original user author of a post can update or delete it by using the matching secret key
- [ ] Users can repost a previous post by referencing its post ID. On the post page of the new post
  - Users can repost a previous post by referencing its post ID
  - On the post page of the new post, the referenced post is displayed and linked, creating a thread
- [ ] Users can customize the interface
  - e.g., selecting the color scheme or showing the content and image of each post on the home feed
- [x] Users can add more characterics to their posts
  - Users can set recipe details such as cuisine, meal type, difficulty, prep time, cook time, servings, ingredients, and instructions
  - Users can filter posts by cuisine and meal type on the home feed
- [x] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [x] Pinterest-inspired masonry recipe feed with large image cards
* [x] Responsive mobile layout
* [x] Polished empty states and loading skeletons
* [x] Broken image fallback handling
* [x] Supabase-ready CRUD service layer
* [x] 404 page for unknown routes

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='public/recipe-share.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

One challenge was balancing the assignment's default feed requirement with the more visual RecipeShare concept. The feed keeps the core post metadata visible while also using recipe images, cuisine badges, and meal type badges to make the app feel more like a real recipe-sharing product.

## License

    Copyright 2026 Yaritza

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

---

# RecipeShare Setup Notes

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
npm install
npm run dev
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
