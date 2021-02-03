pipeline {
  environment {
    registry = "registry.sunedu.gob.pe/pruebas_jenkins"
    registryCredential = 'IDHarbor'
    dockerImage = ''
  }
  agent any
  stages {
    stage('Network create') {
      steps{
        script {
          sh "docker network create ms"
        }
      }
    }

    stage('Building image') {
      steps{
        script {
          sh "docker-compose build"
          sh "docker-compose up -d"
        }
      }
    }
    
    stage('Tag') {
      steps{
          script {
              sh "docker tag gnosis.web registry.sunedu.gob.pe/pruebas_jenkins/gnosis.web"
          }
      }
    }

    stage('Docker Image') {
      steps{
        script {
          dockerImage = registry.sunedu.gob.pe/pruebas_jenkins/gnosis.web
        }
      }
    }
    
    stage('Deploy Image') {
      steps{
        script {
          docker.withRegistry( 'https://registry.sunedu.gob.pe', registryCredential ) {
             dockerImage.push()
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $registry:$BUILD_NUMBER"
      }
    }
  }
}
