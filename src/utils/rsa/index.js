import {RSAPubKey} from '../../config.js';
const RSA = require('./wx_rsa.js')
const log = require('../log.js')

const RSAEncrypt = (unencrypt) => {
	let publicKey = RSAPubKey;
	let encrypt_rsa = RSA.KEYUTIL.getKey(publicKey);
	let encStr = encrypt_rsa.encryptLong(unencrypt);
	let encrypted = RSA.hex2b64(encStr);
	return encrypted;
}

module.exports = {
	RSAEncrypt
};
