
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.product_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode text NOT NULL UNIQUE,
  name text NOT NULL,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_product_catalog_barcode ON public.product_catalog(barcode);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_catalog TO anon, authenticated;
GRANT ALL ON public.product_catalog TO service_role;
ALTER TABLE public.product_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read catalog" ON public.product_catalog FOR SELECT USING (true);
CREATE POLICY "public write catalog" ON public.product_catalog FOR INSERT WITH CHECK (true);
CREATE POLICY "public update catalog" ON public.product_catalog FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public delete catalog" ON public.product_catalog FOR DELETE USING (true);
CREATE TRIGGER trg_product_catalog_updated_at BEFORE UPDATE ON public.product_catalog
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
