import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [classes, setClasses] = useState([]);

  const backend_url = import.meta.env.VITE_BACKEND_URL

  const toTitleCase = word => {
    return word[0].toUpperCase() + word.slice(1)
  }

  const sendImageToBackend = () => {
    axios.post(`${backend_url}/predict_class`, {
      'image': selectedImage
    }).then(res => {
      setPrediction(toTitleCase(res.data.class))
    }).catch(console.log)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrediction("")
      setSelectedFile(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    axios.get(`${backend_url}/get_classes`).then(res => {
      setClasses(res.data.classes)
    }).catch(console.log)
  }, [])

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{marginBottom: '20px'}}>
        <span style={{fontWeight: 'bold'}}>Available Classes: </span>
        <span>  {classes.map(cl => toTitleCase(cl)).join(', ')} </span>
      </div>
      <label htmlFor='image' style={{ display: 'flex', flexDirection: 'column' }}>
        {
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '10px', paddingBottom: '10px', paddingRight: '5px', paddingLeft: '5px', backgroundColor: 'white', width: '220px', height: '200px', borderRadius: '20px' }}>
            {
              selectedImage ? 
              <img src={selectedImage} alt={selectedFile?.name} style={{ width: '200px', height: '200px', borderRadius: '10px' }} /> :
              <span style={{color: 'black', fontSize: '1.2rem'}}>Upload Image</span>
            }
            
          </div> 
        }
        <input type="file" id='image' name='image' onChange={handleFileChange} style={{ visibility: 'hidden' }} />
      </label>
      <div>
        <button onClick={sendImageToBackend}> Predict Class </button>
        {
          prediction &&
          <div style={{marginTop: '10px'}}>
          It is <span style={{fontWeight: 'bold'}}>{prediction}</span>
        </div>
        }
      </div>

    </div>
  )
}

export default App
