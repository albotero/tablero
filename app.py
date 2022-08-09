#!/usr/bin/python3

from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit

from scripts.patients import ActivePatients
from scripts.database import DB_Table

from datetime import datetime

import os

app = Flask(__name__, instance_relative_config = True)
app.secret_key = 'tablero'

socketio = SocketIO(app, cors_allowed_origins = '*', async_mode='gevent') #, logger=True, engineio_logger=True)

@app.route('/')
@app.route('/<location>')
def index(location = None):
    # Requires logged user
    if not session.get('user'):
        return redirect(url_for('login'))

    return render_template('index.html',
        location = location,
        ActivePatients = ActivePatients)

def login_user(user, password):
    session['user'] = 1
    result = 'ok'
    message = 'Se inició correctamente la sesión'
    return result, message

@app.route('/login', methods=['GET', 'POST'])
def login():
    # Verifies if user is logged
    if session.get('user'):
        return redirect(url_for('.index'))

    if request.method == 'POST':
        result = login_user(request.values.get('user'),
                            request.values.get('password'))
        return render_template('login.html', result = result)

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/<location>/board')
def board(location):
    # Requires logged user
    if not session.get('user'):
        return redirect(url_for('login'))

    return render_template('board.html',
        location = location,
        ActivePatients = ActivePatients)

@socketio.on('active-patients')
def active_patients(data):
    try:
        # Return filtered patients
        emit(f"filtered-{data['location']}", str(ActivePatients(location=data['location'], filter=data.get('filter'))))
    except Exception as ex:
        # Log error
        pass

@socketio.on('update-rips')
def update_rips(data):
    # Add relative call
    if data.get('relative'):
        DB_Table('board').update(
            data={'`relative` =': 1 if data['relative'] else 0},
            conditions={'`rips` =': data['rips']},
            optional='ORDER BY `eventid` DESC LIMIT 1'
        )
        emit(f"filtered-{data['location']}", str(ActivePatients(location=data['location'], filter=data.get('filter'))))
        return

    # Default status for new patients
    default_status = list(ActivePatients.locations[data['location']]['status'])[0]

    # Write to DB
    DB_Table('board').add({
        'location': data['location'],
        'rips': data['rips'],
        'time': data['time'] if data.get('time') else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'status': data.get('status', default_status),
        'destination': data.get('destination', ''),
        'user': session['user']
    })

    # Update changes on Board
    emit(f"filtered-{data['location']}", str(ActivePatients(location=data['location'], filter=data.get('filter'))))

@app.route('/comm-manager')
def comm_manager():
    return render_template('comm-manager.html')

@socketio.on('get-comm-videos')
def comm_videos():
    try:
        # Return list of videos in static/comm
        videos = [ url_for('static', filename=f'comm/{video}') for video in os.listdir('static/comm') ]
        emit(f"comm-videos", videos)
    except Exception as ex:
        # Log error
        pass

@app.route('/admin')
def admin():
    # Requires admin user
    '''user = logged_user()
    all_users = User.all_users()
    if request.args.get('u') == 'abotero' and len(all_users) == 0:
        pass
    else:
        if user.status != 'authenticated' or 'admin' not in user.data['roles']:
            return redirect(url_for('login'))'''

    return render_template('admin.html')
