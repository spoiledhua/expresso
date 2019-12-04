from ldap3 import Server, Connection, ALL
from ldap3.core.exceptions import LDAPBindError, LDAPExceptionError
from sys import stderr


# When adding new attributes, make sure to add a new get_'attribute' function and add it to get_all
class LDAP:

    def __init__(self):
        self._connection = None

    def connect_LDAP(self):
        server = Server('ldap.princeton.edu', get_info=ALL)

        try:
            self._connection = Connection(server, 'uid=ccmobile,o=Princeton University,c=US', '1Latte2G0!',
                                          auto_bind=True)

        except LDAPExceptionError as e:
            print("Connection to LDAP failed", file=stderr)

        try:
            self._connection.bind()
        except LDAPBindError as e:
            print("Binding to LDAP failed", file=stderr)

    def disconnect_LDAP(self):
        self._connection.unbind()

    def get_all(self, netid):
        success = self._connection.search('o=Princeton University,c=US', '(uid=%s)' % netid,
                                          attributes=['universityid', 'displayname', 'sn', 'givenname', 'mail',
                                                      'pustatus', 'puclassyear'])

        attributeName = ('displayname', 'sn', 'givenname', 'mail', 'pustatus', 'puclassyear')
        result = []

        if success:
            for attribute in attributeName:
                result.append(self._connection.entries[0][attribute][0])
        else:
            print("Search failed", file=stderr)

        return result

    def get_id(self, netid):
        success = self._connection.search('o=Princeton University,c=US', '(uid=%s)' % netid,
                                          attributes=['universityid'])

        result = ''

        if success:
            result = self._connection.entries[0]['universityid'][0]
            result = result.rstrip()
        else:
            print("Search failed", file=stderr)

        return result

    def get_displayname(self, netid):
        success = self._connection.search('o=Princeton University,c=US', '(uid=%s)' % netid,
                                          attributes=['displayname'])

        result = ''

        if success:
            result = self._connection.entries[0]['displayname'][0]
            result = result.rstrip()
        else:
            print("Search failed", file=stderr)

        return result

    def get_givenname(self, netid):
        success = self._connection.search('o=Princeton University,c=US', '(uid=%s)' % netid,
                                          attributes=['givenname'])

        result = ''

        if success:
            result = self._connection.entries[0]['givenname'][0]
            result = result.rstrip()
        else:
            print("Search failed", file=stderr)

        return result

    def get_sn(self, netid):
        success = self._connection.search('o=Princeton University,c=US', '(uid=%s)' % netid,
                                          attributes=['sn'])

        result = ''

        if success:
            result = self._connection.entries[0]['sn'][0]
            result = result.rstrip()
        else:
            print("Search failed", file=stderr)

        return result

    def get_mail(self, netid):
        success = self._connection.search('o=Princeton University,c=US', '(uid=%s)' % netid,
                                          attributes=['mail'])

        result = ''

        if success:
            result = self._connection.entries[0]['mail'][0]
            result = result.rstrip()
        else:
            print("Search failed", file=stderr)

        return result

    def get_pustatus(self, netid):
        success = self._connection.search('o=Princeton University,c=US', '(uid=%s)' % netid,
                                          attributes=['pustatus'])

        result = ''

        if success:
            result = self._connection.entries[0]['pustatus'][0]
            result = result.rstrip()
        else:
            print("Search failed", file=stderr)

        return result

    def get_puclassyear(self, netid):
        success = self._connection.search('o=Princeton University,c=US', '(uid=%s)' % netid,
                                          attributes=['puclassyear'])

        result = 0

        if success:
            result = self._connection.entries[0]['puclassyear'][0]
        else:
            print("Search failed", file=stderr)

        return result


def main():
    conn = LDAP()
    conn.connect_LDAP()
    searchResults = conn.get_all("jk30")
    print(searchResults)
    #searchResults = conn.get_id("jk30")
    #print(searchResults)
    searchResults = conn.get_displayname("jk30")
    print(searchResults)
    searchResults = conn.get_givenname("jk30")
    print(searchResults)
    searchResults = conn.get_sn("jk30")
    print(searchResults)
    searchResults = conn.get_mail("jk30")
    print(searchResults)
    searchResults = conn.get_puclassyear("jk30")
    print(searchResults)
    conn.disconnect_LDAP()


if __name__ == "__main__":
    main()
