import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

// API key
const app = new Clarifai.App({
  apiKey: '89c992304ce246c3845e5447ea894feb'
});

// Particles customization
const particleOptions = {
  particles: {
    line_linked: {
      shadow: {
        enable:true,
        color: '#3Ca9D1',
        blur: 5
      }
    }
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl:''
    }
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  // Using Clarifai face detection model
  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(
        function(response) {
          console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        },
        function(err) {
          // there was an error
        }
      );
    }

    render() {
      return (
        <div className="App">
          <Particles className ='particles'
            params={particleOptions} />
          <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
            />
          <FaceRecognition imageUrl={this.state.imageUrl}/>
        </div>
      );
    }
  }

  export default App;
