/**
 * Custom extension for users-permissions plugin
 * This extends the /api/users/me endpoint to include the user's role
 */

module.exports = (plugin: any) => {
  // Override the default /api/users/me controller
  const originalMe = plugin.controllers.user.me;
  
  plugin.controllers.user.me = async (ctx: any) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }

    try {
      // Fetch the user with role populated using Strapi's query system
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: ctx.state.user.id },
        populate: ['role']
      });

      if (!user) {
        return ctx.notFound('User not found');
      }

      // Remove sensitive data
      delete user.password;
      delete user.resetPasswordToken;
      delete user.confirmationToken;

      // Ensure role is included in the response
      // If role exists but is just an object with id, fetch the full role details
      if (user.role && typeof user.role === 'object' && user.role.id) {
        const fullRole = await strapi.query('plugin::users-permissions.role').findOne({
          where: { id: user.role.id }
        });
        if (fullRole) {
          user.role = fullRole;
        }
      }

      // Return user with role included
      ctx.body = user;
    } catch (error: any) {
      strapi.log.error('Error in /api/users/me:', error);
      ctx.throw(500, `Internal server error: ${error.message}`);
    }
  };

  return plugin;
};
