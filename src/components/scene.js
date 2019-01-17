import React, { Component } from 'react';
import 'three-gltfloader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SHOW_INFO, HIDE_INFO, LOOKING_AT } from '../redux/actions/actions';
import Video from './Video';
import { Container, Toast, Title, Box } from '../style/scene.js';
import { config } from '../configuration/config.js';
/* TODO:
  add redux to index for universal state
  add sass loader
  fix controls
  config
*/ const mapStateToProps = state => ({
  info: state.info,
  lookingAt: state.looking,
});
// sends props actions, taken as props to reducer
const mapDispatchToProps = dispatch => ({
  // binding actions. This method takes: (action, dispatcher)
  ...bindActionCreators(
    {
      SHOW_INFO,
      HIDE_INFO,
      LOOKING_AT,
    },
    dispatch,
  ),
});

class Scene extends Component {
  constructor(props) {
    super(props);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.buttonsGroup = new THREE.Group();
    this.selected;
    this.minZoom = 1;
    this.maxZoom = 2;
    this.controls;
    this.elements = [];
  }
  render() {
    return (
      <Container ref={el => (this.container = el)} onMouseDown={this.cameraRay} />
    );
  }
  cameraRay = () => {
    let cameraRay = new THREE.Raycaster();
    let rayVector = new THREE.Vector2(0, 0);
    cameraRay.setFromCamera(rayVector, this.camera);
    this.selected = cameraRay.intersectObjects(this.scene.children, true);
    try {
      if (typeof this.selected !== 'undefined') {
        // reading gltf.scene.children[0].nam
        this.props.LOOKING_AT(this.selected[0].object.parent.parent.name);
      }
    } catch (e) {
      this.props.LOOKING_AT('');
    }
  };
  controls = () => {
    this.controls = new THREE.OrbitControls(this.camera, this.container);
  };
  animate = () => {
    requestAnimationFrame(this.animate);
    if (this.elements) {
      // rotates every gltf.scene object pushed to this.elements
      this.elements.forEach(element => {
        element.rotation.y += 0.01;
        if (Math.round(Math.sin(element.rotation.y))) console.log('h');
      });
    }
    this.renderer.render(this.scene, this.camera);
  };
  componentDidMount = () => {
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000,
    );
    // default: white
    this.scene.background = new THREE.Color();
    const light = new THREE.AmbientLight();
    this.scene.add(light);
    const setCamera = () => {
      // telling this.camera what to lock at
      // setting this.camera init position
      // this.camera.target = new THREE.Vector3(0, 0, 50);
      // last one is fov
      this.camera.position.set(0, 0, 1);
      this.scene.add(this.camera);
    };
    const createButton = () => {
      const MAP_LOADER = new THREE.GLTFLoader();
      //spheredata.lenght determinates sphere quantity
      for (let i of config) {
        let mystery = require(`../assets/3d/${i.id}.gltf`);
        MAP_LOADER.parse(mystery, './', gltf => {
          this.scene.add(gltf.scene);
          console.log(gltf)
          gltf.scene.position.x = i.x;
          gltf.scene.position.y = i.y;
          gltf.scene.position.z = i.z;
          gltf.scene.children[0].name = i.id;
          this.scene.add(gltf.scene);
          this.elements.push(gltf.scene);
        });
      }
    };
    const onWindowResize = () => {
      // asign new window sizes to camera
      this.camera.aspect =
        this.container.clientWidth / this.container.clientHeight;
      // updates camera projections
      this.camera.updateProjectionMatrix();
      // updates this.renderer size on reductction for responsive canvas
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight,
      );
    };
    // adding addEventListeners for functions onClick and onWindowResize
    window.addEventListener('resize', onWindowResize, false);
    // wait react container element (This must be called at the end of everything)
    setCamera();
    createButton();
    this.controls();
    this.animate();
    this.cameraRay();
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Scene);