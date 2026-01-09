-- Add UPDATE policy for orders table to allow status updates
CREATE POLICY "Anyone can update orders"
ON public.orders
FOR UPDATE
USING (true)
WITH CHECK (true);