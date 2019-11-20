from datetime import date
from ExpressoDatabase import connect, disconnect
from LDAP import LDAP

today = date.today()


def charge(pay_file):
    mydb = connect()
    mycursor = mydb.cursor()
    conn = LDAP()
    conn.connect_LDAP()
    day = today.strftime("%Y-%m-%d")
    first = day + " 00:00:00"
    last = day + " 23:59:59"
    sql = "SELECT * FROM order_history WHERE timestamp BETWEEN %s and %s"
    val = (first, last)
    mycursor.execute(sql, val)
    row = mycursor.fetchone()
    while row is not None:
        netid = row[0]
        paid = row[5]
        if not paid:
            uid = conn.get_id(netid)[0]
            cost = str(row[3])
            cost = cost.replace('.', '')
            pay_file.write('C,%s,110,--%s, Coffee Club\n' % (uid, cost))

        row = mycursor.fetchone()

    mycursor.close()
    disconnect(mydb)
    conn.disconnect_LDAP()


def open_file():
    name = today.strftime("%Y-%m-%d")
    pay_file = open("/Users/HariRaval/Desktop/expresso/CCPayment%s.mp" % name, "w+")
    return pay_file


def close_file(pay_file):
    pay_file.close()


def main():
    pay_file = open_file()
    charge(pay_file)


if __name__ == "__main__":
    main()
