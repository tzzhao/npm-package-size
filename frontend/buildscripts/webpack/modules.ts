import {getBabelLoader, getCssLoaders} from './loaders';

export function getModules() {
  return {
    rules: [
      getBabelLoader(),
      getCssLoaders()
    ],
  }
}
