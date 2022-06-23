import json

class ActivePatients:

    def __init__(self, location):
        self.data = {
            'location': location,
            'patients': [
                {'rips': '123123', 'time': '12:34 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': ''},
                {'rips': '234234', 'time': '12:35 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': '<a class="--detail-familiar"></a>'},
                {'rips': '345345', 'time': '12:36 pm', 'status': 'exit', 'status_str': 'Salida', 'detail': '<a class="--destination">Casa</a>'},
                {'rips': '456456', 'time': '12:37 pm', 'status': 'exit', 'status_str': 'Salida', 'detail': '<a class="--destination">Hospitalización 3A - Habitación 201</a>'},
                {'rips': '567567', 'time': '12:38 pm', 'status': 'pacu', 'status_str': 'Recuperación', 'detail': '<a class="--detail-familiar"></a>'},
                {'rips': '678678', 'time': '12:39 pm', 'status': 'pacu', 'status_str': 'Recuperación', 'detail': ''},
                {'rips': '789789', 'time': '12:40 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': ''},
                {'rips': '890890', 'time': '12:41 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': '<a class="--detail-familiar"></a>'},
                {'rips': '901901', 'time': '12:42 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': ''},
                {'rips': '012012', 'time': '12:43 pm', 'status': 'exit', 'status_str': 'Salida', 'detail': '<a class="--destination">UCI - Cama 14</a>'},
                {'rips': '321321', 'time': '12:44 pm', 'status': 'pacu', 'status_str': 'Recuperación', 'detail': '<a class="--detail-familiar"></a>'}
            ]
        }

    def __str__(self):
        return json.dumps(self.data)