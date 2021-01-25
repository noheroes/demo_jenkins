node {
  stage 'Checkout'
  git url: 'https://github.com/noheroes/demo_jenkins'

  stage 'build'
  docker.build('gnosis.web')

  stage 'deploy'
  sh './deploy.sh'
}