-- supabase/migrations/xxxx_add_completed_at.sql
alter table tasks add column completed_at timestamptz;

create or replace function set_completed_at()
returns trigger as $$
begin
  if NEW.completed = true and OLD.completed = false then
    NEW.completed_at = now();
  elsif NEW.completed = false then
    NEW.completed_at = null;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_set_completed_at
before update on tasks
for each row
execute function set_completed_at();