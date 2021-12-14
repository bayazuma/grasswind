import gsap from 'gsap'

class Text {
  name: string
  contentsEl: HTMLElement
  grassEl: HTMLElement
  inTheWindEl: HTMLElement

  constructor () {
    this.name = 'Text'
    this.contentsEl = document.querySelector('.texts') as HTMLElement
    this.grassEl = this.contentsEl.querySelector('.texts__grass') as HTMLElement
    this.inTheWindEl = this.contentsEl.querySelector('.texts__inTheWind') as HTMLElement
  }

  init () {
    gsap.set(this.grassEl, {
      y: '100%',
      autoAlpha: 0
    })
    gsap.set(this.inTheWindEl, {
      x: '-40%',
      y: '90%',
      scale: 1.2,
      rotateY: -15,
      rotateZ: -7,
      autoAlpha: 0
    })
  }

  changeBlendMode () {
    gsap.set(this.contentsEl, {
      mixBlendMode: 'unset'
    })
  }

  showGrass (): void {
    gsap.to(this.grassEl, {
      y: '0%',
      autoAlpha: 1,
      duration: 3,
      ease: 'power3.inOut'
    })
  }

  hideGrass (): void {
    gsap.to(this.grassEl, {
      y: '-50%',
      autoAlpha: 0,
      duration: 2,
      ease: 'power3.inOut'
    })
  }

  showInTheWind (): void {
    gsap.to(this.inTheWindEl, {
      x: '0%',
      y: '0%',
      scale: 1,
      rotateY: 0,
      rotateZ: 0,
      autoAlpha: 1,
      duration: 1.8,
      delay: 0.5,
      ease: 'power3.inOut'
    })
  }
}

export { Text }
