import { factories } from '@strapi/strapi';
import axios, { AxiosError, AxiosInstance } from 'axios';
import FormData from 'form-data';
import fs from 'fs';

type FilesMap = Record<string, any>;
type FieldsMap = Record<string, any>;

const ML_BASE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const REQUEST_TIMEOUT_MS = 30_000;

const getClient = (): AxiosInstance =>
  axios.create({
    baseURL: ML_BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
  });

const normalizeAxiosError = (
  error: AxiosError | Error
): { status: number; data: any } => {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status ?? 500,
      data: error.response?.data ?? { message: error.message },
    };
  }

  return { status: 500, data: { message: error.message } };
};

const appendFormFields = (formData: FormData, fields?: FieldsMap) => {
  if (!fields) return;

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
      return;
    }

    if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value);
  });
};

const appendFiles = (formData: FormData, files?: FilesMap) => {
  if (!files) return;

  const entries = Object.entries(files);
  if (!entries.length) return;

  entries.forEach(([key, rawFile]) => {
    if (!rawFile) return;

    const fileArray = Array.isArray(rawFile) ? rawFile : [rawFile];

    fileArray.forEach((file) => {
      const filepath = file.filepath || file.path;
      if (!filepath) return;

      const stream = fs.createReadStream(filepath);
      formData.append(key, stream, {
        filename: file.originalFilename || file.name || file.filename || 'file',
        contentType: file.mimetype || file.type,
      });
    });
  });
};

export default factories.createCoreService('api::preset.preset', ({strapi}) => {
  const client = getClient();

  return {
    async listMlPresets() {
      try {
        const res = await client.get('/presets');
        return res.data;
      } catch (error) {
        throw normalizeAxiosError(error as AxiosError | Error);
      }
    },

    async createMlPreset(fields?: FieldsMap, files?: FilesMap) {
      const formData = new FormData();
      appendFormFields(formData, fields);
      appendFiles(formData, files);

      try {
        const res = await client.post('/presets', formData, {
          headers: formData.getHeaders(),
        });
        return res.data;
      } catch (error) {
        throw normalizeAxiosError(error as AxiosError | Error);
      }
    },

    async updateMlPreset(presetName: string, config: Record<string, any>) {
      try {
        const res = await client.put(`/presets/${presetName}`, config);
        return res.data;
      } catch (error) {
        throw normalizeAxiosError(error as AxiosError | Error);
      }
    },

    async deleteMlPreset(presetName: string) {
      try {
        const res = await client.delete(`/presets/${presetName}`);
        return res.data;
      } catch (error) {
        throw normalizeAxiosError(error as AxiosError | Error);
      }
    },

    async retrainMlPreset(presetName: string) {
      try {
        const res = await client.post(`/presets/${presetName}/retrain`);
        return res.data;
      } catch (error) {
        throw normalizeAxiosError(error as AxiosError | Error);
      }
    },

    async getMlAnalysis(presetName: string) {
      try {
        const res = await client.get(`/presets/${presetName}/analysis`);
        return res.data;
      } catch (error) {
        throw normalizeAxiosError(error as AxiosError | Error);
      }
    },

    async getMlPresetConfig(presetName: string) {
      try {
        const res = await client.get(`/presets/${presetName}/config`);
        return res.data;
      } catch (error) {
        throw normalizeAxiosError(error as AxiosError | Error);
      }
    },

    async getMlPerformance(presetName: string) {
      try {
        const res = await client.get(`/presets/${presetName}/performance`);
        return res.data;
      } catch (error) {
        throw normalizeAxiosError(error as AxiosError | Error);
      }
    },

    async listMlPlots(presetName: string) {
      try {
        const res = await client.get(`/presets/${presetName}/plots`);
        return res.data;
      } catch (error) {
        throw normalizeAxiosError(error as AxiosError | Error);
      }
    },

    async getMlState(presetName: string) {
      try {
        const res = await client.get(`/presets/${presetName}/state`);
        return res.data;
      } catch (error) {
        throw normalizeAxiosError(error as AxiosError | Error);
      }
    },

    async mlPredict(presetName: string, features: Record<string, any>) {
      try {
        const res = await client.post(
          `/presets/${presetName}/predict`,
          features
        );
        return res.data;
      } catch (error) {
        throw normalizeAxiosError(error as AxiosError | Error);
      }
    },
  };
});
