import pymysql

class QueryResult:

    __error__ = None
    database = user = passwd = 'tablero'
    host = 'localhost'

    def __init__(self, command):
        try:
            connection = pymysql.connect(
                host=self.host,
                user=self.user,
                password=self.passwd,
                db=self.database)

            try:
                with connection.cursor(pymysql.cursors.DictCursor) as cursor:
                    self.execute = cursor.execute(command)
                    self.fetch = cursor.fetchall()
                    connection.commit()
            except Exception as e:
                print(f'DB Execution error: {e}')
                self.__error__ = e
                connection.rollback()
            finally:
                connection.close()

        except Exception as e:
            print(f'DB Connection error: {e}')
            self.__error__ = e


class DB_Table:

    def __init__(self, table):
        self.table = table

    def collapse(self, dict, union = ' AND'):
        return f'{union} '.join([ f'{key} "{value}"' for key, value in dict.items() ])

    def execute(self, command):
        return QueryResult(command)

    def get(self, conditions: dict = None):
        cond = f'WHERE {self.collapse(conditions)}' if conditions else ''
        command = f'''
            SELECT *
            FROM `{self.table}`
            {cond};
            '''
        return QueryResult(command)

    def add(self, data: dict):
        columns = ', '.join([ f'`{col}`' for col in data.keys() ])
        values = ', '.join([ f"'{col}'" for col in data.values() ])
        command = f'''
            INSERT INTO `{self.table}`
            ({columns})
            VALUES ({values});
            '''
        return QueryResult(command)

    def update(self, data: dict, conditions: dict):
        command = f'''
            UPDATE `{self.table}`
            SET {self.collapse(data, ",")}
            WHERE {self.collapse(conditions)};
            '''
        return QueryResult(command)

    def remove(self, conditions: dict):
        command = f'''
            DELETE FROM `{self.table}`
            WHERE {self.collapse(conditions)};
            '''
        return QueryResult(command)