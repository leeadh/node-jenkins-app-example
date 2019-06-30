# Cloud Automation Service with Jenkins integration # 

This is a sample demonstration to integrate Jenkins with Cloud Automation Service (CAS) onto multiple clouds (AWS, GCP, Azure, Vpshere). Jenkins will be our CI pipeline tool which will help to build our application. For the scope of the example, we are going to simulate a code integration, deployment and testing from our development branch using  CAS with Jenkins and Dockers. 

A further tutorial will be coming to do blue/green deployments, triggering the workflow to merge side branches into main branches. 

**Note: this assumes u have some basic knowledge of how to setup account in CAS and this tutorial will be focused solely on the integration point with Jenkins and setting it up for a code review before deploying in it our targeted infrastructure.**

# Application Architecture Components # 

1) Our Node JS application (employee application) which will act as our application and web server. It is running on Express JS framework with EJS as our templating engine
2) The Node JS application is communicating with several microservices API (CRUD) which are implemented in our app.js file
3) The backend is running MongoDB. The initiation of the mongoDB will be done via docker compose. 
4) Our node JS application and mongoDB will be containersised and deployed onto IaaS VMs. The building of the application, installing the necessary application dependencies, performing unit testing on the code and commiting the code into docker hub will be done via Jenkins. This will be our Continuous Integration (CI) portion
5) For our Continuous Deployment (CD), we will be using Cloud Automation Service to implement the workflow and deploy the containerised workloads onto our cloud infrastructure

An overview of the architecture can be view in the picture below

![alt text](https://user-images.githubusercontent.com/15122358/58031629-5af4b780-7b53-11e9-9caf-370324384da9.png)

# Setting up your Jenkins environment # 
You can set up your jenkins in any environment you like. For me, I ran my jenkins on an EC2 on AWS using dockers with persistent storage. You can refer more to here https://hub.docker.com/_/jenkins/

```
docker run \
  -it \
  -u root \
  -p 8080:8080 \
  -v /home/ec2-user/jenkins-data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$HOME":/home \
  jenkins/jenkins:lts
```

For creating the Jenkins pipeline file, you can refer to the file Jenkinsfile in the dev branch. 

![alt text](https://user-images.githubusercontent.com/15122358/58033644-6ba72c80-7b57-11e9-881b-bc21bd96dea9.png)


# Setting up your CAS environment for infrastructure deployment # 


We are going to create an infrastructure blueprint as shown in the image below. For this, we are going to use cloud-agnostic elements so that we can deploy onto any environment we choose. What is happening here is as follow:

1) We are provisioning an IaaS instance where we will deploy our web application on a public network. The web application will pull from docker hub our latest container which we have built in our Jenkins step
2) We will be provisioning a second IaaS instance on a private network which we deploy our MongoDB docker image with a persistent storage folder and with data already inserted into the database. The schema of MongoDB and the provisoning of data into our database can be found in mongo-init.js (under mongo_db folder). 

```
db.users.insert({name:"Jainish", email:"janish@yahoo.com", occupation:"dentist", username:"janish"})
```

3) The application container will communicate to the MongoDB container using the below where the mongoip is the private ip of the database. 

```
docker run -d   -e MONGODB_URL=mongodb://$mongoip:27017/user -p 4000:4000 ${input.input_docker_repo}:${input.input_docker_tag}
```

A sample screenshot of the blueprint is as below and you can drag and drop the cloud-agnostic elements inside our blueprint. 

