import http from 'http';
import dns from 'dns';
import secrets from './secrets.js';

console.log(secrets.secret);

let domainIP = false;
let currentIP = false;

dns.lookup('rpfeifer.net', function(err, ip) {
   console.log("The domain 'rpfeifer.net' is registered as: "+ip);
   domainIP = ip;
   // update the current ip
   updateCurrentIP();
});

function updateCurrentIP() {
   http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
      resp.on('data', function(ip) {
         console.log("My public IP address is: " + ip);
         currentIP = ip;

         if(currentIP != domainIP) {
            // Update the ip
            console.log('Update necessary!');
         } else {
            // ip is correct
            console.log("Current IP is registered!");
            setTimeout(updateCurrentIP, 5 * 60 * 1000);
         }
      });
   });   
}