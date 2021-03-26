# gradient-avatar

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/gradient-avatar.svg)](https://www.npmjs.com/package/gradient-avatar) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save gradient-avatar
```

## Usage

### Props

```
address: string
primary: string (default: #521E8A)
secondary: string (default: #1DBF8E)
size: number (default: 30)
```

### Example

```tsx
import React from 'react'

import Avatar from 'gradient-avatar'

const Example = () => {
  render() {
    return <Avatar address="0xABCDEF" />
  }
}
```

## License

MIT © [devneser](https://github.com/devneser)
