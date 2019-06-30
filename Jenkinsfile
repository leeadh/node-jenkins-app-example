pipeline {
    environment{
        registry = "leexha/node_demo"
        registyCredential = 'dockerhub'
        dockerImage = ''
    }

    agent any
    tools{
        nodejs "node"
        
    }
    stages {

        stage('Git clone'){
            steps{
                git branch: 'development', url: 'https://github.com/leeadh/node-jenkins-app-example.git'
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
                    dockerImage = docker.build registry + ":development"
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
