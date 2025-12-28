// https://github.com/kchapelier/qoijs

class CodecQOIImagenator {
    static libCode = `var QOI = {
    decode: function(AB, BO, BL, OC){// Hand compressed from https://github.com/kchapelier/qoijs by VExcess
        if(!BO){BO=0;}if(!BL){BL=AB.byteLength-BO;}var E=println,EM="Invalid QOI File",US="return new Uint8Array(",F=sq.constructor,A=F("a","b","c",US+"a,b,c)")(AB,BO,BL),M1=A[0],M2=A[1],M3=A[2],M4=A[3],w=((A[4]<<24)|(A[5]<<16)|(A[6]<<8)|A[7])>>>0,h=((A[8]<<24)|(A[9]<<16)|(A[10]<<8)|A[11])>>>0,c=A[12],CS=A[13];if(!OC){OC=c;}if(M1!==113||M2!==111||M3!==105||M4!==102||c<3||c>4||CS>1||OC<3||OC>4){E(EM);}var PL=w*h*OC,R=F("a",US+"a)")(PL),P=14,I=F(US+"64*4)")(),IP=0,r=0,g=0,b=0,a=255,CL=BL-8,ru=0,PP=0,N0=254,N1=255,N2=192,N3=0,N4=64,N5=3,N6=128,N7=63,N8=15,x=256;for(;PP<PL&&P<BL-4;PP +=OC){if(ru > 0){ru--;}else if(P<CL){var k=A[P++];if(k===N0){r=A[P++];g=A[P++];b=A[P++];}else if(k===N1){r=A[P++];g=A[P++];b=A[P++];a=A[P++];}else if((k&N2)===N3){r=I[k*4];g=I[k*4+1];b=I[k*4+2];a=I[k*4+3];}else if((k&N2)===N4){r+=((k>>4)&N5)-2;g+=((k>>2)&N5)-2;b+=(k&N5)-2;r=(r+x)%x;g=(g+x)%x;b=(b+x)%x;}else if((k&N2)===N6){var y=A[P++],u=(k&N7)-32,i=u+((y>>4)&N8)-8,o=u+(y&N8)-8;r=(r+i+x)%x;g=(g+u+x)%x;b=(b+o+x)%x;}else if((k&N2)===N2){ru=k&N7;}IP=((r*3+g*5+b*7+a*11)%64)*4;I[IP]=r;I[IP+1]=g;I[IP+2]=b;I[IP+3]=a;}if(OC===4){R[PP]=r;R[PP+1]=g;R[PP+2]=b;R[PP+3]=a;}else{R[PP]=r;R[PP+1]=g;R[PP+2]=b;}}if(PP<PL){E(EM);}return{width:w,height:h,colorspace:CS,channels:OC,data:R};
    },
    base64ToPImage: function(z){var F=sq.constructor,i;z=z.split(",");z=z[z.length-1];var S=F("b64","return atob(b64)")(z),l=S.length,b=F("len","return new Uint8Array(len)")(l);for(i=0;i<l;i++){b[i]=S.charCodeAt(i);}var I=QOI.decode(b.buffer,null,null,4),PI=get(0,0,I.width,I.height);if(I&&I.data){for(i=0,l=I.data.length;i<l;i++){PI.imageData.data[i]=I.data[i];}PI.set();}return PI;}
};`;

    static encodedCached = null;

