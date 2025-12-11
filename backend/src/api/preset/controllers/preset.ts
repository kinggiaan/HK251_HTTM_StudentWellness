import { factories } from '@strapi/strapi';

type NormalizedError = { status: number; data: any };

const handleError = (ctx, error: any) => {
  const normalized: NormalizedError = error?.status
    ? error
    : { status: 500, data: { message: 'Unexpected error', detail: error } };

  ctx.status = normalized.status;
  ctx.body = normalized.data;
};

export default factories.createCoreController('api::preset.preset', ({ strapi }) => ({
  async listMlPresets(ctx) {
    try {
      const data = await strapi.service('api::preset.preset').listMlPresets();
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },

  async createMlPreset(ctx) {
    try {
      const data = await strapi
        .service('api::preset.preset')
        .createMlPreset(ctx.request.body, ctx.request.files);
      ctx.status = 201;
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },

  async updateMlPreset(ctx) {
    const { preset_name: presetName } = ctx.params;
    try {
      const data = await strapi
        .service('api::preset.preset')
        .updateMlPreset(presetName, ctx.request.body);
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },

  async deleteMlPreset(ctx) {
    const { preset_name: presetName } = ctx.params;
    try {
      const data = await strapi.service('api::preset.preset').deleteMlPreset(presetName);
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },

  async retrainMlPreset(ctx) {
    const { preset_name: presetName } = ctx.params;
    try {
      const data = await strapi
        .service('api::preset.preset')
        .retrainMlPreset(presetName);
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },

  async getMlAnalysis(ctx) {
    const { preset_name: presetName } = ctx.params;
    try {
      const data = await strapi.service('api::preset.preset').getMlAnalysis(presetName);
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },

  async getMlPresetConfig(ctx) {
    const { preset_name: presetName } = ctx.params;
    try {
      const data = await strapi
        .service('api::preset.preset')
        .getMlPresetConfig(presetName);
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },

  async getMlPerformance(ctx) {
    const { preset_name: presetName } = ctx.params;
    try {
      const data = await strapi
        .service('api::preset.preset')
        .getMlPerformance(presetName);
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },

  async listMlPlots(ctx) {
    const { preset_name: presetName } = ctx.params;
    try {
      const data = await strapi.service('api::preset.preset').listMlPlots(presetName);
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },

  async getMlState(ctx) {
    const { preset_name: presetName } = ctx.params;
    try {
      const data = await strapi.service('api::preset.preset').getMlState(presetName);
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },

  async getMlMetadata(ctx) {
    const { preset_name: presetName } = ctx.params;
    try {
      const data = await strapi.service('api::preset.preset').getMlMetadata(presetName);
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },

  async deployMlPreset(ctx) {
    const { preset_name: presetName } = ctx.params;
    try {
      const data = await strapi.service('api::preset.preset').deployMlPreset(presetName);
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },

  async mlPredict(ctx) {
    const { preset_name: presetName } = ctx.params;
    try {
      const data = await strapi
        .service('api::preset.preset')
        .mlPredict(presetName, ctx.request.body);
      ctx.body = data;
    } catch (error) {
      handleError(ctx, error);
    }
  },
}));
