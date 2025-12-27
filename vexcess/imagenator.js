class CodecVexcessImagenator {
    static libCode = `var base185={codeKey:" !#$%&'()*+-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_\`abcdefghijklmnopqrstuvwxyz{}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ",decode:function(num){var decoded=0;for(var i =num.length;i>0;i--){var value=pow(this.codeKey.length,i-1).toString();var value2=this.codeKey.indexOf(num.charAt(num.length-i));var value3=value*value2;decoded+=value3;}return decoded;}};var vexIMG={decode:function(imgCode){var newData="";var i=0;while (i<imgCode.length){var currChar=imgCode.charAt(i);if(currChar==="|"){var char=imgCode.charAt(i+1);var j=i+3;while(imgCode.charAt(j)!== "|"&&j<imgCode.length){j++;}var len=base185.decode(imgCode.substring(i+2,j));var seg="";for(var k=0;k<len;k++){ seg+=char;}newData+=seg;i+=j-i+1;}else{newData+=currChar;i++;}}var splitData=newData.split(",");var w=base185.decode(splitData[0]);var h=base185.decode(splitData[1]);var compressionFactor=base185.decode(splitData[2]);var img=get(0,0,w,h);var p=img;if(p.imageData){p=p.imageData;}if(p.data){p=p.data;}if(splitData.length===6){var currR=0;var currG=0;var currB=0;var strR=splitData[3].split("");var strG=splitData[4].split("");var strB=splitData[5].split("");for(var i=0;i<p.length;i+=4){var pix=i/4;currR+=base185.decode(strR[pix])-85; currG+=base185.decode(strG[pix])-85;currB+=base185.decode(strB[pix])-85;p[i]=currR*compressionFactor;p[i+1]=currG*compressionFactor;p[i+2]=currB*compressionFactor;}}else if(splitData.length===7){var currR=0;var currG=0;var currB=0;var currA=0;var strR=splitData[3].split("");var strG=splitData[4].split("");var strB=splitData[5].split("");var strA=splitData[6].split("");for (var i=0;i<p.length;i+=4){var pix=i/4;currR+=base185.decode(strR[pix])-85;currG+=base185.decode(strG[pix])-85;currB+=base185.decode(strB[pix])-85;currA+=base185.decode(strA[pix])-85;p[i]=currR*compressionFactor;p[i+1]=currG*compressionFactor;p[i+2]=currB*compressionFactor;p[i+3]=currA*compressionFactor;}}else if(splitData.length===4){var currAvg=0;var strAvg=splitData[3].split("");for(var i=0;i<p.length;i+=4){currAvg+=base185.decode(strAvg[i/4])-85;p[i]=currAvg*compressionFactor;p[i+1]=currAvg*compressionFactor;p[i+2]=currAvg*compressionFactor;}}if(img.set){img.set(p);}return img;}};`;
    
    static base185 = {
        codeKey: " !#$%&'()*+-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ",
        encode: function(num) {
            var placeValues = 0;
            while (pow(this.codeKey.length, placeValues) <= num + 1) {
                placeValues++;
            }

            var encoded = "";
            for (var i = placeValues; i > 0; i--) {
                var factor = pow(this.codeKey.length, i - 1);
                encoded += this.codeKey.charAt(floor(num / factor));
                num -= floor(num / factor) * factor;
            }

            return encoded;
        },
    };

    // for rendering the image without having to fully decompress it (faster)
    static nonCompressedOutput = [];

    static async encode(settings) {
        var w = settings.imageWidth;
        var h = settings.imageHeight;
        var compressionFactor = Math.round(settings.compressionLevel * 50);
        var grayScale = settings.grayscale;
        var p = settings.imageData.data;

        var data = "";
        CodecVexcessImagenator.nonCompressedOutput = [];

        if (!compressionFactor) {
            compressionFactor = 1;
        }
        compressionFactor += 2;

        // GRAYSCALE
        if (grayScale) {
            var lastAvg = 0;

            var strAvg = "";
            var nonCompStrAvg = [];

            for (var i = 0; i < p.length; i += 4) {
                var diffAvg = ~~((p[i] + p[i + 1] + p[i + 2]) / 3 / compressionFactor) - lastAvg;

                lastAvg += diffAvg;

                strAvg += CodecVexcessImagenator.base185.encode(diffAvg + 85);
                nonCompStrAvg.push(diffAvg);
            }

            data = CodecVexcessImagenator.base185.encode(w) + "," + CodecVexcessImagenator.base185.encode(h) + "," + CodecVexcessImagenator.base185.encode(compressionFactor) + "," + strAvg;
            CodecVexcessImagenator.nonCompressedOutput = [w, h, compressionFactor, nonCompStrAvg];

        }
        // NOT GRAYSCALE
        else {
            var lastR = 0;
            var lastG = 0;
            var lastB = 0;
            var lastA = 0;

            var strR = "";
            var strG = "";
            var strB = "";
            var nonCompStrR = [];
            var nonCompStrG = [];
            var nonCompStrB = [];

            var addAlpha = false;

            for (var i = 3; i < p.length; i += 4) {
                if (p[i] !== 255) {
                    addAlpha = true;
                    break;
                }
            }

            // RGBA
            if (addAlpha) {
                var strA = "";
                var nonCompStrA = [];

                for (var i = 0; i < p.length; i += 4) {
                    var diffR = ~~(p[i] / compressionFactor) - lastR;
                    var diffG = ~~(p[i + 1] / compressionFactor) - lastG;
                    var diffB = ~~(p[i + 2] / compressionFactor) - lastB;
                    var diffA = ~~(p[i + 3] / compressionFactor) - lastA;

                    lastR += diffR;
                    lastG += diffG;
                    lastB += diffB;
                    lastA += diffA;

                    strR += CodecVexcessImagenator.base185.encode(diffR + 85);
                    strG += CodecVexcessImagenator.base185.encode(diffG + 85);
                    strB += CodecVexcessImagenator.base185.encode(diffB + 85);
                    strA += CodecVexcessImagenator.base185.encode(diffA + 85);
                    nonCompStrR.push(diffR);
                    nonCompStrG.push(diffG);
                    nonCompStrB.push(diffB);
                    nonCompStrA.push(diffA);
                }

                data = CodecVexcessImagenator.base185.encode(w) + "," + CodecVexcessImagenator.base185.encode(h) + "," + CodecVexcessImagenator.base185.encode(compressionFactor) + "," + strR + "," + strG + "," + strB + "," + strA;
                CodecVexcessImagenator.nonCompressedOutput = [w, h, compressionFactor, nonCompStrR, nonCompStrG, nonCompStrB, nonCompStrA];

            }
            // RGB
            else {
                for (var i = 0; i < p.length; i += 4) {
                    var diffR = ~~(p[i] / compressionFactor) - lastR;
                    var diffG = ~~(p[i + 1] / compressionFactor) - lastG;
                    var diffB = ~~(p[i + 2] / compressionFactor) - lastB;

                    lastR += diffR;
                    lastG += diffG;
                    lastB += diffB;

                    strR += CodecVexcessImagenator.base185.encode(diffR + 85);
                    strG += CodecVexcessImagenator.base185.encode(diffG + 85);
                    strB += CodecVexcessImagenator.base185.encode(diffB + 85);
                    nonCompStrR.push(diffR);
                    nonCompStrG.push(diffG);
                    nonCompStrB.push(diffB);
                }

                data = CodecVexcessImagenator.base185.encode(w) + "," + CodecVexcessImagenator.base185.encode(h) + "," + CodecVexcessImagenator.base185.encode(compressionFactor) + "," + strR + "," + strG + "," + strB;
                CodecVexcessImagenator.nonCompressedOutput = [w, h, compressionFactor, nonCompStrR, nonCompStrG, nonCompStrB];

            }
        }

        // run length encode it
        var newData = "";

        var i = 0;
        while (i < data.length) {
            var currChar = data.charAt(i);

            var i2 = i + 1;
            while (data.charAt(i2) === currChar) {
                i2++;
            }

            if (i2 - i > 4) {
                var len = CodecVexcessImagenator.base185.encode(i2 - i);
                newData += "|" + currChar + len + "|";

            } else {
                newData += data.substring(i, i2);
            }

            i = i2;
        }

        return Promise.resolve(newData);
    }

    static decode() {
        var splitData = CodecVexcessImagenator.nonCompressedOutput;
        var w = CodecVexcessImagenator.nonCompressedOutput[0];
        var h = CodecVexcessImagenator.nonCompressedOutput[1];
        var compressionFactor = CodecVexcessImagenator.nonCompressedOutput[2];

        var imageData = new ImageData(w, h);
        var p = imageData.data;
        for (var i = 0; i < p.length; i += 4) {
            p[i + 3] = 255;
        }

        // RGB
        if (splitData.length === 6) {
            var currR = 0;
            var currG = 0;
            var currB = 0;

            var strR = CodecVexcessImagenator.nonCompressedOutput[3];
            var strG = CodecVexcessImagenator.nonCompressedOutput[4];
            var strB = CodecVexcessImagenator.nonCompressedOutput[5];

            for (var i = 0; i < p.length; i += 4) {
                var pix = i / 4;

                currR += strR[pix];
                currG += strG[pix];
                currB += strB[pix];

                p[i] = currR * compressionFactor;
                p[i + 1] = currG * compressionFactor;
                p[i + 2] = currB * compressionFactor;
            }

        }
        // RGBA
        else if (splitData.length === 7) {
            var currR = 0;
            var currG = 0;
            var currB = 0;
            var currA = 0;

            var strR = CodecVexcessImagenator.nonCompressedOutput[3];
            var strG = CodecVexcessImagenator.nonCompressedOutput[4];
            var strB = CodecVexcessImagenator.nonCompressedOutput[5];
            var strA = CodecVexcessImagenator.nonCompressedOutput[6];

            for (var i = 0; i < p.length; i += 4) {
                var pix = i / 4;

                currR += strR[pix];
                currG += strG[pix];
                currB += strB[pix];
                currA += strA[pix];

                p[i] = currR * compressionFactor;
                p[i + 1] = currG * compressionFactor;
                p[i + 2] = currB * compressionFactor;
                p[i + 3] = currA * compressionFactor;
            }

        }
        // GRAYSCALE
        else if (splitData.length === 4) {
            var currAvg = 0;

            var strAvg = CodecVexcessImagenator.nonCompressedOutput[3];

            for (var i = 0; i < p.length; i += 4) {
                currAvg += strAvg[i / 4];

                p[i] = currAvg * compressionFactor;
                p[i + 1] = currAvg * compressionFactor;
                p[i + 2] = currAvg * compressionFactor;
            }
        }

        return imageData;
    }
}
