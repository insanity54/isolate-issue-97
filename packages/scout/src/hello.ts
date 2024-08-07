import icons from './icons.ts'

export default function hello(thing: string) {
  if (thing === 'world') {
    return icons.world
  } else {
    return 'hi'
  }
}