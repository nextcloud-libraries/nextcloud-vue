import { Tooltip } from '../src/directives/index.js'

// The export here MUST be default or module.export
// this is what is imported by the styleguide
export default (app) => {
  app.directive('tooltip', Tooltip)
}

