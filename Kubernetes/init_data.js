db = db.getSiblingDB('user')
db.createUser({user:"admin", pwd:"1234",roles:["readWrite","dbAdmin"]})
db.users.insert({name:"Jainish", email:"janish@yahoo.com", occupation:"dentist", username:"janish"})
db.users.insert({name:"Adrian", email:"adrian@gmail.com", occupation:"cook", username:"adr"})
db.users.insert({name:"Jonathan", email:"jonthan@gmail.com", occupation:"officer",username:"john"})
db.users.insert({name:"Jimmy", email:"jimmy@gmail.com", occupation:"teacher", username:"jim"})
db.users.insert({name:"Jackie", email:"jackiegmail.com", occupation:"IT director", username:"jacki"})
db.users.insert({name:"Fiona", email:"fiona@gmail.com", occupation:"Banker", username:"fion"})
