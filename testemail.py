# https://realpython.com/python-send-email/#option-1-setting-up-a-gmail-account-for-development
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib, ssl


def send(order):
    port = 465  # For SSL
    password = '1Latte2G0!'

    fromaddr = "expressoprinceton@gmail.com"
    toaddr = order['netid'] + "@princeton.edu"
    msg = MIMEMultipart()
    msg['From'] = fromaddr
    msg['To'] = toaddr
    msg['Subject'] = "Coffee Club Order Confirmation"
    body = "Your Order is Confirmed!\n"
    body += "Items:\n"
    for item in order['items']:
        body += "\t%s\n" % (item['item']['name'])
    body += "Your total cost is $%s" % (order['cost'])
    msg.attach(MIMEText(body, 'plain'))

    # Create a secure SSL context
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(fromaddr, password)
        server.sendmail(fromaddr, toaddr, msg.as_string())

# # https://www.godaddy.com/help/configuring-mail-clients-with-cpanel-email-8861
# # https://realpython.com/python-send-email/#option-1-setting-up-a-gmail-account-for-development
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# import smtplib, ssl
#
# port = 25  # For SSL
# password = '1Latte2G0!'
#
# fromaddr = "coffeeclub@princeton.edu"
# toaddr = "lhussain@princeton.edu"
# msg = MIMEMultipart()
# msg['From'] = fromaddr
# msg['To'] = toaddr
# msg['Subject'] = "Coffee Club Order Confirmation"
# body = "Your Order cost: $1.00"
# msg.attach(MIMEText(body, 'plain'))
#
# # Create a secure SSL context
# context = ssl.create_default_context()
#
# with smtplib.SMTP_SSL("ccmobile.deptcpanel.princeton.edu", port, context=context) as server:
#     server.login("coffeeclub@princeton.edu", password)
#     server.sendmail(fromaddr, toaddr, msg.as_string())
