export default (plugin: any) => {
  // Override the /users/me endpoint to include role by default
  plugin.controllers.user.me = async (ctx: any) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }

    const user = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      ctx.state.user.id,
      {
        populate: ['role']
      }
    );

    ctx.body = user;
  };

  return plugin;
};
