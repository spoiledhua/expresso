import mysql.connector
from mysql.connector import errorcode
import pandas as pd


# MAKE SURE TO GO BACK AND ADD IN MORE ERROR HANDLING CODE...
# more handling

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

    mycursor.execute(check_table, (table_name,))

    result = mycursor.fetchone()

    mycursor.close()
    return True if result is not None else False


def build_menu_table(mydb):
    check_table = check_table_exists(mydb, "menu")

    if not check_table:

        mycursor = mydb.cursor()

        mycursor.execute("CREATE TABLE menu (item VARCHAR(255), price DECIMAL(10,2), availability BOOLEAN)")

        menuItems = pd.read_excel("Menu Items.xlsx")

        for index, row in menuItems.iterrows():
            item = row['item']
            price = row['price']
            # protect against SQL injections
            sql = "INSERT INTO menu (item, price, availability) VALUES (%s, %s, %s)"
            val = (item, price, 1)
            mycursor.execute(sql, val)
            mydb.commit()

        mycursor.close()


def build_order_history_table(mydb):
    check_table = check_table_exists(mydb, "order_history")

    if not check_table:
        mycursor = mydb.cursor()

        # for type_of_payment 1 indicates online payment and 0 indicates in-store payment...
        # for payment_status 1 indicates paid and 0 indicates not paid
        mycursor.execute("CREATE TABLE order_history (netid VARCHAR(255), order_id DECIMAL, timestamp TIMESTAMP, " +
                         "total_cost DECIMAL, type_of_payment BOOLEAN, payment_status BOOLEAN)")

        mycursor.close()


def build_order_details_table(mydb):
    check_table = check_table_exists(mydb, "order_details")

    if not check_table:
        mycursor = mydb.cursor()

        mycursor.execute("CREATE TABLE order_details (order_id INT, item_quantity INT, item VARCHAR(255))")
        mycursor.close()


def main():
    mydb = connect()
    build_menu_table(mydb)
    build_order_history_table(mydb)
    build_order_details_table(mydb)
    disconnect(mydb)


if __name__ == "__main__":
    main()
