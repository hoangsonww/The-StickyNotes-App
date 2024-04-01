from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.route('/proxy')
def proxy_to_django():
    response = requests.get('http://localhost:8000/api/hello/')
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(port=5000)
