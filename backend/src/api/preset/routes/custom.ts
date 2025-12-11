export default {
  routes: [
    {
      method: 'GET',
      path: '/ml/presets',
      handler: 'preset.listMlPresets',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/ml/presets',
      handler: 'preset.createMlPreset',
      config: {
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/ml/presets/:preset_name',
      handler: 'preset.updateMlPreset',
      config: {
        auth: false,
      },
    },
    {
      method: 'DELETE',
      path: '/ml/presets/:preset_name',
      handler: 'preset.deleteMlPreset',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/ml/presets/:preset_name/retrain',
      handler: 'preset.retrainMlPreset',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/ml/presets/:preset_name/analysis',
      handler: 'preset.getMlAnalysis',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/ml/presets/:preset_name/config',
      handler: 'preset.getMlPresetConfig',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/ml/presets/:preset_name/performance',
      handler: 'preset.getMlPerformance',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/ml/presets/:preset_name/plots',
      handler: 'preset.listMlPlots',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/ml/presets/:preset_name/state',
      handler: 'preset.getMlState',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/ml/presets/:preset_name/metadata',
      handler: 'preset.getMlMetadata',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/ml/presets/:preset_name/deploy',
      handler: 'preset.deployMlPreset',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/ml/presets/:preset_name/predict',
      handler: 'preset.mlPredict',
      config: {
        auth: false,
      },
    },
  ],
};
