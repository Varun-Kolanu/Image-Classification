from flask import Flask, request, jsonify
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app)
print("Starting Flask App...")
util.load_saved_artifacts()

@app.route('/', methods=['GET'])
def hello():
    return "Hello"


@app.route('/predict_class', methods=['POST'])
def predict_class():
    data = request.get_json()

    image = data['image']
    prediction = util.get_predicted_class(image)

    res = jsonify({
        "class": prediction
    })

    return res


@app.route('/get_classes', methods=['GET'])
def get_classes():

    res = jsonify({
        "classes": util.get_classes()
    })

    return res

if __name__ == '__main__':
    app.run()