
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
                        additionalArguments: '''
                            --scan .
                            --format XML
                            --out .
                            --project PetShop
                        ''',
                        odcInstallation: 'DP-Check'
                    )

                    dependencyCheckPublisher(
                        pattern: 'dependency-check-report.xml'
                    )
                }
            }
        }

        stage('Docker Build and Push') {
            steps {
                dir('ansible') {
                    withCredentials([
                        string(credentialsId: 'dockerhub-password', variable: 'DOCKERHUB_PASSWORD'),
                        string(credentialsId: 'petshop-db-password', variable: 'DB_PASSWORD'),
                        string(credentialsId: 'petshop-mysql-root-password', variable: 'MYSQL_ROOT_PASSWORD')
                    ]) {
                        ansiblePlaybook(
                            installation: 'ansible',
                            inventory: '/etc/ansible/hosts',
                            playbook: 'docker-playbook.yaml',
                            disableHostKeyChecking: true,
                            extraVars: [
                                dockerhub_password: [value: "${DOCKERHUB_PASSWORD}", hidden: true],
                                db_password: [value: "${DB_PASSWORD}", hidden: true],
                                mysql_root_password: [value: "${MYSQL_ROOT_PASSWORD}", hidden: true],
                                image_tag: "${env.BUILD_NUMBER}",
                                workspace: "${env.WORKSPACE}"
                            ]
                        )
                    }
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh """
                    trivy image --severity HIGH,CRITICAL --exit-code 0 --no-progress \
                        phuson0206/petshop-backend:${env.BUILD_NUMBER}
                    trivy image --severity HIGH,CRITICAL --exit-code 0 --no-progress \
                        phuson0206/petshop-frontend:${env.BUILD_NUMBER}
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                dir('ansible') {
                    withCredentials([
                        string(credentialsId: 'petshop-db-password', variable: 'DB_PASSWORD'),
                        string(credentialsId: 'petshop-mysql-root-password', variable: 'MYSQL_ROOT_PASSWORD')
                    ]) {
                        ansiblePlaybook(
                            credentialsId: 'ssh',
                            installation: 'ansible',
                            inventory: '/etc/ansible/hosts',
                            playbook: 'kube.yaml',
                            disableHostKeyChecking: true,
                            extraVars: [
                                db_password: [value: "${DB_PASSWORD}", hidden: true],
                                mysql_root_password: [value: "${MYSQL_ROOT_PASSWORD}", hidden: true],
                                image_tag: "${env.BUILD_NUMBER}"
                            ]
                        )
                    }
                }
            }
        }
    }

    post {
        success { echo 'PetShop deployed: http://<k8s-worker-ip>:30699' }
        failure { echo 'Pipeline failed - check the stage logs above.' }
    }
}
