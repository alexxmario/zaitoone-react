# 3D Components Documentation

## Components

### Model3DViewer

A generic 3D model viewer component using React Three Fiber. This is the only
3D component still in use — it renders the dish models on the product detail
pages (`/menu/:slug`) and the model on the loading screen.

#### Props

- `modelUrl` (string, required) - Path to the 3D model file (GLB/GLTF)
- `scale` (number, default: 1) - Scale of the model
- `position` ([x, y, z], default: [0, 0, 0]) - Position of the model
- `autoRotate` (boolean, default: false) - Auto-rotate the model
- `enableZoom` (boolean, default: true) - Enable zoom controls
- `enablePan` (boolean, default: true) - Enable pan controls
- `className` (string) - CSS classes for the container
- `cameraPosition` ([x, y, z], default: [0, 0, 5]) - Camera position

#### Example

```jsx
import Model3DViewer from '../components/3d/Model3DViewer';

<Model3DViewer
  modelUrl={cdnUrl('/models/3d/hummus-cu-muguri-de-pin.glb')}
  scale={2}
  autoRotate={true}
  className="w-full h-96"
/>
```

## Where the models live

Dish models are in `public/models/3d/` and are wired to menu items through the
`modelUrl` field in `src/data/menuData.js`. In production they are served from
R2 via `cdnUrl()`; in development they come from `public/`.

`public/models/menu-items/` holds only `tacchino-sandwich.glb`, used by the
loading screen.

## Performance Tips

1. Use GLB format for smaller file sizes
2. Keep models under 5MB
3. Use `autoRotate` sparingly for better performance
4. Consider lazy loading for pages with many 3D models
