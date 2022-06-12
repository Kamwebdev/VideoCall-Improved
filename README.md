# VideoCall
Based on https://github.com/Kamwebdev/VideoCall-Improved

## What changed?
- https support added
- token-based room creation
- whole internet streaming support (over nat)

## Run
Create files with certificates (example.com) in root directory
- sslcert/server.key
- sslcert/server.crt
Execute
`npm server start`

Open https://example.com:8443/create/<token>
