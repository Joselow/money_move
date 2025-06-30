ALTER TABLE "accounts" RENAME COLUMN "updatedAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "createdAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "transactions" RENAME COLUMN "updatedAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "transactions" RENAME COLUMN "createdAt" TO "updated_at";