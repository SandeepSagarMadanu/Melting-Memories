import prisma from '../utils/prisma.js';

export const getBlogs = async (req, res) => {
  try {
    const { category } = req.query;
    const where = {};
    if (category) {
      where.category = category;
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { publishedAt: 'desc' }
    });
    res.json(blogs);
  } catch (error) {
    console.error('Get Blogs Error:', error);
    res.status(500).json({ message: 'Error retrieving blogs' });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await prisma.blog.findUnique({ where: { slug } });
    if (!blog) {
      return res.status(404).json({ message: 'Blog article not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Get Blog By Slug Error:', error);
    res.status(500).json({ message: 'Error retrieving blog article' });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, slug, content, image, category, readTime } = req.body;

    if (!title || !slug || !content || !category) {
      return res.status(400).json({ message: 'Title, slug, content, and category are required.' });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        image: image || null,
        category,
        readTime: readTime || '3 mins read',
        publishedAt: new Date()
      }
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error('Create Blog Error:', error);
    res.status(500).json({ message: 'Error creating blog' });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, image, category, readTime } = req.body;

    const data = {};
    if (title) data.title = title;
    if (slug) data.slug = slug;
    if (content) data.content = content;
    if (image) data.image = image;
    if (category) data.category = category;
    if (readTime) data.readTime = readTime;

    const blog = await prisma.blog.update({
      where: { id },
      data
    });

    res.json(blog);
  } catch (error) {
    console.error('Update Blog Error:', error);
    res.status(500).json({ message: 'Error updating blog' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.blog.delete({ where: { id } });
    res.json({ message: 'Blog deleted successfully.' });
  } catch (error) {
    console.error('Delete Blog Error:', error);
    res.status(500).json({ message: 'Error deleting blog.' });
  }
};
