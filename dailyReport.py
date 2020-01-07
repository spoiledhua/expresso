# -----------------------------------------------------------------------
# dailyReport.py
# Author: Expresso backend developers
# -----------------------------------------------------------------------


from database import connect, disconnect
from datetime import date
from sys import stderr
import csv

today = date.today()


# retrieve all information to be placed into the spreadsheet report each day
def retrieve_order_details():
    mydb = connect()
    mycursor = mydb.cursor()

    # select the relevant information from the order_details and order_history tables by concatenating on the items
    # ordered
    sql = "SELECT order_details.order_id, order_history.timestamp, order_history.netid, order_history.total_cost, " \
          "order_history.type_of_payment, GROUP_CONCAT(order_details.item) FROM order_history, order_details WHERE " \
          "order_history.order_id = order_details.order_id GROUP BY order_details.order_id"
    try:
        mycursor.execute(sql)
    except Exception as e:
        print("Retrieve Order Details Failure: %s", str(e), file=stderr)

    row = mycursor.fetchone()

    all_rows = []

    while row is not None:
        order_id = row[0]
        time_ordered = row[1]
        netid = row[2]
        netid = netid.rstrip()
        order_cost = row[3]
        payment_type = row[4]
        items_ordered = row[5]

        if payment_type == 1:
            payment_type = "online/student charge"
        else:
            payment_type = "in store"

        current_row = [order_id, time_ordered, netid, order_cost, items_ordered, payment_type]

        all_rows.append(current_row)
        row = mycursor.fetchone()

    mycursor.close()
    disconnect(mydb)
    return all_rows


# write all of the rows of data to the csv
def write_to_csv():
    headers = ["Order ID", "Time Ordered", "Netid", "Order Cost", "Items Ordered", "Payment Type"]

    data = retrieve_order_details()

    with open("/Users/HariRaval/Desktop/'Coffee_Club_Sales_%s.csv'" % today, "w") as csv_file:
        writer = csv.writer(csv_file, delimiter=',')

        writer.writerow(headers)

        total_cost = 0
        for line in data:
            total_cost = total_cost + float(line[3])
            writer.writerow(line)

        writer.writerow('\n')

        overall_statistics = ["DAILY SALE:", '', '', str(total_cost)]
        writer.writerow(overall_statistics)


# call the main driver function to write data to the csv
def main():
    write_to_csv()


if __name__ == "__main__":
    main()
