const authMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
      // Usuario autenticado, continuar con la solicitud
      next();
    } else {
      // Usuario no autenticado, redirigir a la página de inicio de sesión
      res.redirect('/');
    }
  };
  
  module.exports = authMiddleware;
  