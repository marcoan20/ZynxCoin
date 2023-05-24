import bcrypt from 'bcrypt';

const teste = "12023-05-24T00:49:35.769Z10000null11111111111$2b$10$MEJ7hVxMpxH.VryfQL/rGeYbUp3VFcYzNBLCrlhPiWXCOmMynwHFm"
const testeH = "$2b$10$3iiRGRP8.GwS5k5RyWda8.Mh9nPVIgZUO1sMw6qcEiPdwzA1Z9CIS"
console.log(bcrypt.compareSync(teste, testeH));

