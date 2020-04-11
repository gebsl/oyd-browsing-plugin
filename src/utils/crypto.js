import sodium_api from 'libsodium-wrappers';

function hexStringToByte(str) {
    if (!str) {
        return new Uint8Array();
    }
    var a = [];
    for (var i = 0, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16));
    }
    return new Uint8Array(a);
}

export function encrypt(plainText, pubkey) {
    const nonce = Buffer.from(sodium_api.randombytes_buf(sodium_api.crypto_box_NONCEBYTES));
    const cipherMsg = sodium_api.crypto_box_easy(
        Buffer.from(plainText),
        nonce,
        Buffer.from(hexStringToByte(pubkey)),
        Buffer.from(hexStringToByte('bdf49c3c3882102fc017ffb661108c63a836d065888a4093994398cc55c2ea2f')));

    return {
        value: Buffer.from(cipherMsg).toString('hex'),
        nonce: nonce.toString('hex'),
        version: "0.4"
    };
}