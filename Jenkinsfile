pipeline {
    environment{
        registry = "leexha/node_demo"
        registyCredential = 'dockerhub'
        dockerImage = ''
    }

    agent any
    tools{
        nodejs "node"
        docker "docker"
        
    }
    stages {

        stage('Git clone'){
            steps{
                git 'https://github.com/leeadh/node-jenkins-app-example.git'
            }
            
        }
        stage('Installing Node') { 
            steps {
                sh 'npm install' 
            }
        }

        stage ('Conducting Unit test'){
            steps{
                sh 'npm test'
            }

        }

        stage ('Building image'){
            steps{
                script{
                    dockerImage = docker.build registry + ":$BUILD_NUMBER"
                }
            }

        }


        stage ('Pushing to Docker Hub'){
            steps{
                script{
                    docker.withRegistry('',registyCredential){
                        dockerImage.push()
                    }
                }
            }

        }

    }
}
