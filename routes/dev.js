module.exports = function(router, route) {
  router.get(route, function(request, response){
    var html = global.app.renderer.render('dev', global.app);
    response.end(html);
  });
};
