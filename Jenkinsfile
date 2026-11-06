
pipeline {
    agent any

    tools {
        jdk 'jdk17'
        maven 'maven3'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout SCM') {
            steps {
                git branch: 'master',
                    credentialsId: 'github-token',
                    url: 'https://github.com/PhuSon26/PetShop.git'
            }
        }

        stage('Maven Compile') {
            steps {
                dir('backend') {
                    sh 'mvn clean compile'
                }
            }
        }

        stage('Maven Test') {
            steps {
                dir('backend') {
                    sh 'mvn test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('sonar-server') {
                        sh '''
                            mvn org.sonarsource.scanner.maven:sonar-maven-plugin:5.2.0.4988:sonar \
                                -Dsonar.projectKey=petshop \
                                -Dsonar.projectName=petshop
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate(
                        abortPipeline: false,
                        credentialsId: 'sonar-token'
                    )
                }
            }
        }

        stage('Build JAR File') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests=true'
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dir('backend') {
                    dependencyCheck(
                        additionalArguments: '--scan ./ --format XML',
                        odcInstallation: 'DP-Check'
                    )

                    dependencyCheckPublisher(
                        pattern: '**/dependency-check-report.xml'
                    )
                }
            }
        }

        stage('Docker Build and Push') {
            steps {
                dir('Ansible') {
                    withCredentials([
                        string(
                            credentialsId: 'dockerhub-password',
                            variable: 'DOCKERHUB_PASSWORD'
                        )
                    ]) {
                        ansiblePlaybook(
                            installation: 'ansible',
                            inventory: '/etc/ansible/hosts',
                            playbook: 'docker-playbook.yaml',
                            disableHostKeyChecking: true
                        )
                    }
                }
            }
        }
    }
}
