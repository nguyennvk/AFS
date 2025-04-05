-- CreateEnum
CREATE TYPE "BOOK_STATUS" AS ENUM ('PAID', 'UNPAID');

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "account_id" SERIAL NOT NULL,
    "account_email" TEXT NOT NULL,
    "account_password" TEXT NOT NULL,
    "account_picture" TEXT NOT NULL DEFAULT '',
    "account_first_name" TEXT NOT NULL,
    "account_last_name" TEXT NOT NULL DEFAULT '',
    "account_phone_number" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "hotel_id" SERIAL NOT NULL,
    "hotel_name" TEXT NOT NULL,
    "hotel_street" TEXT NOT NULL,
    "hotel_city" TEXT NOT NULL,
    "hotel_country" TEXT NOT NULL,
    "hotel_location_long" DOUBLE PRECISION NOT NULL,
    "hotel_location_lat" DOUBLE PRECISION NOT NULL,
    "hotel_review_point" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hotel_review_num" INTEGER NOT NULL DEFAULT 0,
    "hotel_description" TEXT DEFAULT '',
    "hotel_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hotel_logo" TEXT NOT NULL DEFAULT '',
    "hotel_image_dir" TEXT[] DEFAULT ARRAY['']::TEXT[],
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("hotel_id")
);

-- CreateTable
CREATE TABLE "Room" (
    "room_number" TEXT NOT NULL,
    "room_type" TEXT NOT NULL,
    "room_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "room_amenities" TEXT DEFAULT '',
    "room_image_dir" TEXT[] DEFAULT ARRAY['']::TEXT[],
    "hotel_id" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("room_number","hotel_id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "reservation_id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "room_number" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "BOOK_STATUS" NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "customer_id" INTEGER NOT NULL,
    "booking_reference" TEXT NOT NULL,
    "status" "BOOK_STATUS" NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("booking_reference")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" SERIAL NOT NULL,
    "notification_type" TEXT NOT NULL DEFAULT '',
    "notification_message" TEXT NOT NULL DEFAULT '',
    "notification_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notification_read" BOOLEAN NOT NULL DEFAULT false,
    "account_id" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE INDEX "City_city_idx" ON "City"("city");

-- CreateIndex
CREATE UNIQUE INDEX "City_city_country_key" ON "City"("city", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_code_key" ON "Airport"("code");

-- CreateIndex
CREATE INDEX "Airport_code_idx" ON "Airport"("code");

-- CreateIndex
CREATE INDEX "Airport_city_idx" ON "Airport"("city");

-- CreateIndex
CREATE UNIQUE INDEX "Account_account_email_key" ON "Account"("account_email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_account_phone_number_key" ON "Account"("account_phone_number");

-- AddForeignKey
ALTER TABLE "Airport" ADD CONSTRAINT "Airport_city_country_fkey" FOREIGN KEY ("city", "country") REFERENCES "City"("city", "country") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Account"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_hotel_city_hotel_country_fkey" FOREIGN KEY ("hotel_city", "hotel_country") REFERENCES "City"("city", "country") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_room_number_hotel_id_fkey" FOREIGN KEY ("room_number", "hotel_id") REFERENCES "Room"("room_number", "hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Account"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Account"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;
