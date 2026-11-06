pipeline {
    agent any
    tools {
        jdk 'jdk17'
        maven 'maven3'
    }

    environment {
        SCANNER_HOME = tool 'sonnar-scanner'
    }

    stages{
        stage ('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage ('Checkout SCM') {
            steps {
                git 'https://github.com/PhuSon26/PetShop.git'
            }
        }

        stage ('Maven Compile') {
            steps {
                sh 'mvn clean compile'
            }
        }

        stage ('Maven Test') {
            steps {
                sh 'mvn test'
            }
        }

        stage ('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '''
                      $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=PetShop \
                      -Dsonar.java.binaries=. \
                      -Dsonar.projectKey=PetShop
                    '''
                }
            }
        }

        stage ('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token'
                }
            }
        }

        stage ('Build war file'){
            steps{
                sh 'mvn clean install -DskipTests=true'
            }
        }
        
        stage("OWASP Dependency Check"){
            steps{
                dependencyCheck additionalArguments: '--scan ./ --format XML ', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
    }
}