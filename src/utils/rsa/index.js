import {RSAPubKey} from '../../config.js';
const RSA = require('./wx_rsa.js')
const log = require('../log.js')

const RSAEncrypt = (unencrypt) => {
	log.info('开始加密')
	let publicKey = RSAPubKey;
	log.info('publicKey', publicKey)
	log.info('获取Key')
	let encrypt_rsa = RSA.KEYUTIL.getKey(publicKey);
	log.info('开始加密')
	let encStr = encrypt_rsa.encryptLong(unencrypt);
	log.info('转base64')
	let encrypted = RSA.hex2b64(encStr);
	return encrypted;
}

module.exports = {
	RSAEncrypt
};
