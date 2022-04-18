
module.exports = function (req, res, next) { 
  // 401 Unauthorized
  // 403 Forbidden 
  // console.log(req.user.role)
  const Admin = 'Admin'
  if (Admin != req.user.role) return res.json({ success: false, message: 'Access denied. you are not allowed' });
  
  next();
}