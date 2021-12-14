class Utils {
  static TAU = 2 * Math.PI
  static random (min: number, max: number): number {
    return Math.random() * (max - min) + min
  }
}

export { Utils }
