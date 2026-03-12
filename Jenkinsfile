pipeline {
    agent any

    environment {
        APP_NAME = 'smart-task-manager'
        GROQ_API_KEY = credentials('GROQ_API_KEY')
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'cd backend && npm install'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                sh 'GROQ_API_KEY=$GROQ_API_KEY docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                sh 'GROQ_API_KEY=$GROQ_API_KEY docker compose up -d'
            }
        }

        stage('Run Migrations') {
            steps {
                echo '🗄️ Running database migrations...'
                sh 'docker compose exec -T api npx prisma migrate deploy'
            }
        }

        stage('Health Check') {
            steps {
                echo '🏥 Checking app health...'
                sh 'curl -f http://host.docker.internal:3000/health'
            }
        }

    }

    post {
        success {
            echo '✅ Deployed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}