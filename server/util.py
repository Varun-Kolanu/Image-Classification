import json
from tensorflow import keras
import base64
from io import BytesIO
import numpy as np
from PIL import Image

__model = None
__classes = None

def get_predicted_class(image_base64):
    image_data = base64.b64decode(image_base64.split(',')[1])
    print(image_base64.split(',')[0])
    image = Image.open(BytesIO(image_data))
    resized_image = image.resize((32, 32))
    image_array = np.array(resized_image)
    if image_array.shape[-1] == 4:
        image_array = image_array[:, :, :3]
    model_prediction = __model.predict(image_array.reshape((1,)+ image_array.shape))
    return __classes[f'{np.argmax(model_prediction[0])}']

def get_classes():
    return list(__classes.values())


def load_saved_artifacts():
    print("Loading saved artifacts...")
    global __classes
    if __classes is None:
        with open("./artifacts/classes.json", "r") as f:
            __classes = json.load(f)

    global __model
    if __model is None:
        __model = keras.models.load_model("./artifacts/cifar10.h5")

if __name__ == "__main__":
    load_saved_artifacts()
    print(__classes)
    get_predicted_class('')