import * as THREE from 'three'
import gsap from 'gsap'
import { Utils } from './lib/Utils'

import fragment from './shaders/Grass.frag'
import vertex from './shaders/Grass.vert'

import albedoPath from '../assets/grass_albedo.jpg'
import alphaPath from '../assets/grass_alpha.jpg'

class Grass {
  name: string
  group: THREE.Object3D

  geometry?: THREE.BufferGeometry
  material?: THREE.RawShaderMaterial
  uniforms?: { [uniform: string]: THREE.IUniform }
  mesh?: THREE.Mesh

  fieldSize:number
  amount=3800

  // force
  spring = {
    acc: 0,
    vel: 0,
    rad: 0,
    bob: -0.1,
    restLength: 0.03,
    k: 0.001
  }

  growInc = 0
  constructor (fieldSize = 200) {
    this.name = 'Grass'
    this.group = new THREE.Object3D()
    this.group.name = this.name + 'Group'
    this.fieldSize = fieldSize
  }

  create (model:THREE.Group): void {
    this.vertex(model)
    this.program()
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.group.add(this.mesh)
  }

  vertex (model:THREE.Group): void {
    // base
    let vertice:number[] = []
    let normal:number[] = []
    let uv:number[] = []
    let indices:number[] = []
    // customize
    let offsetPos:number[] = []
    let random:number[] = []

    model.traverse((object:any) => {
      if (object.isMesh) {
        vertice = object.geometry.attributes.position.array
        uv = object.geometry.attributes.uv.array
        normal = object.geometry.attributes.normal.array
        indices = object.geometry.index.array
      }
    })

    for (let i = 0; i < this.amount; i++) {
      const posX = Utils.random(-this.fieldSize, this.fieldSize)
      const posY = 0
      const posZ = Utils.random(-this.fieldSize, this.fieldSize)
      offsetPos = [
        ...offsetPos,
        posX, posY, posZ
      ]
      const ranX = Utils.random(0, 1)
      const ranY = Utils.random(0, 1)
      const ranZ = Utils.random(0, 1)
      random = [
        ...random,
        ranX, ranY, ranZ
      ]
    }

    this.geometry = new THREE.InstancedBufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertice), 3))
    this.geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normal), 3))
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uv), 2))
    this.geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1))
    const offsetPosIba = new THREE.InstancedBufferAttribute(new Float32Array(offsetPos), 3)
    const randomIba = new THREE.InstancedBufferAttribute(new Float32Array(random), 3)
    this.geometry.setAttribute('offsetPos', offsetPosIba)
    this.geometry.setAttribute('random', randomIba)
  }

  program (): void {
    const albedoTexture = new THREE.TextureLoader().load(albedoPath)
    const alphaTexture = new THREE.TextureLoader().load(alphaPath)
    albedoTexture.flipY = false
    alphaTexture.flipY = false

    this.uniforms = {
      uTime: { value: 0 },
      uFieldSize: { value: this.fieldSize },
      uAlbedoTex: { value: albedoTexture },
      uAlphaTex: { value: alphaTexture },

      uScale: { value: 1.0 },
      uRotateY: { value: 0.0 },

      uFreq: { value: 1.5 },
      uAmp: { value: 0.03 },
      uSpeed: { value: 58.0 },
      uSpring: { value: 0 },

      uFresnelColor: { value: new THREE.Color('#b78310') },
      uFresnelIntensity: { value: 0 },
      uFresnelStep: { value: new THREE.Vector2(0, 1) },
      uColorFactor: { value: 0 }
    }

    this.material = new THREE.RawShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: this.uniforms,
      side: THREE.DoubleSide,
      transparent: true
    })
  }

  grow (): void {
    gsap.to(this.uniforms!.uScale, {
      value: '+=18',
      duration: 2.0,
      ease: 'power3.inOut'
    })

    if (this.growInc === 0) {
      gsap.to(this.uniforms!.uRotateY, {
        value: '+=0.05',
        duration: 4.0,
        ease: 'power3.out'
      })
    } else if (this.growInc === 1) {
      gsap.to(this.uniforms!.uRotateY, {
        value: '+=0.02',
        duration: 3.0,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.to(this.uniforms!.uFresnelIntensity, {
            value: 0.9,
            duration: 0.8,
            ease: 'none',
            repeat: -1,
            yoyo: true
          })
        }
      })
    } else if (this.growInc === 2) {
      gsap.killTweensOf(this.uniforms!.uFresnelIntensity)
      gsap.to(this.uniforms!.uColorFactor, {
        value: 0.6,
        duration: 1.5,
        ease: 'none',
        onComplete: () => {
          gsap.to(this.uniforms!.uColorFactor, {
            value: 0.5,
            duration: 0.6,
            ease: 'none',
            repeat: -1,
            yoyo: true
          })
        }
      })
      gsap.to(this.uniforms!.uRotateY, {
        value: '+=0.02',
        duration: 3.0,
        ease: 'power3.inOut'
      })
    } else if (this.growInc === 3) {
      gsap.killTweensOf(this.uniforms!.uColorFactor)
      gsap.to(this.uniforms!.uFresnelIntensity, {
        value: 0,
        duration: 3,
        ease: 'expo.inOut'
      })
      gsap.to(this.uniforms!.uColorFactor, {
        value: 1,
        ease: 'expo.inOut',
        duration: 3
      })
      gsap.to(this.uniforms!.uRotateY, {
        value: '+=0.02',
        duration: 3.0,
        ease: 'expo.inOut'
      })
    }
    this.growInc += 1
  }

  breeze (): void {
    gsap.to(this.uniforms!.uAmp, {
      value: 0.5,
      duration: 2.0,
      ease: 'none'
    })
  }

  wind (): void {
    gsap.to(this.spring, {
      bob: -3.0,
      duration: 0.4,
      ease: 'power2.inOut'
    })
  }

  onUpdate (time:number) {
    this.uniforms!.uTime.value = time

    // force
    const extension = this.spring.bob - this.spring.restLength
    const force = -this.spring.k * extension

    // update
    this.spring.acc = force
    this.spring.vel += this.spring.acc
    this.spring.rad += this.spring.vel

    // damp
    this.spring.rad = this.spring.rad * 0.989
    this.spring.bob = this.spring.rad
    this.uniforms!.uSpring.value = this.spring.rad

    // reset
    this.spring.acc *= 0
  }
}

export { Grass }
