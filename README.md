# Pocket Camera

Web-component that transforms your webcam into a Nintendo GameBoy Camera with authentic dithering and 4-color green palette. A nostalgic filter that recreates the iconic 1998 handheld camera experience.

Originally created in 2022 as a colorblind accessibility experiment.

## Usage

I have no plans to publish this as a package because there isn't much code. If you want to use it, copy the source code directly into your project - either the whole web component or just the processing function.

Copy these files:
- `src/PocketCamera.ts` - Main web-component
- `src/processing.ts` - Image processing function

## Component attributes

- `width` - Canvas width (default: 320)
- `height` - Canvas height (default: 240)
- `auto-start` - Start camera automatically

## Demo

```bash
npm run dev
```

Visit `http://localhost:8000/demo/`

## Build

```bash
npm run build
```

## License

[MIT](./LICENSE)
