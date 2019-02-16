import React, { Component } from 'react';
import 'three-gltfloader';
import 'three-orbitcontrols';
import 'three-ortographic-trackball-controls';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  SHOW_INFO,
  HIDE_INFO,
  LOOKING_AT,
  DONT_LOOK,
  DONT_MOVE,
  MOVE,
  HIDE_LOADING_SCREEN,
} from '../redux/actions/actions';
import { LANGUAGE } from '../redux/thunks/changeLanguage';
import { Container, Color } from '../style/scene';
import { Button } from '../style/common';
import { config } from '../configuration/config';
import { mapStateToProps } from '../redux/mapStateToProps';
// sends props actions, taken as props to reducer
const mapDispatchToProps = dispatch => ({
  // binding actions. This method takes: (action, dispatcher)
  actions: bindActionCreators(
    {
      SHOW_INFO,
      HIDE_INFO,
      LOOKING_AT,
      DONT_LOOK,
      DONT_MOVE,
      MOVE,
      HIDE_LOADING_SCREEN,
    },
    dispatch,
  ),
  setLanguage: () => dispatch(LANGUAGE()),
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
    this.orbitControls;
    this.transformControls = [];
    this.elements = [];
    this.elementsNumber = 0;
  }
  render() {
    return (
      <Color color={this.props.lookingAt.color}>
        <Container
          color={this.props.lookingAt.color}
          ref={el => (this.container = el)}
          onTouchStart={e => {
            this.cameraRay();
            this.objectClick(e);
          }}
          onPointerDown={e => {
            this.cameraRay();
            this.objectClick(e);
          }}
        >
          <Button
            onTouchStart={() =>
              this.props.actions.SHOW_INFO(this.props.language)
            }
            onPointerDown={() =>
              this.props.actions.SHOW_INFO(this.props.language)
            }
          >
          x
          </Button>
        </Container>
      </Color>
    );
  }
  objectClick = event => {
  let mouse = new THREE.Vector2();
  mouse.x = (event.clientX / this.container.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / this.container.clientHeight) * 2 + 1;
  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, this.camera);
  let clicked = raycaster.intersectObjects(this.scene.children, true);
    try {
      if (
        typeof clicked !== 'undefined' &&
        clicked[0].object.parent.parent.name
      ) {
        // reading gltf.scene.children[0].name
        this.props.actions.MOVE(clicked[0].object.parent.parent.name);
        this.camera.updateProjectionMatrix();
        this.handleChange(this.props.move.position);
      } else {
        this.props.actions.DONT_MOVE({...this.camera.position});
        this.handleChange({x: 0, y: 0, z: 0,});
      }
    } catch (e) {
      this.props.actions.DONT_MOVE({...this.camera.position});
      this.handleChange({x: 0, y: 0, z: 0,});
    }
  };
  changeTarget = object => {
    this.orbitControls.target.set(
      object.x,
      object.y,
      object.z,
    );
    if (this.props.move.orbitControls) {
      this.orbitControls.maxPolarAngle = Math.PI - Math.PI / 2.1;
      this.orbitControls.minPolarAngle = Math.PI / 2.1;
      this.orbitControls.minDistance = 210;
      this.orbitControls.maxDistance = 210;
    } else {
      this.camera.position.set(
        this.props.move.position.x,
        this.props.move.position.y,
        this.props.move.position.z,
      );
      this.orbitControls.minDistance = 200;
      this.orbitControls.maxPolarAngle = Math.PI;
      this.orbitControls.minPolarAngle = 0;
    }
  }
  handleChange = (object) => {
    this.changeTarget(object);
  }
  cameraRay = () => {
    let cameraRay = new THREE.Raycaster();
    let rayVector = new THREE.Vector2(0, 0);
    cameraRay.setFromCamera(rayVector, this.camera);
    this.selected = cameraRay.intersectObjects(this.scene.children, true);
    try {
      if (typeof this.selected !== 'undefined') {
        // reading gltf.scene.children[0].name
        this.props.actions.LOOKING_AT(
          this.selected[0].object.parent.parent.name,
          this.props.language,
        );
      }
    } catch (e) {
      this.props.actions.DONT_LOOK();
    }
  };
  orbitControls = () => {
    this.orbitControls = new THREE.OrbitControls(this.camera, this.container);
    this.orbitControls.maxPolarAngle = Math.PI - Math.PI / 2.1;
    this.orbitControls.minPolarAngle = Math.PI / 2.1;
    this.orbitControls.minDistance = 210;
    this.orbitControls.maxDistance = 210;
  };
  animate = () => {
    requestAnimationFrame(this.animate);
    if (
      typeof this.elements !== 'undefined' &&
      this.elementsNumber !== 0 &&
      this.props.loading === true
    ) {
      this.props.actions.HIDE_LOADING_SCREEN();
    } else {
    }
    this.renderer.render(this.scene, this.camera);
  };
  componentDidMount = () => {
    this.props.setLanguage();
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
      this.camera.position.set(0, 0, -190);
      this.scene.add(this.camera);
    };
    const createButton = () => {
      const MAP_LOADER = new THREE.GLTFLoader();
      // takes the keys of config and loads them into an array
      let keys = Object.getOwnPropertyNames(config);
      this.elementsNumber = keys.length;
      for (let i of keys) {
        if (i !== 'info') {
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
            gltf.scene.name = i;
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
    this.orbitControls();
    this.animate();
    this.cameraRay();
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Scene);