    static async encode(settings) {
        let colorData = settings.imageData.data;

        const width = settings.imageWidth;
        const height = settings.imageHeight;
        let channels = 4;
        const colorspace = 0; // sRGB

        // remove alpha is not used
        let alphaUsed = false;
        for (let i = 0; i < colorData.length; i += 4) {
            if (colorData[i+3] < 255) {
                alphaUsed = true;
            }
        }
        if (!alphaUsed) {
            colorData = new Uint8ClampedArray(width * height * 3);
            channels = 3;
            
            let pixels = settings.imageData.data;
            let idx = 0;
            for (let i = 0; i < pixels.length; i += 4) {
                colorData[idx++] = pixels[i];
                colorData[idx++] = pixels[i+1];
                colorData[idx++] = pixels[i+2];
            }
        }

        let red = 0;
        let green = 0;
        let blue = 0;
        let alpha = 255;
        let prevRed = red;
        let prevGreen = green;
        let prevBlue = blue;
        let prevAlpha = alpha;

        let run = 0;
        let p = 0;
        const pixelLength = width * height * channels;
        const pixelEnd = pixelLength - channels;

        if (width < 0 || width >= 4294967296) {
            throw new Error('QOI.encode: Invalid description.width');
        }

        if (height < 0 || height >= 4294967296) {
            throw new Error('QOI.encode: Invalid description.height');
        }

        if (colorData.constructor.name !== 'Uint8Array' && colorData.constructor.name !== 'Uint8ClampedArray') {
            throw new Error('QOI.encode: The provided colorData must be instance of Uint8Array or Uint8ClampedArray');
        }

        if (colorData.length !== pixelLength) {
            throw new Error('QOI.encode: The length of colorData is incorrect');
        }

        if (channels !== 3 && channels !== 4) {
            throw new Error('QOI.encode: Invalid description.channels, must be 3 or 4');
        }

        if (colorspace !== 0 && colorspace !== 1) {
            throw new Error('QOI.encode: Invalid description.colorspace, must be 0 or 1');
        }

        const maxSize = width * height * (channels + 1) + 14 + 8;
        const result = new Uint8Array(maxSize);
        const index = new Uint8Array(64 * 4);

        // 0->3 : magic "qoif"
        result[p++] = 0x71;
        result[p++] = 0x6F;
        result[p++] = 0x69;
        result[p++] = 0x66;

        // 4->7 : width
        result[p++] = (width >> 24) & 0xFF;
        result[p++] = (width >> 16) & 0xFF;
        result[p++] = (width >> 8) & 0xFF;
        result[p++] = width & 0xFF;

        // 8->11 : height
        result[p++] = (height >> 24) & 0xFF;
        result[p++] = (height >> 16) & 0xFF;
        result[p++] = (height >> 8) & 0xFF;
        result[p++] = height & 0xFF;

        // 12 : channels, 13 : colorspace
        result[p++] = channels;
        result[p++] = colorspace;

        for (let pixelPos = 0; pixelPos < pixelLength; pixelPos += channels) {
            if (channels === 4) {
                red = colorData[pixelPos];
                green = colorData[pixelPos + 1];
                blue = colorData[pixelPos + 2];
                alpha = colorData[pixelPos + 3];
            } else {
                red = colorData[pixelPos];
                green = colorData[pixelPos + 1];
                blue = colorData[pixelPos + 2];
            }

            if (prevRed === red && prevGreen === green && prevBlue === blue && prevAlpha === alpha) {
                run++;

                // reached the maximum run length, or reached the end of colorData
                if (run === 62 || pixelPos === pixelEnd) {
                    // QOI_OP_RUN
                    result[p++] = 0b11000000 | (run - 1);
                    run = 0;
                }
            } else {
                if (run > 0) {
                    // QOI_OP_RUN
                    result[p++] = 0b11000000 | (run - 1);
                    run = 0;
                }

                const indexPosition = ((red * 3 + green * 5 + blue * 7 + alpha * 11) % 64) * 4;

                if (index[indexPosition] === red && index[indexPosition + 1] === green && index[indexPosition + 2] === blue && index[indexPosition + 3] === alpha) {
                    result[p++] = indexPosition / 4;
                } else {
                    index[indexPosition] = red;
                    index[indexPosition + 1] = green;
                    index[indexPosition + 2] = blue;
                    index[indexPosition + 3] = alpha;

                    if (alpha === prevAlpha) {
                        // ternary with bitmask handles the wraparound
                        let vr = red - prevRed;
                        vr = vr & 0b10000000 ? (vr - 256) % 256 : (vr + 256) % 256;
                        let vg = green - prevGreen;
                        vg = vg & 0b10000000 ? (vg - 256) % 256 : (vg + 256) % 256;
                        let vb = blue - prevBlue;
                        vb = vb & 0b10000000 ? (vb - 256) % 256 : (vb + 256) % 256;

                        const vg_r = vr - vg;
                        const vg_b = vb - vg;

                        if (vr > -3 && vr < 2 && vg > -3 && vg < 2 && vb > -3 && vb < 2) {
                            // QOI_OP_DIFF
                            result[p++] = 0b01000000 | (vr + 2) << 4 | (vg + 2) << 2 | (vb + 2);
                        } else if (vg_r > -9 && vg_r < 8 && vg > -33 && vg < 32 && vg_b > -9 && vg_b < 8) {
                            // QOI_OP_LUMA
                            result[p++] = 0b10000000 | (vg + 32);
                            result[p++] = (vg_r + 8) << 4 | (vg_b + 8);
                        } else {
                            // QOI_OP_RGB
                            result[p++] = 0b11111110;
                            result[p++] = red;
                            result[p++] = green;
                            result[p++] = blue;
                        }
                    } else {
                        // QOI_OP_RGBA
                        result[p++] = 0b11111111;
                        result[p++] = red;
                        result[p++] = green;
                        result[p++] = blue;
                        result[p++] = alpha;
                    }
                }
            }

            prevRed = red;
            prevGreen = green;
            prevBlue = blue;
            prevAlpha = alpha;
        }

        // 00000001 end marker/padding
        result[p++] = 0;
        result[p++] = 0;
        result[p++] = 0;
        result[p++] = 0;
        result[p++] = 0;
        result[p++] = 0;
        result[p++] = 0;
        result[p++] = 1;

        // return an ArrayBuffer trimmed to the correct length
        CodecQOIImagenator.encodedCached = result.buffer.slice(0, p);
        return await Base64.Uint8ToB64(CodecQOIImagenator.encodedCached);
    }

