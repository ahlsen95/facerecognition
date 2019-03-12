import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
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
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignedIn: false
    }
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }


  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      //Multiplying img w and h with percentages from face detection.
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,

      //opposite
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }


  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  // Using Clarifai face detection model
  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      //Takes a response, returns an object and updates the state of box
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
      if(route === 'signout') {
        this.setState({isSignedIn:false})
      } else if(route === 'home') {
        this.setState({isSignedIn:true})
      }
      this.setState({route: route});
    }

    render() {
      return (
        <div className="App">
          <Particles className ='particles'
            params={particleOptions}
            />
          <Navigation
            isSignedIn={this.state.isSignedIn}
            onRouteChange={this.onRouteChange}
          />
          {
            // shows the sign in component or the detection component
            this.state.route === 'home'
            ?<div>
              <Logo />
              <Rank />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
                />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>
          : (
            this.state.route === 'signin'
            ? <Signin onRouteChange ={this.onRouteChange}/>
            : <Register onRouteChange ={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
