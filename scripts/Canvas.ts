import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Camera } from './Camera'
import { Grass } from './Grass'
import { Ground } from './Ground'

class Canvas {
  container: HTMLElement
  width: number
  height: number

  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: Camera

  ground?: Ground
  grass?: Grass

  elapsedTime = 0
  oldTime = 0
  isPlaying = false

  orbitControls?: OrbitControls
  axesHelper?: THREE.AxesHelper

  constructor (dom: HTMLElement) {
    this.container = dom
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.scene = new THREE.Scene()

    this.camera = new Camera(
      50,
      this.width / this.height,
      0.1,
      5000
    )
    this.camera.position.set(0, 67, 252)
    this.camera.rotation.set(-0.2, 0, 0)

    this.renderer = new THREE.WebGLRenderer({
      alpha: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0x000000, 1)
    this.container.appendChild(this.renderer.domElement)

    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    this.orbitControls.enabled = false
  }

  init (model:any) {
    this.addObjects(model)
    this.eventAttach()
    this.resize()
  }

  eventAttach () {
    window.addEventListener('resize', this.resize.bind(this))
  }

  addObjects (model:THREE.Group) {
    const fieldSize = 200
    this.grass = new Grass(fieldSize)
    this.grass.create(model)
    this.scene.add(this.grass.group)

    this.ground = new Ground(fieldSize)
    this.ground.create()
    this.scene.add(this.ground.group)

    this.axesHelper = new THREE.AxesHelper(1)
    this.axesHelper.visible = false
    this.scene.add(this.axesHelper)
  }

  play () {
    if (!this.isPlaying) {
      this.oldTime = performance.now()
      this.isPlaying = true
      this.render()
    }
  }

  pause () {
    this.isPlaying = false
  }

  update () {
    const newTime = performance.now()
    const diff = (newTime - this.oldTime) / 1000
    this.oldTime = newTime
    this.elapsedTime += diff

    this.grass!.onUpdate(this.elapsedTime)
    // this.ground.onUpdate(this.elapsedTime)

    if (this.orbitControls!.enabled) {
      this.orbitControls!.update()
    }
  }

  render () {
    if (!this.isPlaying) return
    window.requestAnimationFrame(this.render.bind(this))
    this.update()
    this.renderer.render(this.scene, this.camera)
  }

  resize () {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.renderer.setSize(this.width, this.height)

    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()

    if (this.axesHelper) {
      this.axesHelper.scale.multiplyScalar(this.width)
    }
  }
}

export { Canvas }
