from flask import Flask, jsonify, request
from grid import updateGridCell

app = Flask(__name__)

@app.route('/update_grid_cell', methods=['POST'])
def handle_update_grid_cell():
    data = request.json
    x = data['x']
    y = data['y']
    number = data['number']
    updateGridCell(x, y, number)
    
    response = jsonify({'status': 'success'})
    # Set CORS headers for the main request
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response

if __name__ == '__main__':
    app.run(debug=True)