![alt text](https://user-images.githubusercontent.com/15122358/58032944-27fff300-7b56-11e9-8b72-cfc6831e5ac0.png)

**Note: You can choose to drag and drop the elements inside the blueprint OR you can refer to the blueprint file below which you can import in when you create a new blueprint project. 

The full blueprint is as shown below which you can import as a yaml file. 

```
formatVersion: 1
inputs:
  input_docker_repo:
    type: string
    enum:
      - leexha/node_demo
  input_docker_tag:
    type: string
  input_env_type:
    type: string
    enum:
      - development
      - master
resources:
  private:
    type: Cloud.Network
    properties:
      name: private_network
      networkType: existing
      constraints:
        - tag: 'env:adr_aws_private_sub'
  public:
    type: Cloud.Network
    properties:
      name: public_network
      networkType: public
      constraints:
        - tag: 'env:adr_aws_pub_sub'
  application:
    type: Cloud.Machine
    dependsOn:
      - database
    properties:
      image: linux_adr
      flavor: micro_adr
      count: 1
      cloudConfig: |
        users:
          - name: ubuntu
            ssh-authorized-keys:
              - 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDbuzFI5ZjJyOraeaUuCgemMqQrKAZqJlpdIkYaJ0DgrGST0FEw+IUr2krpzh5JhN917yn1eSuhFa6boFaDJan/nVvCNohBcz8S1kYgeqpS1LZ5mJfYrsAGUOpl95x9DqI9WNA1seW3DiRUyY8Q1Q67vwrGsge3G1rzwjAv5NoDay2XGDZagNgEYc+N6i8KkgqItbkIiY9/HMI86LkVCSAUNVEbP0LjFOaR60Uy4xdyVjy44y2e5GbqvvirmO0iVT5Sf9ZjaYRCKopqo7jgdDnAqqns5TrlfXDrnpsr16DKliVVDelHVgeoVTL/h2F/GP47ahMvsQXhfE+BeZC0SFPR'
            sudo: ['ALL=(ALL) NOPASSWD:ALL']
            groups: sudo
            shell: /bin/bash

            
        apt:
          sources:
            docker:
              source: "deb [arch=amd64] https://download.docker.com/linux/ubuntu xenial stable"
              keyid: "9DC858229FC7DD38854AE2D88D81803C0EBFCD88" 
        packages: ['docker-ce']
        package_update: true

        runcmd:
          - sudo chmod 666 /var/run/docker.sock
          - sudo groupadd docker
          - sudo usermod -aG docker $USER
          - sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
          - sudo chmod +x /usr/local/bin/docker-compose
          - sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
          - mongoip=${resource.database.networks[0].address}
          - docker run -d   -e MONGODB_URL=mongodb://$mongoip:27017/user -p 4000:4000 ${input.input_docker_repo}:${input.input_docker_tag}  
          
      constraints:
        - tag: 'env:adr_aws_env'
      networks:
        - name: '${resource.public.name}'
        - name: '${resource.private.name}'
  database:
    type: Cloud.Machine
    properties:
      image: linux_adr
      flavor: micro_adr
      count: 1
      cloudConfig: |

        users:
          - name: ubuntu
            ssh-authorized-keys:
              - 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDbuzFI5ZjJyOraeaUuCgemMqQrKAZqJlpdIkYaJ0DgrGST0FEw+IUr2krpzh5JhN917yn1eSuhFa6boFaDJan/nVvCNohBcz8S1kYgeqpS1LZ5mJfYrsAGUOpl95x9DqI9WNA1seW3DiRUyY8Q1Q67vwrGsge3G1rzwjAv5NoDay2XGDZagNgEYc+N6i8KkgqItbkIiY9/HMI86LkVCSAUNVEbP0LjFOaR60Uy4xdyVjy44y2e5GbqvvirmO0iVT5Sf9ZjaYRCKopqo7jgdDnAqqns5TrlfXDrnpsr16DKliVVDelHVgeoVTL/h2F/GP47ahMvsQXhfE+BeZC0SFPR'
            sudo: ['ALL=(ALL) NOPASSWD:ALL']
            groups: sudo
            shell: /bin/bash

            
        apt:
          sources:
            docker:
              source: "deb [arch=amd64] https://download.docker.com/linux/ubuntu xenial stable"
              keyid: "9DC858229FC7DD38854AE2D88D81803C0EBFCD88" 
        packages: ['docker-ce']
        package_update: true


        runcmd:
          - sudo chmod 666 /var/run/docker.sock
          - sudo groupadd docker
          - sudo usermod -aG docker $USER
          - sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
          - sudo chmod +x /usr/local/bin/docker-compose
          - sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
          - mkdir /home/git_files
          - cd /home/git_files
          - git clone -b ${input.input_env_type} https://github.com/leeadh/node-jenkins-app-example.git
          - cd node-jenkins-app-example/mongo_db
          - docker-compose up --build -d mongodb
          - echo 'Cloud-init is done!' >> /tmp/finished.txt
            
      constraints:
        - tag: 'env:adr_aws_env'
      networks:
        - name: '${resource.private.name}'
```

# Setting up your CAS environment for workflow deployment # 

You would now create the workflow for the CAS deployment as noted below. What is happening here is as follows:

1) It would send an approving email to ask the requestor to approve the code change and allow jenkins to trigger the code testing and perform containerisation of our application
2) Only when approved, Jenkins pipeline will then be triggered to do the code test and containerisation
3) Once step 2 is done,  it will build out the infrastructure blueprint(see above Setting up your CAS environment for infrastructure deployment) and deploy the containerised application. 

