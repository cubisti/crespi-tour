import React, { Component } from 'react';
import 'three-orbitcontrols';
import { Container } from '../../style/photo';
export class PhotoSphere extends Component {
  constructor (props) {
    super (props);
    this.scene;
    this.camera;
    this.renderer;
    this.controls;
  }
  render () {
    return (
      <Container ref={el => this.container = el} />
    );
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onWindowResize, false);
  }
  componentDidMount = () => {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.camera = new THREE.Camera();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(new THREE.Color('white'));
    this.container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000,
    );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );
    this.camera.position.set(-1, 0, 0);
    this.controls = new THREE.OrbitControls(this.camera, this.container);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;
    this.controls.screenSpacePanning = false;
    this.controls.rotateSpeed = 0.1;
    this.controls.enableZoom = false;
    let geometry = new THREE.SphereGeometry(-20, 20, 20);
    let loader = new THREE.TextureLoader();
    let texture = loader.load("../../assets/img/test.jpg");
    let material = new THREE.MeshBasicMaterial({
      map: texture
    });
    texture.flipY = true;
    let sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);
    this.scene.add(sphere);
    window.addEventListener('resize', this.onWindowResize, false);
    this.animate();
  }
  onWindowResize = () => {
    // asign new window sizes to this.camera
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    // updates this.camera projections
    this.camera.updateProjectionMatrix();
    // updates this.renderer size on reductction for responsive canvas
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  };
  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
};
