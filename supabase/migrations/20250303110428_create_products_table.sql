-- Create the products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
    owner_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create an index for faster searches on product names
CREATE INDEX idx_products_name ON public.products (name);

-- Set up row-level security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Define policies (Adjust based on your app needs)
-- Allow everyone to read the list of products
CREATE POLICY "Allow read access to everyone"
ON public.products
FOR SELECT
USING (true);

-- Allow authenticated users to insert new products
CREATE POLICY "Allow authenticated users to insert products"
ON public.products
FOR INSERT
USING (auth.role() = 'authenticated');

-- Allow authenticated users to update/delete products they own
CREATE POLICY "Allow owners to modify their products"
ON public.products
FOR UPDATE, DELETE
USING (auth.role() = 'authenticated' AND auth.uid() = owner_id);

-- Allow only admin users to insert/update/delete products
CREATE POLICY "Allow admin to modify products"
ON public.products
FOR ALL
USING (auth.role() = 'admin');
