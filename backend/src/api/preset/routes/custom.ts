export default {
  routes: [
    {
      method: 'GET',
      path: '/ml/presets',
      handler: 'preset.listMlPresets',
    },
    {
      method: 'POST',
      path: '/ml/presets',
      handler: 'preset.createMlPreset',
    },
    {
      method: 'PUT',
      path: '/ml/presets/:preset_name',
      handler: 'preset.updateMlPreset',
    },
    {
      method: 'DELETE',
      path: '/ml/presets/:preset_name',
      handler: 'preset.deleteMlPreset',
    },
    {
      method: 'POST',
      path: '/ml/presets/:preset_name/retrain',
      handler: 'preset.retrainMlPreset',
    },
    {
      method: 'GET',
      path: '/ml/presets/:preset_name/analysis',
      handler: 'preset.getMlAnalysis',
    },
    {
      method: 'GET',
      path: '/ml/presets/:preset_name/config',
      handler: 'preset.getMlPresetConfig',
    },
    {
      method: 'GET',
      path: '/ml/presets/:preset_name/performance',
      handler: 'preset.getMlPerformance',
    },
    {
      method: 'GET',
      path: '/ml/presets/:preset_name/plots',
      handler: 'preset.listMlPlots',
    },
    {
      method: 'GET',
      path: '/ml/presets/:preset_name/state',
      handler: 'preset.getMlState',
    },
    {
      method: 'POST',
      path: '/ml/presets/:preset_name/predict',
      handler: 'preset.mlPredict',
    },
  ],
};
