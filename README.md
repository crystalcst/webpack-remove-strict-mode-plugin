# webpack-remove-strict-mode-plugin
remove "use strict"; in js file
support webpack4.x
```javascript
const RemoveStrictPlugin = require('webpack-remove-strict-mode-plugin');


new RemoveStrictPlugin({
  exclude: '',
  extension: ['js'],
}),
```
