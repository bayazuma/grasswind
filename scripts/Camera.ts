import * as THREE from 'three'
import gsap from 'gsap'

class Camera extends THREE.PerspectiveCamera {
  animation1 () {
    gsap.to(this.position, {
      x: 0,
      y: 27,
      z: 180,
      duration: 3.0,
      ease: 'power3.inOut'
    })
    gsap.to(this.rotation, {
      x: -0.1,
      y: 0,
      z: 0,
      duration: 3.0,
      ease: 'power3.inOut'
    })
  }

  animation2 () {
    gsap.to(this.position, {
      x: 0,
      y: 150,
      z: 310,
      duration: 3.0,
      ease: 'power3.inOut'
    })
    gsap.to(this.rotation, {
      x: -0.3,
      y: 0,
      z: 0,
      duration: 3.0,
      ease: 'power3.inOut'
    })
  }

  animation3 () {
    gsap.to(this.position, {
      x: 0,
      y: 100,
      z: 300,
      duration: 3.0,
      ease: 'power3.inOut'
    })
    gsap.to(this.rotation, {
      x: -0.2,
      y: 0,
      z: 0,
      duration: 3.0,
      ease: 'power3.inOut'
    })
  }

  animation4 () {
    gsap.to(this.position, {
      x: 0,
      y: 90,
      z: 302,
      duration: 3.0,
      ease: 'power3.inOut'
    })
    gsap.to(this.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 3.0,
      ease: 'power3.inOut'
    })
  }
}

export { Camera }
