export const getPagination = (page, size) => {
  const limit = size ? +size : 12;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

export const getPagingData = (data, page, limit) => {
  const { count: total_items, rows: items } = data;
  const current_page = page ? +page : 0;
  const total_pages = Math.ceil(total_items / limit);
  return { total_items, total_pages, current_page, items };
};
