var keyPair = generateRSAKeyPair();

// RSA Key Pair Generation
function generateRSAKeyPair() {
    // Generate random prime numbers (p and q)
    var p = generateRandomPrime();
    var q = generateRandomPrime();

    // Compute n (modulus)
    var n = p * q;

    // Compute the totient of n (phi)
    var phi = (p - 1) * (q - 1);

    // Find e (public exponent)
    var e = 2;
    while (e < phi) {
        if (gcd(e, phi) === 1) {
            break;
        }
        e++;
    }

    // Find d (private exponent)
    var d = multiplicativeInverse(e, phi);

    return {
        publicKey: { e, n },
        privateKey: { d, n }
    };
}

// Generate a random prime number
function generateRandomPrime() {
    var isPrime = function (num) {
        if (num <= 1) {
            return false;
        }
        for (var i = 2; i < num; i++) {
            if (num % i === 0) {
                return false;
            }
        }
        return true;
    };

    var randomNum = Math.floor(Math.random() * 100) + 1;
    while (!isPrime(randomNum)) {
        randomNum++;
    }
    return randomNum;
}

// Euclidean algorithm to find the greatest common divisor
function gcd(a, b) {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

// Extended Euclidean algorithm to find the multiplicative inverse
function multiplicativeInverse(e, phi) {
    var d = 0;
    var x1 = 0;
    var x2 = 1;
    var y1 = 1;
    var tempPhi = phi;

    while (e > 0) {
        var temp1 = Math.floor(tempPhi / e);
        var temp2 = tempPhi - temp1 * e;
        tempPhi = e;
        e = temp2;

        var x = x2 - temp1 * x1;
        var y = d - temp1 * y1;

        x2 = x1;
        x1 = x;
        d = y1;
        y1 = y;
    }

    if (tempPhi === 1) {
        return d + phi;
    }

    return null;
}

// Encryption
function encrypt() {
    var message = document.getElementById("message").value;
    var publicKey = keyPair.publicKey;
    var encryptedMessage = '';

    for (var i = 0; i < message.length; i++) {
        var charCode = message.charCodeAt(i);
        var encryptedCharCode = modPow(charCode, publicKey.e, publicKey.n);
        encryptedMessage += encryptedCharCode.toString() + ' ';
    }

    document.getElementById("encrypted").value = encryptedMessage.trim();
}

// Decryption
function decrypt() {
    var encryptedMessage = document.getElementById("encrypted").value;
    var privateKey = keyPair.privateKey;
    var decryptedMessage = '';

    var encryptedCharCodes = encryptedMessage.split(' ');
    for (var i = 0; i < encryptedCharCodes.length; i++) {
        var encryptedCharCode = parseInt(encryptedCharCodes[i]);
        var decryptedCharCode = modPow(encryptedCharCode, privateKey.d, privateKey.n);
        decryptedMessage += String.fromCharCode(decryptedCharCode);
    }

    document.getElementById("decrypted").value = decryptedMessage;
}

// Modular exponentiation
function modPow(base, exponent, modulus) {
    if (modulus === 1) {
        return 0;
    }
    var result = 1;
    base = base % modulus;

    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }

    return result;
}
