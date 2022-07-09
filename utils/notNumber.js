const notNumber = (id, next) => {
  if (isNaN(Number(id)) || Number(id) < 1) {
    let error = new Error("The id must be a positive integer greater than 0.");
    error.status = 400;
    next(error);
    return true;
  } else {
    return false;
  }
};
module.exports = notNumber;
