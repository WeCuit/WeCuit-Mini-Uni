const RSAEncrypt = (unencrypt) => {
		let publicKey = config.RSAPubKey;
		var encrypt_rsa = new RSA.RSAKey();
		encrypt_rsa = RSA.KEYUTIL.getKey(publicKey);
		let encStr = encrypt_rsa.encryptLong(unencrypt);
		let encrypted = RSA.hex2b64(encStr);
		return encrypted;
	},

modules.exports = {
	RSAEncrypt
}