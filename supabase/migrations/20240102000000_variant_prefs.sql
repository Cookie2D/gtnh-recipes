-- Stores per-user preferred variant index for each recipe item name.
-- Upserted whenever the user switches a crafting method in the calculator.
CREATE TABLE IF NOT EXISTS public.user_variant_prefs (
  user_id      UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name    TEXT    NOT NULL,
  variant_index INTEGER NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, item_name)
);

ALTER TABLE public.user_variant_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own variant prefs"
  ON public.user_variant_prefs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
