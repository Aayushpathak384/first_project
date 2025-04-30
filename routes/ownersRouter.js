const express  = require('express');
const router = express();
const ownerModels = require('../models/owner-models');


if(process.env.NODE_ENV===development)
{
    router.post('/create' ,async function(req ,res){
       let check_owner = await ownerModels.find();
        if(check_owner.length>0)
        {return res.status(502).send("you haven't have permition to create owner ");}
        else
        {
            const {full_name , email , password} = req.body;
            const created_owner = await ownerModels.create({
                full_name,
                email,
                password,
            });
            return res.send(201).send(created_owner);
        }
    })
}

router.get('/owners' , function(req ,res){
    res.send("every thing is working");
})




module.exports = router;