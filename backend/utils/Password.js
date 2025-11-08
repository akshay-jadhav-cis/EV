const bcrypt=require("bcrypt");
async function hashPassword(plainpassword){
    return await bcrypt.hash(plainpassword,10);
}
async function hashCompare(plainpassword,hashPassword){
   return await  bcrypt.compare(plainpassword,hashPassword);
}
module.exports={hashPassword,hashCompare};