"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = void 0;
const generateVerificationCode = (length = 6) => {
    const characters = "6e4c18076571c13b2871323fd6578f50ff036e508cdc552a1d224e19e379a6ec";
    let verificationCode = ""; // 6 digit store in there
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        verificationCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return verificationCode;
};
exports.generateVerificationCode = generateVerificationCode;
