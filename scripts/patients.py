import json
from datetime import datetime, timedelta
from scripts.database import DB_Table

class ActivePatients:

    locations = {
        'surgery': {
            'title': 'Cirugía',
            'status': {
                'preqx': 'Preparación',
                'surgery': 'Cirugía',
                'pacu': 'Recuperación',
                'exit': 'Salida'
            }
        }
    }

    def __init__(self, location, filter = None):        
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
                {f"AND `rips`='{filter}'" if filter else ""};
            '''
        
        active = DB_Table('board').execute(query).fetch
        exit = DB_Table('board').get({
            '`location` =': location,
            '`status` =': 'exit',
            '`time` >=': (datetime.now() - timedelta(hours=0, minutes=30)).strftime('%Y-%m-%d %H:%M:%S')
            }).fetch
        
        patients = (active if active else []) + (exit if exit else [])
        
        self.data = {
            'location': location,
            'patients': patients
        }
    
    def __str__(self):
        location = self.locations[self.data['location']]
        patients = self.data['patients']
        for p in patients:
            p['status_index'] = list(location['status']).index(p['status'])
            p['status'] = location['title']
            p['time'] = p['time'].strftime('%-I:%M %p')
        return json.dumps(patients)