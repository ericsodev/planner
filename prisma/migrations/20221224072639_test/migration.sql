-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_planId_fkey";

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
