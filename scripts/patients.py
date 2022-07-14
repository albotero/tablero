import json
from datetime import datetime, timedelta
from scripts.database import DB_Table

class ActivePatients:

    locations = {
        'surgery': {
            'title': 'Cirugía',
            'status': {
                'preqx': 'Preparación',
                'surgery': 'Entró a Cirugía',
                'pacu': 'Recuperación',
                'exit': 'Salida'
            }
        }
    }

    def __init__(self, location, filter = None):
        time_30min = (datetime.now() - timedelta(hours=0, minutes=30)).strftime('%Y-%m-%d %H:%M:%S')
        query = f'''
            SELECT *
            FROM `board`
            INNER JOIN (
                SELECT MAX(eventid) as id
                FROM `board`
                GROUP BY `rips`
            ) last_updates
            ON last_updates.id = board.eventid
            WHERE
                `location`='{location}'
                AND `status`!='exit'
                OR (`status`='exit' AND `time` >='{time_30min}')
                {f"AND `rips`='{filter}'" if filter else ""}
            ORDER BY `time` DESC;
            '''
        self.data = {
            'location': location,
            'patients': DB_Table('board').execute(query).fetch
        }
    
    def __str__(self):
        location = self.locations[self.data['location']]
        patients = self.data['patients']
        for p in patients:
            p['status_index'] = list(location['status']).index(p['status'])
            p['status_str'] = location['status'][p['status']]
            p['time'] = p['time'].strftime('%-I:%M %p').lower()
        return json.dumps(patients)