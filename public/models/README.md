# 3D Models for Menu Items

This folder contains 3D models for your menu items.

## Folder Structure

```
public/models/
└── menu-items/
    ├── hummus.glb
    ├── shawarma.glb
    ├── falafel.glb
    └── baklava.glb
```

## Supported Formats

- **GLB** (recommended) - Binary glTF format, most efficient
- **GLTF** - JSON-based glTF format

## How to Add 3D Models

1. Place your `.glb` or `.gltf` files in the `public/models/menu-items/` folder
2. Use them in your menu by referencing the path

## Where to Get 3D Models

Free 3D model resources:
- [Sketchfab](https://sketchfab.com) - Large collection of free 3D models
- [Poly Pizza](https://poly.pizza) - Free low-poly models
- [TurboSquid Free](https://www.turbosquid.com/Search/3D-Models/free) - Free 3D models
- [CGTrader Free](https://www.cgtrader.com/free-3d-models) - Free 3D models

## Usage Example

```jsx
import MenuItem3D from '../components/3d/MenuItem3D';

<MenuItem3D
  name="Hummus"
  description="Creamy chickpea dip with tahini and olive oil"
  price="25 RON"
  modelUrl="/models/menu-items/hummus.glb"
  scale={1.5}
  autoRotate={true}
/>
```

## Tips

- Keep model file sizes under 5MB for fast loading
- Use GLB format for better compression
- Test models before adding to production
- Consider using low-poly models for better performance
