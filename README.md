# Update Strato-IP

Docker application to sync current public IP with a given Domain hosted by Strato!

## Usage

Provide options via secrets.js

    export default {
       // The domain to update
       domain: ...,
       // The dyndns-password to use
       password: ...
    }
