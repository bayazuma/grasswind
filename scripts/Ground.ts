import * as THREE from 'three'
import { Utils } from './lib/Utils'
import fragment from './shaders/Ground.frag'
import vertex from './shaders/Ground.vert'

class Ground {
  name: string
  group: THREE.Object3D
  geometry?: THREE.BufferGeometry
  material?: THREE.RawShaderMaterial
  mesh?: THREE.Mesh
  fieldSize:number
  constructor (fieldSize = 200) {
    this.name = 'Ground'
    this.group = new THREE.Object3D()
    this.group.name = this.name + 'Group'
    this.fieldSize = fieldSize
  }

  create (): void {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 36, 36)
    this.material = new THREE.RawShaderMaterial({
      side: THREE.FrontSide,
      wireframe: true,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {}
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = Utils.TAU * -0.25
    this.mesh.scale.set(this.fieldSize * 2.2, this.fieldSize * 2.2, 1)
    this.group.add(this.mesh)
  }
}

export { Ground }
