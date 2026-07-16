-- Seed file for initial data (can be left empty or populated with initial resources)

-- Initial admin profile metadata helper example:
-- Insert mock resources if desired
INSERT INTO public.resources (title, type, category, storage_path)
VALUES
  ('Guía de Entrenamiento Inicial', 'pdf', 'training', 'training.pdf'),
  ('Plan de Alimentación Base', 'pdf', 'nutrition', 'nutrition.pdf'),
  ('Video de Bienvenida', 'video', 'welcome', 'welcome.mp4')
ON CONFLICT DO NOTHING;
