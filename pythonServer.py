from flask import Flask, request, jsonify
from algorithms.librosaMusicSeg import runSegmentation

app = Flask(__name__)

# Create an endpoint
@app.route('/call-python', methods=['POST'])
def call_python():
    # Get data from the request
    # input_data = request.json.get('name', 'Guest')
    data = request.get_json()
    song_path = data['song']
    algorithm = data['algorithm']
    print(algorithm)

    # Call the Python function
    if(algorithm == 1):
        result = runSegmentation(song_path, "CQT", "Agglomerative", 4)
    elif(algorithm == 2):
        result = runSegmentation(song_path, "Mel", "KMeans", 4)
    elif(algorithm == 3):
        result = runSegmentation(song_path, "CQT", "GMM", 4)
    elif(algorithm == 4):
        result = runSegmentation(song_path, "STFT", "KMeans", 4)
    else:
        result = []

    
    # Return the result as a JSON response
    return jsonify([[int(a), float(b), float(c), int(d)] for a, b, c, d in result])

if __name__ == '__main__':
    app.run(debug=True)
