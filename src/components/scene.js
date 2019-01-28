import React, { Component } from 'react';
import 'three-gltfloader';
import 'three-orbitcontrols';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  SHOW_INFO,
  HIDE_INFO,
  LOOKING_AT,
  DONT_LOOK,
} from '../redux/actions/actions';
import { Container, Button } from '../style/scene';
import { config } from '../configuration/config';
const mapStateToProps = state => ({
  info: state.info,
  lookingAt: state.looking,
  language: state.language,
});
// sends props actions, taken as props to reducer
const mapDispatchToProps = dispatch => ({
  // binding actions. This method takes: (action, dispatcher)
  ...bindActionCreators(
    {
      SHOW_INFO,
      HIDE_INFO,
      LOOKING_AT,
      DONT_LOOK,
    },
    dispatch,
  ),
});

class Scene extends Component {
  constructor(props) {
    super(props);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.buttonsGroup = new THREE.Group();
    this.selected;
    this.minZoom = 1;
    this.maxZoom = 2;
    this.controls;
    this.elements = [];
  }
  render() {
    return (
      <Container
        color={this.props.lookingAt.color}
        ref={el => (this.container = el)}
        onTouchStart={this.cameraRay}
        onPointerDown={this.cameraRay}
      >
        <Button
          onTouchStart={() => this.props.SHOW_INFO(this.props.language)}
          onPointerDown={() => this.props.SHOW_INFO(this.props.language)}
        >
          INFO
        </Button>
      </Container>
    );
  }
  cameraRay = () => {
    let cameraRay = new THREE.Raycaster();
    let rayVector = new THREE.Vector2(0, 0);
    cameraRay.setFromCamera(rayVector, this.camera);
    this.selected = cameraRay.intersectObjects(this.scene.children, true);
    try {
      if (typeof this.selected !== 'undefined') {
        // reading gltf.scene.children[0].name
        this.props.LOOKING_AT(
          this.selected[0].object.parent.parent.name,
          this.props.language,
        );
      }
    } catch (e) {
      this.props.DONT_LOOK();
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
        element.rotation.y += 0.005;
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
    this.renderer.setClearColor(new THREE.Color('black'), 0);
    this.container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000,
    );
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
      // takes the keys of config and loads them into an array
      let keys = Object.getOwnPropertyNames(config);
      for (let i of keys) {
        if (i != 'info') {
          // requiring 3d objects files using jsonloader
          let mystery = require(`../assets/3d/${i}.gltf`);
          // parsing previously loaded json file
          MAP_LOADER.parse(mystery, './', gltf => {
            // setting object position
            gltf.scene.position.set(
              config[i].position.x,
              config[i].position.y,
              config[i].position.z,
            );
            // setting scene name
            gltf.scene.children[0].name = i;
            // adding model to scene
            this.scene.add(gltf.scene);
            // pushing model to dedicate array
            this.elements.push(gltf.scene);
          });
        }
      }
    };
    const onWindowResize = () => {
      try {
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
      } catch (e) {}
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
