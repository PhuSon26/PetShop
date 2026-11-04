pipeline {
    agent any
    tools {
        jdk 'jdk17'
        maven 'maven3'
    }

    stages{
        stage ('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
    }
}