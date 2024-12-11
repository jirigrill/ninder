-- CreateTable
CREATE TABLE "card_interactions" (
    "id" SERIAL NOT NULL,
    "name_id" INTEGER,
    "user_id" VARCHAR(255) NOT NULL,
    "action" VARCHAR(10),
    "session_id" INTEGER,

    CONSTRAINT "card_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "letter_code" VARCHAR(10),
    "total_cards" INTEGER DEFAULT 0,
    "visible" BOOLEAN DEFAULT false,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "name_categories" (
    "name_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "name_categories_pkey" PRIMARY KEY ("name_id","category_id")
);

-- CreateTable
CREATE TABLE "names" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "meaning" TEXT,

    CONSTRAINT "names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "pairingcode" VARCHAR(255) NOT NULL,
    "initiatoruserid" VARCHAR(255) NOT NULL,
    "partneruserid" VARCHAR(255),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_letter_code_key" ON "categories"("name", "letter_code");

-- CreateIndex
CREATE UNIQUE INDEX "names_name_key" ON "names"("name");

-- AddForeignKey
ALTER TABLE "card_interactions" ADD CONSTRAINT "card_interactions_name_id_fkey" FOREIGN KEY ("name_id") REFERENCES "names"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "name_categories" ADD CONSTRAINT "name_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "name_categories" ADD CONSTRAINT "name_categories_name_id_fkey" FOREIGN KEY ("name_id") REFERENCES "names"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

