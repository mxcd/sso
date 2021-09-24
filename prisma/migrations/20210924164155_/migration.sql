-- AlterTable
ALTER TABLE "User" ALTER COLUMN "validated" SET DEFAULT false,
ALTER COLUMN "locked" SET DEFAULT true,
ALTER COLUMN "resetCode" DROP NOT NULL;
