var request = require('request');
request(
    {url : "http://v.youku.com/v_show/id_XMzA2NTg1MzI2NA==.html?spm=a2hww.20027244.m_250166.5~5!2~5~5!2~5~1!2~3~A"},
    function(error,res,body){
         console.log(body); 
});
