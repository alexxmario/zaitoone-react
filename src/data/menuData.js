export const menuData = {
  coldMezze: [
    {
      name: 'Hummus',
      price: '35 RON',
      description: 'Creamy chickpea purée blended with tahini, lemon juice, and garlic',
    },
    {
      name: 'Labneh',
      price: '30 RON',
      description: 'Strained yogurt drizzled with olive oil and served with fresh pita',
    },
    {
      name: 'Moutabal',
      price: '35 RON',
      description: 'Smoky grilled eggplant with tahini, garlic, and lemon',
    },
    {
      name: 'Mouhammara',
      price: '38 RON',
      description: 'Red pepper and walnut dip with pomegranate molasses',
    },
    {
      name: 'Makdous',
      price: '40 RON',
      description: 'Pickled baby eggplant stuffed with walnuts and red pepper',
    },
    {
      name: 'Tabbouleh',
      price: '35 RON',
      description: 'Fresh parsley salad with bulgur, tomatoes, lemon, and olive oil',
    },
  ],
  hotMezze: [
    {
      name: 'Falafel',
      price: '32 RON',
      description: 'Crispy chickpea fritters with tahini sauce',
    },
    {
      name: 'Kebbeh',
      price: '45 RON',
      description: 'Ground beef and bulgur shells stuffed with spiced meat and pine nuts',
    },
    {
      name: 'Sambousik',
      price: '38 RON',
      description: 'Golden fried pastries filled with spiced meat or cheese',
    },
    {
      name: 'Makanek',
      price: '42 RON',
      description: 'Lebanese spiced sausages sautéed with lemon and pomegranate molasses',
    },
    {
      name: 'Lahme Beajine',
      price: '40 RON',
      description: 'Lebanese meat pies with spiced ground lamb',
    },
    {
      name: 'Ras Asfour',
      price: '48 RON',
      description: 'Minced meat with pomegranate sauce and pine nuts',
    },
  ],
  grill: [
    {
      name: 'Chicken Shawarma',
      price: '55 RON',
      description: 'Marinated chicken slow-roasted on a vertical spit, served with tahini and garlic sauce',
      modelUrl: '/models/menu-items/tacchino-sandwich.glb',
      scale: 8,
    },
    {
      name: 'Beef Shawarma',
      price: '60 RON',
      description: 'Tender beef marinated in spices, served with tahini and pickles',
      modelUrl: '/models/menu-items/PULLED PORK SANDWICH.glb',
      scale: 8,
    },
    {
      name: 'Mixed Grill Platter',
      price: '95 RON',
      description: 'Lamb kebabs, chicken skewers, and kofta served with rice and grilled vegetables',
      modelUrl: '/models/menu-items/limba-de-vita-cu-masline.glb',
      scale: 9,
    },
    {
      name: 'Lamb Kebab',
      price: '75 RON',
      description: 'Tender lamb cubes marinated and grilled to perfection',
    },
    {
      name: 'Chicken Tawook',
      price: '65 RON',
      description: 'Marinated chicken breast skewers with garlic sauce',
    },
    {
      name: 'Kafta',
      price: '68 RON',
      description: 'Grilled ground meat skewers with parsley, onion, and spices',
    },
  ],
  salads: [
    {
      name: 'Fattoush',
      price: '38 RON',
      description: 'Mixed greens with crispy pita chips, pomegranate molasses, and sumac',
    },
    {
      name: 'Rocca Salad',
      price: '35 RON',
      description: 'Fresh arugula with cherry tomatoes, parmesan, and balsamic dressing',
    },
  ],
  desserts: [
    {
      name: 'Baklava',
      price: '28 RON',
      description: 'Layers of phyllo pastry with pistachios and honey syrup',
      modelUrl: '/models/menu-items/fagottini-ai-formaggio-e-pere.glb',
      scale: 10,
    },
    {
      name: 'Kashta',
      price: '30 RON',
      description: 'Sweet cream topped with pistachios and orange blossom syrup',
    },
    {
      name: 'Knefeh',
      price: '35 RON',
      description: 'Shredded phyllo with sweet cheese, topped with syrup and pistachios',
    },
    {
      name: 'Halawet El Jibn',
      price: '32 RON',
      description: 'Sweet cheese rolls filled with cream and pistachios',
    },
  ],
};

export const categories = [
  { id: 'coldMezze', title: 'Cold Mezze', label: 'Category 01' },
  { id: 'hotMezze', title: 'Hot Mezze', label: 'Category 02' },
  { id: 'grill', title: 'From the Grill', label: 'Category 03' },
  { id: 'salads', title: 'Salads', label: 'Category 04' },
  { id: 'desserts', title: 'Desserts', label: 'Category 05' },
];
