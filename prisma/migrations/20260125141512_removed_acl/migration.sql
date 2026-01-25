/*
  Warnings:

  - You are about to drop the `AccessControlList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccessMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AclMembership` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccessControlList" DROP CONSTRAINT "AccessControlList_updaterACLId_fkey";

-- DropForeignKey
ALTER TABLE "AccessMapping" DROP CONSTRAINT "AccessMapping_aclId_fkey";

-- DropForeignKey
ALTER TABLE "AclMembership" DROP CONSTRAINT "AclMembership_memberACLId_fkey";

-- DropForeignKey
ALTER TABLE "AclMembership" DROP CONSTRAINT "AclMembership_parentACLId_fkey";

-- DropTable
DROP TABLE "AccessControlList";

-- DropTable
DROP TABLE "AccessMapping";

-- DropTable
DROP TABLE "AclMembership";
