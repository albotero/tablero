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

    def __init__(self, location):
        active = DB_Table('board').get({
            '`location` =': location,
            '`status` <>': 'exit'
            }).fetch
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
        patients = self.data['patients']
        for p in patients:
            p['time'] = p['time'].strftime('%-I:%M %p')
        return json.dumps(patients)


'''
[
    {'rips': '123123', 'time': '12:34 pm', 'status': 'surgery', 'detail': ''},
    {'rips': '234234', 'time': '12:35 pm', 'status': 'surgery', 'detail': '<a class="--detail-familiar"></a>'},
    {'rips': '345345', 'time': '12:36 pm', 'status': 'exit', 'detail': '<a class="--destination">Casa</a>'},
    {'rips': '456456', 'time': '12:37 pm', 'status': 'exit', 'detail': '<a class="--destination">Hospitalización 3A - Habitación 201</a>'},
    {'rips': '567567', 'time': '12:38 pm', 'status': 'pacu', 'detail': '<a class="--detail-familiar"></a>'},
    {'rips': '678678', 'time': '12:39 pm', 'status': 'pacu', 'detail': ''},
    {'rips': '789789', 'time': '12:40 pm', 'status': 'surgery', 'detail': ''},
    {'rips': '890890', 'time': '12:41 pm', 'status': 'surgery', 'detail': '<a class="--detail-familiar"></a>'},
    {'rips': '901901', 'time': '12:42 pm', 'status': 'surgery', 'detail': ''},
    {'rips': '012012', 'time': '12:43 pm', 'status': 'exit', 'detail': '<a class="--destination">UCI - Cama 14</a>'},
    {'rips': '321321', 'time': '12:44 pm', 'status': 'pacu', 'detail': ''},
    {'rips': '432432', 'time': '12:45 pm', 'status': 'surgery', 'detail': ''},
    {'rips': '543543', 'time': '12:46 pm', 'status': 'surgery', 'detail': '<a class="--detail-familiar"></a>'},
    {'rips': '654654', 'time': '12:47 pm', 'status': 'pacu', 'detail': '<a class="--detail-familiar"></a>'}
]
'''