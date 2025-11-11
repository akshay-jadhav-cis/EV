const Joi = require("joi");

const userValidation = Joi.object({
    name: Joi.string().required(),
    mobilenumber: Joi.string()      
        .pattern(/^[0-9]{10}$/)     
        .required(),
    password: Joi.string().required(),
    location: Joi.string().allow(""),  // optional field
    hasvehicle: Joi.string().valid("yes", "no").required()
});
const batteryValidation=Joi.object({
    batteryname:Joi.string().required(),
    image:Joi.any().optional(),
    voltage:Joi.string().required(),
    batteryType:Joi.string().valid("c-type","normal","roll").default("normal"),
    batteryWeight:Joi.number().required(),
    sized:Joi.string().valid("small","medium","large")
}).unknown(true);
module.exports = { userValidation ,batteryValidation};
