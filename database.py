# -----------------------------------------------------------------------
# database.py
# Author: Expresso backend developers
# -----------------------------------------------------------------------

import mysql.connector
from mysql.connector import errorcode
import pandas as pd
import os
from sys import stderr


# encode the image: convert digital data to binary format
def convertToBinaryData(filename):
    with open(filename, 'rb') as file:
        binaryData = file.read()
    return binaryData


# establish a connection with the database using the mysql connector
def connect():
    try:
        mydb = mysql.connector.connect(host="198.199.71.236", user="ccmobile_coffee",
                                       passwd="1Latte2G0!", database="ccmobile_coffee_club")
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)

    return mydb


# disconnect from the database
def disconnect(mydb):
    mydb.close()


# verify if a table named table_name exists in the database, mydb
def check_table_exists(mydb, table_name):
    mycursor = mydb.cursor()

    check_table = "SHOW TABLES LIKE %s"

    try:
        mycursor.execute(check_table, (table_name,))
        result = mycursor.fetchone()
    except Exception as e:
        print("check_table_exists failed: %s", str(e), file=stderr)

    mycursor.close()
    return True if result is not None else False


# build the table that will hold the images and their names
def build_images_table(mydb):
    check_table = check_table_exists(mydb, "images")

    if not check_table:
        mycursor = mydb.cursor()

        try:
            mycursor.execute("CREATE TABLE images (item VARCHAR(255), picture BLOB)")
        except Exception as e:
            print("build_images_table creating table failed: %s", str(e), file=stderr)

        directory = r'/Users/HariRaval/Desktop/expresso/images'
        for filename in os.listdir(directory):
            if filename.endswith(".jpeg"):
                picture = directory + '/' + filename
                # convert the picture to binary data
                pic = convertToBinaryData(picture)
                item = filename[0:filename.find('.')]
                sql = "INSERT INTO images (item, picture) VALUES (%s, %s)"

                val = (item, pic)

                try:
                    mycursor.execute(sql, val)
                except Exception as e:
                    print("build_images_table insertion images failed: %s", str(e), file=stderr)

                mydb.commit()

        mycursor.close()


# build the table that holds the menu details; read from excel spreadsheet provided by Coffee Club
def build_menu_table(mydb):
    check_table = check_table_exists(mydb, "menu")

    if not check_table:

        mycursor = mydb.cursor()

        try:
            mycursor.execute("CREATE TABLE menu (size VARCHAR(255), item VARCHAR(255), price DECIMAL(10,2), " +
                             "category VARCHAR(255), availability BOOLEAN, description VARCHAR(255),"
                             " definition VARCHAR(255))")
        except Exception as e:
            print("build_menu_table creating table failed: %s", str(e), file=stderr)

        menuItems = pd.read_excel("Menu Items.xlsx")

        for index, row in menuItems.iterrows():
            size = row['size']
            item = row['item']
            price = row['price']
            category = row['category']
            description = row['description']
            definition = row['definition']
            # protect against SQL injections
            sql = "INSERT INTO menu (size, item, price, category, availability, description, definition) " \
                  "VALUES (%s, %s, %s, %s, %s, %s, %s)"
            val = (size, item, price, category, 1, description, definition)

            try:
                mycursor.execute(sql, val)
            except Exception as e:
                print("build_menu_table inserting item failed: %s", str(e), file=stderr)

            mydb.commit()

        mycursor.close()


# build a table to hold all orders/transactions history
def build_order_history_table(mydb):
    check_table = check_table_exists(mydb, "order_history")

    if not check_table:
        mycursor = mydb.cursor()

        try:
            # type_of_payment: 1 indicates online payment and 0 indicates in-store payment...
            # payment_status: 1 indicates paid and 0 indicates not paid
            # order_status: 0 indicates order not completed, 1 indicates order in-progress, 2 indicates order complete
            mycursor.execute("CREATE TABLE order_history (netid VARCHAR(255), order_id INT, timestamp DATETIME, " +
                             "total_cost DECIMAL(10,2), type_of_payment BOOLEAN, payment_status BOOLEAN, order_status INT)")

            mycursor.execute("ALTER TABLE `order_history` ADD PRIMARY KEY(`order_id`)")

            mycursor.execute(
                "ALTER TABLE `order_history` CHANGE `order_id` `order_id` INT(11) NOT NULL AUTO_INCREMENT")

        except Exception as e:
            print("build_order_history_table creating table failed: %s", str(e), file=stderr)

        mycursor.close()


# build a table to hold the details associated with each order
def build_order_details_table(mydb):
    check_table = check_table_exists(mydb, "order_details")

    if not check_table:
        mycursor = mydb.cursor()

        try:
            mycursor.execute("CREATE TABLE order_details (order_id INT, item_id INT, item VARCHAR(255))")
        except Exception as e:
            print("build_order_details_table creating table failed: %s", str(e), file=stderr)
        mycursor.close()


# build a table to hold the barista usernames and encrypted passwords
def build_barista_user_passwords_table(mydb):
    check_table = check_table_exists(mydb, "valid_barista_users")

    if not check_table:
        mycursor = mydb.cursor()

        try:
            mycursor.execute("CREATE TABLE valid_barista_users (username VARCHAR(255), password VARCHAR(255))")

        except Exception as e:
            print("valid_barista_users creating table failed: %s", str(e), file=stderr)

        barista_users = pd.read_excel("barista_users.xlsx")

        for index, row in barista_users.iterrows():
            username = row['username']
            password = row['password']
            # protect against SQL injections
            sql = "INSERT INTO valid_barista_users (username, password) VALUES (%s, %s)"
            val = (username, password)

            try:
                mycursor.execute(sql, val)
            except Exception as e:
                print("build_menu_table inserting item failed: %s", str(e), file=stderr)

            mydb.commit()

        mycursor.close()


# build a table to hold the open/close status of the store
def build_store_status_table(mydb):
    check_table = check_table_exists(mydb, "store_status")
    if not check_table:
        mycursor = mydb.cursor()

        try:
            # 1 indicates open and 0 indicate closed
            mycursor.execute("CREATE TABLE store_status (store_open BOOLEAN)")
        except Exception as e:
            print("build_order_details_table creating table failed: %s", str(e), file=stderr)

        sql = "INSERT INTO store_status (store_open) VALUES  (%s)"
        val = (1,)

        try:
            mycursor.execute(sql, val)
        except Exception as e:
            print("build_store_status_table inserting item failed: %s", str(e), file=stderr)

        mydb.commit()

        mycursor.close()


# execute the primary functions above to connect to the database, create all tables, and disconnect from the database
def main():
    mydb = connect()
    build_menu_table(mydb)
    build_order_history_table(mydb)
    build_order_details_table(mydb)
    build_images_table(mydb)
    build_barista_user_passwords_table(mydb)
    build_store_status_table(mydb)
    disconnect(mydb)


if __name__ == "__main__":
    main()
