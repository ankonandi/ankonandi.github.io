-- Public bucket for the resume. Anyone can read it, only signed-in users can write.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resume', 'resume', true, 5242880, array['application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['application/pdf'];

create policy "resume insert by signed-in user" on storage.objects
  for insert to authenticated with check (bucket_id = 'resume');
create policy "resume update by signed-in user" on storage.objects
  for update to authenticated using (bucket_id = 'resume') with check (bucket_id = 'resume');
create policy "resume delete by signed-in user" on storage.objects
  for delete to authenticated using (bucket_id = 'resume');
