# DEPLOYMENT GUIDE: Prime Pathwy Sovereign OS

## 1. Local-First Deployment (Current Architecture)
The Prime Pathwy Sovereign OS is designed to run locally on a dedicated operational machine (Windows/Linux/macOS) to ensure maximum data sovereignty.

### 1.1 Prerequisites
- **Python 3.10+**
- **Tesseract OCR:** Must be installed natively on the host OS and accessible via the system PATH.
- **Git:** For version control and updates.

### 1.2 Installation Steps
1. Clone the repository: `git clone <repository_url>`
2. Navigate to the directory: `cd PrimePathwyOS`
3. Create a virtual environment: `python -m venv venv`
4. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/macOS: `source venv/bin/activate`
5. Install dependencies: `pip install -r requirements.txt`
6. Initialize the database: `python tools/db_manager.py --init`
7. Start the server: `python -m uvicorn app.backend.main:app --reload`
8. Access the dashboard via a web browser at `http://127.0.0.1:8000`.

## 2. Production SaaS Deployment Topology (Future Roadmap)
When migrating to a multi-tenant SaaS environment, the deployment topology shifts to a highly available, containerized architecture.

### 2.1 Infrastructure Stack
- **Compute:** Kubernetes (EKS/GKE) or AWS ECS.
- **Database:** Managed PostgreSQL (e.g., AWS RDS) with multi-AZ replication.
- **Storage:** Amazon S3 for the Vault, with strict bucket policies and versioning enabled.
- **Caching/Queues:** Redis (ElastiCache) for rate limiting and Celery task queues.

### 2.2 Deployment Phases
1. **Containerization:** Dockerize the FastAPI backend and the OCR worker pipeline into separate images.
2. **CI/CD Pipeline:** Implement GitHub Actions to run tests, build Docker images, and push them to a container registry (e.g., AWS ECR) upon merging to the `main` branch.
3. **Infrastructure as Code (IaC):** Use Terraform or Pulumi to provision all AWS resources, ensuring the infrastructure is reproducible and version-controlled.
4. **Blue/Green Deployments:** Utilize a load balancer (e.g., AWS ALB) to route traffic, enabling zero-downtime deployments by shifting traffic from the old version (Blue) to the new version (Green) only after health checks pass.
