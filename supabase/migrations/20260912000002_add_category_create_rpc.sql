-- Create a category for the caller's active household directly from auth.uid().
-- The household is resolved in the database, so the client cannot submit a foreign household_id.
create or replace function public.create_category_for_current_household(
  p_name text,
  p_description text,
  p_type text,
  p_icon text,
  p_icon_bg text,
  p_icon_color text
)
returns public.categories
language plpgsql
security definer
set search_path = public
as $$
declare
  v_household_id uuid;
  v_category public.categories;
begin
  select household_id
    into v_household_id
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  order by created_at asc
  limit 1;

  if v_household_id is null then
    raise exception 'Active household admin membership was not found';
  end if;

  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'Category name is required';
  end if;

  if p_type not in ('expense', 'income') then
    raise exception 'Invalid category type';
  end if;

  insert into public.categories (
    household_id,
    name,
    description,
    type,
    icon,
    icon_bg,
    icon_color,
    is_custom
  )
  values (
    v_household_id,
    trim(p_name),
    nullif(trim(p_description), ''),
    p_type,
    p_icon,
    p_icon_bg,
    p_icon_color,
    true
  )
  returning * into v_category;

  return v_category;
end;
$$;

revoke all on function public.create_category_for_current_household(text, text, text, text, text, text) from public;
grant execute on function public.create_category_for_current_household(text, text, text, text, text, text) to authenticated;
