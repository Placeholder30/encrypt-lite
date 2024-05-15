const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const ecV2 = function encrypt(encryptionKey, payload) {
  const text = JSON.stringify(payload);
  const forge = require("node-forge");
  const cipher = forge.cipher.createCipher(
      "3DES-ECB",
      forge.util.createBuffer(encryptionKey)
  );
  cipher.start({iv: ""});
  cipher.update(forge.util.createBuffer(text, "utf-8"));
  cipher.finish();
  const encrypted = cipher.output;
  return forge.util.encode64(encrypted.getBytes());
}


app.post("/v2/encrypt", ( req, res)=>{
  try {
    if(!req.body?.encKey){
      return res.status(400).json({Error: "No encryption key found."})
    }
    const encryptedPayload = ecV2(req.body.encKey, req.body.data)
   
    return res.json({data:{PBFPubKey: req.body.PBFPubKey, client: encryptedPayload, "alg": "3DES-24"}})
  } catch (error) {
    console.log(error)
    res.status(400).json({Error: "Some error occured encrypting your data."})
  }
})

app.listen(3002, () => {
  console.log("app is now listening on port 3002");
});
