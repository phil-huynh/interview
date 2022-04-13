import React from 'react';
import axios from 'axios';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      image:[],
      imageList:[],
      currentImage: ''
    }
    this.handleFile = this.handleFile.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleFile(e) {
    var file = e.target.files[0]
    console.log(file)
    var formData = new FormData();
    formData.append("image", file)
    this.setState({
      image: formData
    })
  }

  selectImage (url) {
    this.setState({
      currentImage: url
    })
  }

  submit(e) {
    e.preventDefault()
    let image = this.state.image
    axios.post('/image', image, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) =>{
      var url = res.data.url;
      console.log(res.data.url)
      var list = this.state.imageList;
      list.push(url)
      this.setState({
        imageList: list
      })
    })
    .catch((err) => {
      console.log("🚀 ~ file: App.jsx ~ line 29 ~ App ~ submit ~ err", err)
    })
  }

  render() {
    var list = this.state.imageList
    return (
      <div>
        <form onSubmit={this.submit}enctype="multipart/form-data">
          <input
            type="file"
            name="image"
            onChange={(e)=>{this.handleFile(e)}}
          />
          <button
            type="submit"
            style={{cursor: 'pointer'}}
          >Upload File
          </button>
        </form>
        {list.length > 0 && list.length === 1 ?
          <h3>Click the link to see the image or choose another file to add to the list</h3>
          : list.length > 1 ?
            <h3>Click a link to see an image or choose another file to add to the list</h3>
          :
          null}
        {list.length > 0 ? list.map((url) =>(
          <div
            onClick={()=>{this.selectImage(url)}}
            style={{cursor: 'pointer'}}
          >
            {url}
          </div>
        )): null}
        {this.state.currentImage ?
          <img src={this.state.currentImage} style={{margin: '30px', width: '800px', height: '550px'}}/> : null
        }
      </div>
    )
  }
}
export default App;