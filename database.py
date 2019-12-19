import mysql.connector
from mysql.connector import errorcode
import pandas as pd
import os
from sys import stderr


def convertToBinaryData(filename):
    # Convert digital data to binary format
    with open(filename, 'rb') as file:
        binaryData = file.read()
    return binaryData


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


def disconnect(mydb):
    mydb.close()


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


def build_images_table(mydb):
    check_table = check_table_exists(mydb, "images")

    if not check_table:
        mycursor = mydb.cursor()

        try:
            mycursor.execute("CREATE TABLE images (name VARCHAR(255), picture MEDIUMBLOB)")
        except Exception as e:
            print("build_images_table creating table failed: %s", str(e), file=stderr)

        directory = r'/Users/HariRaval/Desktop/expresso/images'
        for filename in os.listdir(directory):
            if filename.endswith(".jpeg"):
                picture = directory + '/' + filename
                pic = convertToBinaryData(picture)  # this is new
                name = filename[0:filename.find('.')]
                sql = "INSERT INTO images (name, picture) VALUES (%s, %s)"

                val = (name, pic)

                try:
                    mycursor.execute(sql, val)
                except Exception as e:
                    print("build_images_table insertion images failed: %s", str(e), file=stderr)

                mydb.commit()

        mycursor.close()


def build_menu_table(mydb):
    check_table = check_table_exists(mydb, "menu")

    if not check_table:

        mycursor = mydb.cursor()

        try:
            mycursor.execute("CREATE TABLE menu (size VARCHAR(255), item VARCHAR(255), price DECIMAL(10,2), " +
                             "category VARCHAR(255), availability BOOLEAN, description VARCHAR(255))")
        except Exception as e:
            print("build_menu_table creating table failed: %s", str(e), file=stderr)

        menuItems = pd.read_excel("Menu Items.xlsx")

        for index, row in menuItems.iterrows():
            size = row['size']
            item = row['item']
            price = row['price']
            category = row['category']
            description = row['description']
            # protect against SQL injections
            sql = "INSERT INTO menu (size, item, price, category, availability, description) VALUES (%s, %s, %s, %s, %s, %s)"
            val = (size, item, price, category, 1, description)

            try:
                mycursor.execute(sql, val)
            except Exception as e:
                print("build_menu_table inserting item failed: %s", str(e), file=stderr)

            mydb.commit()

        mycursor.close()


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


def build_order_details_table(mydb):
    check_table = check_table_exists(mydb, "order_details")

    if not check_table:
        mycursor = mydb.cursor()

        try:
            mycursor.execute("CREATE TABLE order_details (order_id INT, item VARCHAR(255))")
        except Exception as e:
            print("build_order_details_table creating table failed: %s", str(e), file=stderr)
        mycursor.close()


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


def main():
    mydb = connect()
    build_menu_table(mydb)
    build_order_history_table(mydb)
    build_order_details_table(mydb)
    build_images_table(mydb)
    build_barista_user_passwords_table(mydb)
    disconnect(mydb)


if __name__ == "__main__":
    main()
