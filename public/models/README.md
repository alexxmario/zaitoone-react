# 3D Models

## Folder Structure

```
public/models/
├── 3d/                       # dish models shown on /menu/:slug
│   ├── hummus-cu-muguri-de-pin.glb
│   ├── fattoush.glb
│   └── ...
└── menu-items/
    └── tacchino-sandwich.glb # loading screen only
```

## Supported Formats

- **GLB** (recommended) - Binary glTF format, most efficient
- **GLTF** - JSON-based glTF format

## How to Add 3D Models

1. Place the `.glb` file in `public/models/3d/`
2. Reference it from the menu item in `src/data/menuData.js`:

```js
modelUrl: cdnUrl('/models/3d/your-model.glb'),
```

3. Upload the same file to the R2 bucket — production serves models from the
   CDN (`REACT_APP_CDN_URL`), not from `public/`.

`Model3DViewer` then renders it on the product detail page.

## Where to Get 3D Models

Free 3D model resources:
- [Sketchfab](https://sketchfab.com) - Large collection of free 3D models
- [Poly Pizza](https://poly.pizza) - Free low-poly models
- [TurboSquid Free](https://www.turbosquid.com/Search/3D-Models/free) - Free 3D models
- [CGTrader Free](https://www.cgtrader.com/free-3d-models) - Free 3D models

## Tips

- Keep model file sizes under 5MB for fast loading
- Use GLB format for better compression
- Test models before adding to production
- Consider using low-poly models for better performance
