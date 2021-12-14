import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GUI } from 'lil-gui'
import { Canvas } from './Canvas'
import { Text } from './Text'
import modelPath from '../assets/grass.glb'

const canvas = new Canvas(document.getElementById('container') as HTMLElement)
const text = new Text()
const loader = new GLTFLoader()
loader.load(modelPath, (data) => {
  const gltf = data
  const model = gltf.scene
  canvas.init(model)
  text.init()

  canvas.play()

  /**
   * --------------------------------------
   * animation
   * --------------------------------------
   */
  const animations = {
    grow: () => {
      canvas.grass!.grow()
      switch (canvas.grass!.growInc) {
        case 1:
          canvas.camera.animation1()
          text.showGrass()
          break
        case 2:
          canvas.camera.animation2()
          text.hideGrass()
          break
        case 3:
          canvas.camera.animation3()
          break
        case 4:
          canvas.camera.animation4()
          text.changeBlendMode()
          text.showInTheWind()
          break
        default:
          break
      }
    }
  }

  /**
   * --------------------------------------
   * GUI
   * --------------------------------------
   */
  const gui = new GUI()
  const animationFolder = gui.addFolder('animation')
  const grassFolder = gui.addFolder('grass')
  const windFolder = gui.addFolder('wind')
  const colorFolder = gui.addFolder('color')
  const helperFolder = gui.addFolder('helper')

  // animationFolder.add(canvas, 'play')
  // animationFolder.add(canvas, 'pause')
  animationFolder.add(animations, 'grow')
  animationFolder.add(canvas.grass!, 'breeze')
  animationFolder.add(canvas.grass!, 'wind')

  // grass
  grassFolder.add(canvas.grass!.uniforms!.uScale, 'value', 1, 80, 1).listen().name('uScale')
  grassFolder.add(canvas.grass!.uniforms!.uRotateY, 'value', -Math.PI, Math.PI, 0.01).listen().name('uRotateY')
  grassFolder.close()

  // wind
  windFolder.add(canvas.grass!.uniforms!.uFreq, 'value', 1, 10, 0.5).listen().name('uFreq')
  windFolder.add(canvas.grass!.uniforms!.uAmp, 'value', 0, 2, 0.01).listen().name('uAmp')
  windFolder.add(canvas.grass!.uniforms!.uSpeed, 'value', 0, 100, 1).listen().name('uSpeed')
  windFolder.add(canvas.grass!.uniforms!.uSpring, 'value', -1, 1, 0.01).listen().name('uSpring')
  windFolder.close()

  // color
  colorFolder.addColor(canvas.grass!.uniforms!.uFresnelColor, 'value').name('uFresnelColor')
  // colorFolder.add(canvas.grass.uniforms!.uFresnelStep.value, 'x', 0, 1, 0.01).listen().name('Fresnel start')
  // colorFolder.add(canvas.grass.uniforms!.uFresnelStep.value, 'y', 0, 1, 0.01).listen().name('Fresnel end')
  colorFolder.add(canvas.grass!.uniforms!.uFresnelIntensity, 'value', 0, 1, 0.01).listen().name('uFresnelIntensity')
  colorFolder.add(canvas.grass!.uniforms!.uColorFactor, 'value', 0, 1, 0.01).listen().name('uColorFactor')
  colorFolder.close()

  helperFolder.add(canvas.axesHelper!, 'visible').name('axes')
  helperFolder.add(canvas.orbitControls!, 'enabled').name('orbit controls')
  helperFolder.close()
})
