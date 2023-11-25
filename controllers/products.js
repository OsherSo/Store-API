const Product = require('../models/product');

const getAllProducts = async (req, res) => {
  const queryObj = {};
  const { featured, company, name, sort, select, numericFilter } = req.query;

  if (featured === 'true' || featured === 'false')
    queryObj.featured = featured === 'true';

  if (company) queryObj.company = company;

  if (name) queryObj.name = { $regex: name, $options: 'i' };

  if (numericFilter) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    const filters = numericFilter.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ['price', 'rating'];
    filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field))
        queryObj[field] = { [operator]: Number(value) };
    });
  }

  let productsQuery = Product.find(queryObj);

  if (sort) productsQuery.sort(sort.split(',').join(' '));
  else productsQuery.sort('price');

  if (select) productsQuery.select(select.split(',').join(' '));

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  productsQuery.skip(skip).limit(limit);

  const products = await productsQuery;
  res.status(200).json({
    count: products.length,
    products,
  });
};

module.exports = {
  getAllProducts,
};
