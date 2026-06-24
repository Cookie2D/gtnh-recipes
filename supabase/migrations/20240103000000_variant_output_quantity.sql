-- Move output_quantity from recipes to recipe_variants
-- Each variant can produce a different amount

ALTER TABLE recipe_variants
  ADD COLUMN output_quantity integer NOT NULL DEFAULT 1;

-- Backfill from parent recipe
UPDATE recipe_variants rv
SET output_quantity = r.output_quantity
FROM recipes r
WHERE rv.recipe_id = r.id;

ALTER TABLE recipes
  DROP COLUMN output_quantity;
