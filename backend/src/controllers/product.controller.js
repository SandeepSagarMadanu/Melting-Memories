import prisma from '../utils/prisma.js';

// --- CATEGORIES ---
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } }
    });
    res.json(categories);
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({ message: 'Error retrieving categories' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const category = await prisma.category.create({
      data: { name, description, image }
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('Create Category Error:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: { name, description, image }
    });
    res.json(category);
  } catch (error) {
    console.error('Update Category Error:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete Category Error:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
};

// --- PRODUCTS ---
export const getProducts = async (req, res) => {
  try {
    const { category, search, featured, limit } = req.query;

    const where = {};
    if (category) {
      where.categoryId = category;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      take: limit ? parseInt(limit) : undefined,
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get Product By ID Error:', error);
    res.status(500).json({ message: 'Error retrieving product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, salePrice, inventory, images, categoryId, colors, fragrances, burnTime, weight, isFeatured } = req.body;

    if (!name || !description || price === undefined || !categoryId) {
      return res.status(400).json({ message: 'Name, description, price, and categoryId are required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        inventory: parseInt(inventory) || 0,
        images: images || [],
        categoryId,
        colors: colors || ["All Colors"],
        fragrances: fragrances || [],
        burnTime: burnTime || "Approximately 4 Hours",
        weight: weight || "Varies by size",
        isFeatured: !!isFeatured
      },
      include: { category: true }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, salePrice, inventory, images, categoryId, colors, fragrances, burnTime, weight, isFeatured } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(salePrice) : null;
    if (inventory !== undefined) updateData.inventory = parseInt(inventory);
    if (images) updateData.images = images;
    if (categoryId) updateData.categoryId = categoryId;
    if (colors) updateData.colors = colors;
    if (fragrances) updateData.fragrances = fragrances;
    if (burnTime) updateData.burnTime = burnTime;
    if (weight) updateData.weight = weight;
    if (isFeatured !== undefined) updateData.isFeatured = !!isFeatured;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true }
    });

    res.json(product);
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};
