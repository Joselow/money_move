ALTER TABLE "transactions" ALTER COLUMN "date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "date" SET DEFAULT now();