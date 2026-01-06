# 3D Components Documentation

## Components

### Model3DViewer

A generic 3D model viewer component using React Three Fiber.

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
import Model3DViewer from './components/3d/Model3DViewer';

<Model3DViewer
  modelUrl="/models/menu-items/hummus.glb"
  scale={2}
  autoRotate={true}
  className="w-full h-96"
/>
```

### MenuItem3D

A menu item card with 3D model preview.

#### Props

- `name` (string, required) - Name of the menu item
- `description` (string, required) - Description of the item
- `price` (string, required) - Price of the item
- `modelUrl` (string, optional) - Path to 3D model
- `imageUrl` (string, optional) - Fallback image if no 3D model
- `scale` (number, default: 1) - Scale of the 3D model
- `autoRotate` (boolean, default: true) - Auto-rotate the model

#### Example

```jsx
import MenuItem3D from './components/3d/MenuItem3D';

<MenuItem3D
  name="Hummus"
  description="Creamy chickpea dip with tahini and olive oil"
  price="25 RON"
  modelUrl="/models/menu-items/hummus.glb"
  scale={1.5}
  autoRotate={true}
/>
```

## Using in Menu Page

```jsx
import MenuItem3D from '../components/3d/MenuItem3D';

const Menu = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <MenuItem3D
        name="Hummus"
        description="Creamy chickpea dip with tahini"
        price="25 RON"
        modelUrl="/models/menu-items/hummus.glb"
      />

      <MenuItem3D
        name="Shawarma"
        description="Marinated meat wrapped in pita"
        price="45 RON"
        modelUrl="/models/menu-items/shawarma.glb"
      />

      <MenuItem3D
        name="Falafel"
        description="Crispy chickpea fritters"
        price="30 RON"
        imageUrl="https://images.unsplash.com/photo-1..."
      />
    </div>
  );
};
```

## Performance Tips

1. Use GLB format for smaller file sizes
2. Keep models under 5MB
3. Use `autoRotate` sparingly for better performance
4. Consider lazy loading for pages with many 3D models
