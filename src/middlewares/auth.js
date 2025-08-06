const adminAuth = (req, res, next) => {
  console.log("Middleware for admin route");
  const t = "xyz";
  const isAdminAuthorized = t === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};
const userAuth = (req, res, next) => {
  console.log("Middleware for user route");
  const t = "xyz";
  const isAdminAuthorized = t === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("unauthorized request");
  } else {
    next();
  }
};
module.exports = { adminAuth, userAuth };
