const { Op } = require('sequelize');
const { Product, ProductImage, Category } = require('../models');
const { getCache, set, del, delByPattern } = require('../utils/cache');

const list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const q = (req.query.q || '').trim();
        const categoryId = req.query.category ? parseInt(req.query.category) : undefined;
        const key = `products:list:q=${q}:cat=${categoryId}:page=${page}:limit=${limit}`;

        const where = {};
        if (q) {
            where.name = { [Op.like]: `%${q}%` };
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }

        const cached = await getCache(key);
        if (cached) {
            return res.json({ ...cached, cached: true });
        }

        const products = await Product.findAndCountAll({
            where, limit, offset,
            include: [{ model: ProductImage }, { model: Category }],
            order: [['id', 'ASC']]
        });
        if (products.count > 0) {
            await set(key, { products: products.rows, total: products.count, page, limit }, 900);
        }
        res.status(200).json({
            products: products.rows,
            total: products.count,
            page,
            limit,            
        });
    } catch (error) {
        console.log('Error fetching products: ', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const get = async (req, res) => {
    try {
        const { id } = req.params;
        const key = `products:detail:${id}`;
        const cached = await getCache(key);
        if (cached) {
            return res.json({ ...cached, cached: true });
        }
        const product = await Product.findByPk(id, {
            include: [{ model: ProductImage }, { model: Category }]
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await set(key, product, 900);
        res.status(200).json(product);
    } catch (error) {
        console.log('Error fetching products: ', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const create = async (req, res) => {
    try {
        const body = req.body || {};
        if (!body.name || typeof body.priceCents === 'undefined') {
            return res.status(400).json({ error: 'name and priceCents are required' });
        }

        const product = await Product.create({
            name: body.name,
            description: body.description || null,
            priceCents: body.priceCents,
            stock: Number.isFinite(body.stock) ? Number(body.stock) : 0,
            categoryId: body.categoryId || null,
        });

        await del(`products:detail:${product.id}`);
        await del(`products:list:q=:cat=:page=1:limit=10`);
        await delByPattern('products:list:*');

        if (Array.isArray(body.images) && body.images.length > 0) {
            const imagesToCreate = body.images.map((img) => ({
                productId: product.id,
                s3Key: img.s3Key,
                isPrimary: !!img.isPrimary,
            }));
            await ProductImage.bulkCreate(imagesToCreate);
        }

        const createdProduct = await Product.findByPk(product.id, {
            include: [{ model: ProductImage }, { model: Category }]
        });
        res.status(201).json(createdProduct);
    } catch (error) {
        console.log('Product create error: ', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { list, get, create };