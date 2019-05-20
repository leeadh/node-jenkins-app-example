This is a sample demonstration to integrate Jenkins with Cloud Automation Service onto multiple clouds (AWS, GCP, Azure, Vpshere). Jenkins will be our CI pipeline tool which will help to build our application. For the scope of the example, we will be only using the development branch. 

A further tutorial will be coming  to do blue/green deployments. 

# Application Architecture Components # 

1) Our node JS application (employee application) which will act as our application and web server. It is running on Express JS framework with EJS as our templating engine
2) The node JS application is communicating with several microservices API (CRUD) which are implemented in our app.js file
3) The backend is running mongoDB. The initiation of the mongoDB will be done via docker compose. 
4) Our node JS application and mongoDB will be containersised and deployed onto IaaS VMs. The building of the application, installing the necessary application dependencies, performing unit testing on the code and commiting the code into docker hub will be done via Jenkins. This will be our Continuous Integration (CI) portion
5) For our Continuous Deployment (CD), we will be using Cloud Automation Service to implement the workflor and deploy the containerised workloads onto our cloud infrastructure

An overview of the architecture can be view in the picture below


