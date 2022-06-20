import json

class ActivePatients:

    def __init__(self, location):
        self.data = {
            'location': location,
            'patients': [
                {'rips': '123123', 'time': '12:34 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': ''},
                {'rips': '234234', 'time': '12:35 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': 'Se requiere al familiar'},
                {'rips': '345345', 'time': '12:36 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': ''},
                {'rips': '456456', 'time': '12:34 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': ''},
                {'rips': '567567', 'time': '12:35 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': 'Se requiere al familiar'},
                {'rips': '678678', 'time': '12:36 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': ''},
                {'rips': '789789', 'time': '12:34 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': ''},
                {'rips': '890890', 'time': '12:35 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': 'Se requiere al familiar'},
                {'rips': '901901', 'time': '12:36 pm', 'status': 'surgery', 'status_str': 'Cirugía', 'detail': ''}
            ]
        }

    def __str__(self):
        return json.dumps(self.data)