/**
 Primary file for the api
 */

//Dependenies
const http = require("http"); //http is a built in moudle in node. here we first imported the module and assigned to the variable http
const url = require('url'); //url is built in node library. we can use various functions to work with urls
const StringDecoder = require('string_decoder').StringDecoder;
//we are going to define what this http/server is going to do.

    //creating the server. Server should respond to all requests with a string

        const configure = function(req,res){

            //parse the url and create a parsedUrl Object
            var parsedUrl  = url.parse(req.url,true);

            //get the path
            var path = parsedUrl.pathname; //getting the pathname from the parsedUrl object
            var trimmedPath = path.replace(/^\/+|\/+$/g,''); //trimming the starting foward slashes and ending foward slashes
            
            //get the method
            var method = req.method.toLowerCase();
            
            //get the header as an object
            var headers = req.headers;
            
            //get the query string as an object
            var queryStringObject = parsedUrl.query;
            
            //get the payload
                //creating a instance of the string decoder to decode utf-8
                var decoder = new StringDecoder('utf-8');
                //creating a container to hold the incoming payload
                var buffer = '';

                //creating an event handler to handle the data event fired by the request object whenever payload data comes in.
                req.on('data',function(data){
                    buffer += decoder.write(data);
                });

                //creating an event handler to handle the end event fired by the request object when all the request payload has arrived.
                req.on('end',function(){
                    buffer += decoder.end();



                    //send the response
                    // res.end('Hello World');

                    //choosing the handler according to the request came. it depends on the requested req-path. handler names are sotred in the router object, corresponding to their req-paths.
                    var choosedHandler = typeof(router[trimmedPath]) !== 'undefined'? router[trimmedPath] : handlers.notfound;

                    //constructing the data object to be send to the handler
                    var data = {
                        "trimmedPath" : trimmedPath,
                        "method": method,
                        "queryStringObject" : queryStringObject,
                        "headers" :headers,
                        "payload" : buffer
                    }

                    //calling the choosed handler. arguments are the data objected created and the function defined here
                    choosedHandler(data,function(statusCode,payload){ //this payload is different from the req-payload. this payload is related to the payload object generated inside the respective handler

                        //use the status code calledback by the handler, or default to 200
                            statusCode = typeof(statusCode) == 'number'? statusCode : 200;
                        //use the payload callback by the handler, or default to an empty object
                            payload = typeof(payload) == 'object'? payload : {};

                        //convert the payload to a JSON string before sending the response
                            var payloadString = JSON.stringify(payload); 
                            
                        //returning the response
                        res.setHeader('Content-type','application/json'); // telling that we are sending json type payload by setting the header of the response object.
                        res.writeHead(statusCode);
                        res.end(payloadString);

                        // console.log(`recived request on path :${trimmedPath} | method : ${method} | query string object :`,queryStringObject );
                        console.log(`recived request on path :${trimmedPath} | method : ${method} | res-StatusCode : ${statusCode} | res-payload :` , payloadString );
    
                    })
                    

                })
                


            //log the request path
            // console.log('headers in the request :',headers);
            // console.log(res);
        }
        const server = http.createServer(configure);
        // const server = http.createServer(function(req,res){
        //     res.end('Hello world')
        // });


    //start the server,started sever will be listeining on port 3000
        server.listen(3000,()=>{
            console.log('The server is listening on port 3000');
        })


    //creating the response handlers

    var handlers = {};
    
    //sample route handler
    handlers.sample = function(data,callback){
        
        //call the callback function passed to the handler
        callback(406,{"name":"payload"})

    }

    //default route handler
    handlers.notfound = function(data,callback){

        //call the callback function passed to the handler
        callback(404);

    }

    //creating a response router
    var router = {
        'sample': handlers.sample
    }
