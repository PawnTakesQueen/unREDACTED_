# v0iD Protocol

## Sending Messages

### Syntax:

```
/SUBJECT[string]/MESSAGE[long string]/ATTACHMENT[byte string]/PASSWORD[string]
```

(All forward slashes and backslashes in content are sanitized with a backslash in front of it.)

Example:

```
/SUBJECTTest Subject/MESSAGEThis is just a test message.\n\nIt isn't important.\n\nHere is a forward slash test\/.  This is how it works./ATTACHMENT\x00\x01\x02\x03\x04\x05/PASSWORD9us17V1Gi6WD4r9J845W
```

This long string will then be encrypted using GnuPG with a 4096 bit public key.  Two public keys are required for **v0iD** and the public key used depends on the **Security Level** used.  If the Security is set to High, then the GnuPG public key on the hosting server will be used.  If the Security is set to Sensitive, then the GnuPG public key of an airgapped computer will be used.

Before sending the message, a message ID will be produced by the server for the user to keep.  This message ID will be a randomly generated 64 character string created on the server's side for the user to use to find the reply to the message later on.

## Reading Reply

The message ID provided before sending the message will be used to find the reply.  All replies will be encrypted with AES-256 CBC encryption and will use the password from the message as a base for the encryption key.

### Syntax:

```
[bcrypt salt][Initialization Vector][AES-256 CBC encrypted cyphertext][64 byte SHA512 hash of plaintext]
```