    static decode() {
        let arrayBuffer = CodecQOIImagenator.encodedCached;
        let byteOffset = null;
        let byteLength = null;
        let outputChannels = 4;

        if (typeof byteOffset === 'undefined' || byteOffset === null) {
            byteOffset = 0;
        }

        if (typeof byteLength === 'undefined' || byteLength === null) {
            byteLength = arrayBuffer.byteLength - byteOffset;
        }

        const uint8 = new Uint8Array(arrayBuffer, byteOffset, byteLength);

        const magic1 = uint8[0];
        const magic2 = uint8[1];
        const magic3 = uint8[2];
        const magic4 = uint8[3];

        const width = ((uint8[4] << 24) | (uint8[5] << 16) | (uint8[6] << 8) | uint8[7]) >>> 0;
        const height = ((uint8[8] << 24) | (uint8[9] << 16) | (uint8[10] << 8) | uint8[11]) >>> 0;

        const channels = uint8[12];
        const colorspace = uint8[13];

        if (typeof outputChannels === 'undefined' || outputChannels === null) {
            outputChannels = channels;
        }

        if (magic1 !== 0x71 || magic2 !== 0x6F || magic3 !== 0x69 || magic4 !== 0x66) {
            throw new Error('QOI.decode: The signature of the QOI file is invalid');
        }

        if (channels < 3 || channels > 4) {
            throw new Error('QOI.decode: The number of channels declared in the file is invalid');
        }

        if (colorspace > 1) {
            throw new Error('QOI.decode: The colorspace declared in the file is invalid');
        }

        if (outputChannels < 3 || outputChannels > 4) {
            throw new Error('QOI.decode: The number of channels for the output is invalid');
        }

        const pixelLength = width * height * outputChannels;
        const result = new Uint8Array(pixelLength);

        let arrayPosition = 14;

        const index = new Uint8Array(64 * 4);
        let indexPosition = 0;

        let red = 0;
        let green = 0;
        let blue = 0;
        let alpha = 255;

        const chunksLength = byteLength - 8;

        let run = 0;
        let pixelPosition = 0;

        for (; pixelPosition < pixelLength && arrayPosition < byteLength - 4; pixelPosition += outputChannels) {
            if (run > 0) {
                run--;
            } else if (arrayPosition < chunksLength) {
                const byte1 = uint8[arrayPosition++];

                if (byte1 === 0b11111110) { // QOI_OP_RGB
                    red = uint8[arrayPosition++];
                    green = uint8[arrayPosition++];
                    blue = uint8[arrayPosition++];
                } else if (byte1 === 0b11111111) { // QOI_OP_RGBA
                    red = uint8[arrayPosition++];
                    green = uint8[arrayPosition++];
                    blue = uint8[arrayPosition++];
                    alpha = uint8[arrayPosition++];
                } else if ((byte1 & 0b11000000) === 0b00000000) { // QOI_OP_INDEX
                    red = index[byte1 * 4];
                    green = index[byte1 * 4 + 1];
                    blue = index[byte1 * 4 + 2];
                    alpha = index[byte1 * 4 + 3];
                } else if ((byte1 & 0b11000000) === 0b01000000) { // QOI_OP_DIFF
                    red += ((byte1 >> 4) & 0b00000011) - 2;
                    green += ((byte1 >> 2) & 0b00000011) - 2;
                    blue += (byte1 & 0b00000011) - 2;

                    // handle wraparound
                    red = (red + 256) % 256;
                    green = (green + 256) % 256;
                    blue = (blue + 256) % 256;
                } else if ((byte1 & 0b11000000) === 0b10000000) { // QOI_OP_LUMA
                    const byte2 = uint8[arrayPosition++];
                    const greenDiff = (byte1 & 0b00111111) - 32;
                    const redDiff = greenDiff + ((byte2 >> 4) & 0b00001111) - 8;
                    const blueDiff = greenDiff + (byte2 & 0b00001111) - 8;

                    // handle wraparound
                    red = (red + redDiff + 256) % 256;
                    green = (green + greenDiff + 256) % 256;
                    blue = (blue + blueDiff + 256) % 256;
                } else if ((byte1 & 0b11000000) === 0b11000000) { // QOI_OP_RUN
                    run = byte1 & 0b00111111;
                }

                indexPosition = ((red * 3 + green * 5 + blue * 7 + alpha * 11) % 64) * 4;
                index[indexPosition] = red;
                index[indexPosition + 1] = green;
                index[indexPosition + 2] = blue;
                index[indexPosition + 3] = alpha;
            }

            if (outputChannels === 4) { // RGBA
                result[pixelPosition] = red;
                result[pixelPosition + 1] = green;
                result[pixelPosition + 2] = blue;
                result[pixelPosition + 3] = alpha;
            } else { // RGB
                result[pixelPosition] = red;
                result[pixelPosition + 1] = green;
                result[pixelPosition + 2] = blue;
            }
        }

        if (pixelPosition < pixelLength) {
            throw new Error('QOI.decode: Incomplete image');
        }

        // checking the 00000001 padding is not required, as per specs

        return {
            width: width,
            height: height,
            colorspace: colorspace,
            channels: outputChannels,
            data: result
        };
    }
}
