## ML Roadmap — TODOs

- [ ] Connect AnalyticsDashboard to `/analytics` endpoints for real data
- [x] Introduce async training pipeline with job queue and ML service integration (in_progress)
- [ ] Integrate experiment tracking and model registry (e.g., MLflow) for metrics/artifacts
- [ ] Add dataset schema validation and quality checks before training
- [ ] Implement post-deployment monitoring for data/model drift and performance
- [ ] Finalize storage abstraction with S3/MinIO support and presigned URLs
- [ ] Design shared feature store ensuring train-serve consistency
- [ ] Set up CI/CD pipeline for ML models including automated tests and deployment gates
- [ ] Enhance data privacy controls (pseudonymization, access logs, download restrictions)
- [ ] Upgrade Data Scientist UX with run comparisons, artifact visuals, and analytics via real metrics

Notes:
- Keep this file in sync with the in-app TODOs.
- Prioritize establishing async training + storage abstraction first; they unblock the rest.


