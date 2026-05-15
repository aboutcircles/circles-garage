-- Make builders.org_addr optional.
--
-- org_addr is the on-chain Circles org address that receives CRC payouts.
-- It's collected during signup but not all builders have one yet (and the
-- signup form treats it as optional), so the column must allow null to
-- prevent empty submissions from 500-ing.

alter table public.builders alter column org_addr drop not null;
