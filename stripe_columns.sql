-- Run this once in Supabase SQL Editor (mobile is fine)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stripe_session_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent text;

CREATE INDEX IF NOT EXISTS idx_orders_user_status       ON public.orders (user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at        ON public.orders (created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON public.orders (status, created_at);
