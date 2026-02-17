# Production Setup Guide (AWS Amazon Linux 2023)

This comprehensive guide covers the A-Z steps to launch your Nest.js application to production on an **AWS EC2 instance running Amazon Linux 2023**.

## 1. Prerequisites
-   **AWS Account**: Access to launch EC2 instances.
-   **GitHub Repository**: Code hosted on GitHub.
-   **SSH Key Pair**: Created in AWS (`.pem` file) for connecting to the server.

---

## 2. Launch & Connect to EC2
1.  **Launch Instance**:
    -   Select **Amazon Linux 2023 AMI** (Kernel 6.1, 64-bit x86).
    -   Instance Type: `t3.small` or `t3.medium` (recommended for Nest.js + Postgres).
    -   **Security Group**: Allow Inbound rules:
        -   `SSH` (Port 22) - usage: My IP (or 0.0.0.0/0 for initial setup).
        -   `HTTP` (Port 80)
        -   `HTTPS` (Port 443)
        -   `Custom TCP` (Port 3001) - if accessing API directly.
2.  **Connect via SSH**:
    ```bash
    chmod 400 your-key.pem
    ssh -i "your-key.pem" ec2-user@<your-ec2-public-ip>
    ```

---

## 3. Server Configuration (The Installation Process)
Once connected to the server, run the following commands to install dependencies.

### 3.1 Update System
```bash
sudo dnf update -y
```

### 3.2 Install Git
```bash
sudo dnf install git -y
```

### 3.3 Install Docker
Amazon Linux 2023 includes Docker in its default repositories.
```bash
sudo dnf install docker -y
sudo service docker start
sudo systemctl enable docker
```

### 3.4 Configure User Permissions
To run Docker commands without `sudo` (required for GitHub Actions automation):
```bash
sudo usermod -aG docker ec2-user
```
> **IMPORTANT**: You must **log out and log back in** for this change to take effect.
> `exit` then `ssh` in again.

### 3.5 Install Docker Compose Plugin
Install the standard Docker Compose plugin manually:
```bash
# Create directory for plugins
mkdir -p ~/.docker/cli-plugins/

# Download Docker Compose
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose

# Make it executable
chmod +x ~/.docker/cli-plugins/docker-compose

# Verify installation
docker compose version
```

---

## 4. Project Setup on Server
Clone your repository and set up the initial directory.

```bash
# Navigate to home directory
cd /home/ec2-user

# Clone the repository
git clone https://github.com/YourOrg/SAS_Builders_Backend.git

# Enter the directory
cd SAS_Builders_Backend

# (Optional) Test build manually to verify setup
# You can create a temporary .env file and run:
# docker compose -f docker-compose.prod.yml build
```

---

## 5. GitHub Actions CI/CD Setup
We will now configure the automated deployment pipeline.

### 5.1 Configure Repository Secrets
Go to your GitHub Repository > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.

Add the following secrets:

| Secret | Value |
| :--- | :--- |
| `EC2_HOST` | Your EC2 Public Iipv4 address (e.g., `12.34.56.78`). |
| `EC2_USERNAME` | `ec2-user` |
| `EC2_SSH_KEY` | Open your `.pem` key file in a text editor. Copy **EVERYTHING** from `-----BEGIN...` to `-----END...`. |
| `PROJECT_PATH` | `/home/ec2-user/SAS_Builders_Backend` |
| `ENV_FILE` | Paste the **entire content** of your local production `.env` file here. |

### 5.2 Configure SSH Keys for Git (CRITICAL)
Since we are using a private repository, we need to authorize the server to pull code via SSH.

1.  **Generate a deploy key on the server**:
    ```bash
    # Run this on your EC2 instance
    ssh-keygen -t ed25519 -C "deploy_key" -f ~/.ssh/deploy_key 
    ```

2.  **Add public key to GitHub**:
    -   Display the key: `cat ~/.ssh/deploy_key.pub`
    -   Copy the output (starts with `ssh-ed25519`).
    -   Go to your **GitHub Repo -> Settings -> Deploy keys -> Add deploy key**.
    -   Title: "Production Server"
    -   Key: Paste the key.
    -   **Allow write access**: Leave UNCHECKED (read-only is safer).

3.  **Configure local SSH to use this key**:
    Create or edit `~/.ssh/config` on the server:
    ```bash
    nano ~/.ssh/config
    ```
    Add the following content:
    ```text
    Host github.com
      IdentityFile ~/.ssh/deploy_key
    ```
    Save and exit (Ctrl+O, Enter, Ctrl+X).

4.  **Test the connection**:
    ```bash
```bash
    chmod 600 ~/.ssh/config
    ssh -T git@github.com
    # Type 'yes' to verify fingerprint.
```
    # You should see: "Hi <user/repo>! You've successfully authenticated..."
    ```

5.  **Switch Remote to SSH (if already cloned via HTTPS)**:
    ```bash
    cd ~/SAS_Builders_Backend
    git remote set-url origin git@github.com:YourOrg/SAS_Builders_Backend.git
    ```

### 5.3 Trigger Deployment
1.  Push your code to the `prod` branch.
2.  Go to the **Actions** tab in GitHub.
3.  Watch the **Deploy to AWS EC2** workflow.
4.  Once green, your server is live!

---

## 6. Verification
Visit your API URL (e.g., `http://<your-ec2-ip>:3001/api/docs` if Swagger is enabled) to verify the deployment.

### Useful Commands (for troubleshooting on server)
-   **View Logs**: `docker compose -f docker-compose.prod.yml logs -f`
-   **Restart manually**: `docker compose -f docker-compose.prod.yml restart`
-   **Check status**: `docker ps`
