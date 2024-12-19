-- CreateTable
CREATE TABLE "category_history" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "first_category_id" INTEGER,
    "second_category_id" INTEGER,
    "third_category_id" INTEGER,
    "fourth_category_id" INTEGER,

    CONSTRAINT "category_history_pkey" PRIMARY KEY ("id")
);