![alt text](https://user-images.githubusercontent.com/15122358/58033783-b032c800-7b57-11e9-8224-a131c9217bbd.png)

I have attached the code for the CAS deployment workflow as below and you can import this worklow into your project. 

**There will be changes to this workflow deployment in the future.
```
---
project: test_project_adr
kind: PIPELINE
name: adr_devops_demo
enabled: true
concurrency: 10
ciWorkspace:
  endpoint: ''
  image: ''
  registry: ''
  path: ''
  cache:
  - ''
stageOrder:
- Development Branch
stages:
  Development Branch:
    taskOrder:
    - Approve application code
    - Compile application
    - Deploy Application
    tasks:
      Approve application code:
        type: UserOperation
        endpoints:
          emailServer: Codestream-Default-Email
        input:
          summary: Jenkins Run for QA approval
          pipelineName: ${name}
          expirationInDays: 3
          approverGroups: [
            ]
          approvers: [
            xxx@gmail.com]
          description: Dear Approver, please approve the Jenkins Run for QA testing
          sendemail: true
      Compile application:
        type: Jenkins
        endpoints:
          jenkinsServer: Adr_jenkins
        input:
          job: node-demo
          parameters: {
            }
      Deploy Application:
        type: Blueprint
        input:
          blueprint: test_project_adr
          action: CreateDeployment
          deploymentName: ''
          version: v13
          parameters: {
            }
notifications:
  email:
  - stage: Development Branch
    subject: Completion of compliation of Jenkins QA Test
    event: SUCCESS
    task: Compile application
    endpoint: Codestream-Default-Email
    body: Jenkins job for QA has been completed successfully
    to:
    - xxx@gmail.com
```





#  To run a set up of mongoDB instantly # 
docker-compose up --build -d mongodb

#  To run the mongoDB after you push latest # 
docker build -t got:v5 . &&  docker run -d --network=mongo_db_default  --link=mongodb:mongodb -p 4000:4000 got:v5

**Note: this assumes u have some basic knowledge of how to setup account in CAS and this tutorial will be focused solely on the integration point with Jenkins and setting it up for a code review before deploying in it our targeted infrastructure.**

# Application Architecture Components # 

# To run the docker app and connection to mongo DB container# 
docker run -d --network=mongo_db_default  --link=mongodb:mongodb -e "MONGODB_URL=mongodb://mongodb/user" -p 4000:4000 e922a127d049
docker run -d --network=mongo_db_default  --link=mongodb:mongodb -e MONGODB_URL='mongodb://xxxx:27017/user' -p 4000:4000 e922a127d049 
docker run -d   -e MONGODB_URL='mongodb://ccc:27017/user' -p 4000:4000 leexha/node_demo:21 


# To run the application as is using node js # 
docker compose mongodb first 
MONGODB_URL='mongodb://localhost:27017/user' node app.js
