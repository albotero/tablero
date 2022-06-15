#!/usr/bin/python3

from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__, instance_relative_config = True)
app.secret_key = 'tablero'

socketio = SocketIO(app, cors_allowed_origins = '*', async_mode='gevent') #, logger=True, engineio_logger=True)

@app.route('/')
def index():
    # Requires logged user
    if not session.get('user'):
        return redirect(url_for('login'))

    return render_template('index.html')

def login_user(user, password):
    session['user'] = 'user'
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

@app.route('/board')
def board():
    # Requires logged user
    if not session.get('user'):
        return redirect(url_for('login'))

    return render_template('board.html')

@socketio.on('update_board')
def update_board(data):
    try:
        # Load existing data
        rips = data.get('rips')
        time = data.get('time')
        status = data.get('status')
        detail = data.get('detail')

        res = 'ok'
        emit('response', res)
    except Exception as ex:
        emit('response', f'error >> {ex}')

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
