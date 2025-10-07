/**
 * Paginate a Mongoose model query
 * @param {Object} model - Mongoose model
 * @param {Object} query - Filter query
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @param {Object} sort - Sort options (optional)
 * @returns {Object} { totalItems, totalPages, currentPage, itemsPerPage, data }
 */
const paginate = async (model, query = {}, page = 1, limit = 10, sort = {}) => {
  page = parseInt(page);
  limit = parseInt(limit);

  const skip = (page - 1) * limit;

  const [totalItems, data] = await Promise.all([
    model.countDocuments(query),
    model.find(query).sort(sort).skip(skip).limit(limit),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems, // Total items in DB
    totalPages, // Total pages
    currentPage: page, // Current page
    itemsPerPage: limit, // Limit
    data, // Current page data
  };
};

module.exports = paginate;
