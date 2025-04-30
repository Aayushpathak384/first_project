const express  = require('express');
const router = express();

router.get('/products' , function(req ,res){
    res.send("every thing is working");
})


module.exports = router;