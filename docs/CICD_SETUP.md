# CI/CD Pipeline Setup Guide

This document outlines the step-by-step process to set up and maintain the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the SAS Builders Backend application.

## 1. Overview
The pipeline is built using **GitHub Actions**. It automates the deployment process so that whenever code is pushed to the `prod` branch, it is automatically deployed to the AWS EC2 instance.

**Workflow File**: `.github/workflows/deploy.yml`

## 2. Prerequisites
-   **GitHub Repository**:The project must be hosted on GitHub.
-   **AWS EC2 Instance**: A running instance (Ubuntu/Linux) with:
    -   **Docker** and **Docker Compose** installed.
    -   **Git** installed.
    -   SSH access enabled.
-   **Project on Server**: The project repository must be cloned once manually on the server.
    ```bash
    # Example (run on server)
    cd /home/ubuntu
    git clone https://github.com/YourOrg/SAS_Builders_Backend.git
    cd SAS_Builders_Backend
    npm install
    ```

## 3. GitHub Secrets Configuration (CRITICAL)
To enable the GitHub Action to access your server, you must configure **Repository Secrets**.

1.  Go to your GitHub Repository.
2.  Navigate to **Settings** > **Secrets and variables** > **Actions**.
3.  Click **New repository secret**.
4.  Add the following secrets:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `EC2_HOST` | The Public IP address or DNS of your EC2 instance. | `13.56.78.90` |
| `EC2_USERNAME` | The SSH username for your server. | `ubuntu` (for AWS Ubuntu AMIs) |
| `EC2_SSH_KEY` | The private SSH key (`.pem` file content). **Important**: Copy the entire content including `-----BEGIN RSA PRIVATE KEY-----` and `-----END...`. | `-----BEGIN RSA PRIVATE KEY----- ...` |
| `PROJECT_PATH` | The absolute path to your project folder on the server. | `/home/ubuntu/SAS_Builders_Backend` |
| `ENV_FILE` | The full content of your production `.env` file. This file will be created on the server during deployment. | `PORT=3001` <br> `DATABASE_URL=...` |

## 4. Workflow Details
The pipeline consists of two main jobs:

### Job 1: Build & Test
-   **Triggers**: Push to `prod` branch.
-   **Action**: Installs dependencies (`npm ci`) and builds the project (`npm run build`).
-   **Purpose**: Ensures the code is compilation-error-free before attempting deployment.

### Job 2: Deploy to Server
-   **Requirement**: Runs only if "Build & Test" passes.
-   **Action**:
    1.  SSHs into the EC2 instance using the provided secrets.
    2.  Navigates to the `PROJECT_PATH`.
    3.  Pulls the latest code (`git pull origin prod`).
    4.  Updates the `.env` file with the content of `ENV_FILE`.
    5.  Rebuilds and restarts the application using Docker Compose:
        ```bash
        docker compose -f docker-compose.prod.yml up -d --build --remove-orphans
        ```
    6.  Prunes unused Docker images to save disk space.

## 5. How to Deploy
1.  Make your changes in a feature branch or `dev`.
2.  Open a Pull Request (PR) to merge your changes into `prod`.
3.  Once the PR is merged (or you push directly to `prod`), the GitHub Action will trigger automatically.
4.  Monitor the progress in the **Actions** tab of your repository.

## 6. Troubleshooting
-   **SSH Connection Failed**: Verify `EC2_HOST`, `EC2_USERNAME`, and correct `EC2_SSH_KEY`. Ensure the Security Group allows inbound SSH (port 22) from GitHub Actions IPs (or open to 0.0.0.0/0 temporarily).
-   **Permission Denied**: Ensure the `EC2_USERNAME` has ownership of the `PROJECT_PATH` and permissions to run docker commands (add user to docker group: `sudo usermod -aG docker $USER`).
-   **Env File Issues**: Check if `ENV_FILE` secret is correctly formatted.
