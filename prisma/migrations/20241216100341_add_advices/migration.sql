-- CreateTable
CREATE TABLE "advices" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "advices_pkey" PRIMARY KEY ("id")
);
