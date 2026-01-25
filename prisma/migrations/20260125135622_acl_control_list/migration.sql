-- CreateTable
CREATE TABLE "AccessControlList" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "updaterACLId" TEXT,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessControlList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AclMembership" (
    "id" TEXT NOT NULL,
    "parentACLId" TEXT NOT NULL,
    "memberACLId" TEXT,
    "memberUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AclMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessMapping" (
    "resourceId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "aclId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessMapping_pkey" PRIMARY KEY ("resourceId","actionId","aclId")
);

-- CreateIndex
CREATE INDEX "AclMembership_memberUserId_idx" ON "AclMembership"("memberUserId");

-- CreateIndex
CREATE INDEX "AclMembership_parentACLId_idx" ON "AclMembership"("parentACLId");

-- CreateIndex
CREATE UNIQUE INDEX "AclMembership_parentACLId_memberACLId_memberUserId_key" ON "AclMembership"("parentACLId", "memberACLId", "memberUserId");

-- CreateIndex
CREATE INDEX "AccessMapping_resourceId_actionId_idx" ON "AccessMapping"("resourceId", "actionId");

-- AddForeignKey
ALTER TABLE "AccessControlList" ADD CONSTRAINT "AccessControlList_updaterACLId_fkey" FOREIGN KEY ("updaterACLId") REFERENCES "AccessControlList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AclMembership" ADD CONSTRAINT "AclMembership_parentACLId_fkey" FOREIGN KEY ("parentACLId") REFERENCES "AccessControlList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AclMembership" ADD CONSTRAINT "AclMembership_memberACLId_fkey" FOREIGN KEY ("memberACLId") REFERENCES "AccessControlList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessMapping" ADD CONSTRAINT "AccessMapping_aclId_fkey" FOREIGN KEY ("aclId") REFERENCES "AccessControlList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
