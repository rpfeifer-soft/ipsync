import http from 'http';
import dns from 'dns';
import axios from 'axios';
import secrets from './secrets.js';
import moment from 'moment';

let domainIP = false;
let currentIP = false;

function log(msg) {
   console.log(moment().format('DD.MM. HH:mm:ss.SSS')+':', msg);
}

log(`Update '${secrets.domain}' with password '${secrets.password.substr(0, 3)}...'!`);

dns.lookup('rpfeifer.net', function(err, ip) {
   log("The domain 'rpfeifer.net' is registered as: "+ip);
   domainIP = ip;
   // update the current ip
   updateCurrentIP();
});

function syncCurrentIP() {
   axios.get(`https://${secrets.domain}:${secrets.password}@dyndns.strato.com/nic/update?hostname=${secrets.domain}&myip=${currentIP}`)
      .then(function(response) {
         log('Response: '+ JSON.stringify(response.data));
      })
      .catch(function(reason) {
         log('Error: '+reason);
      })
}

function updateCurrentIP(pause) {
   if(pause) {
      let next = moment();
      next.add(+pause, 'm');
      log('Next check at '+ next.format('HH:mm:ss'));
      setTimeout(() => updateCurrentIP(), pause * 60000);
      return;
   }
   http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
      resp.on('data', function(ip) {
         log("My public IP address is: " + ip);
         currentIP = ip;

         if(currentIP != domainIP) {
            // Update the ip
            log('Update necessary!');
            syncCurrentIP();
            updateCurrentIP(120);
         } else {
            // ip is correct
            log("Current IP is registered!");
            updateCurrentIP(30);
         }
      });
   });   
}