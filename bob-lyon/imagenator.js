// drawlite to PJS conversion
const JAVA2D = 1;
function createGraphics(width, height, type) {
    let gfx = dl.createGraphics(width, height, type);
    gfx.get = function(x, y, w, h) {
        let img = dl.snip(x, y, w, h);
        img.sourceImg = img.sourceImage;
        return img;
    };
    return gfx;
}

var img180 = null;
let inflatedPJSImage = null;

class CodecBobLyonImagenator {
    static libCode = `// The following comment guarantees that this program will never appear on the hot list:
// /cs/pro/5733417664643072
// Remove the above comment before EVER saving this program to make this program visible.
var img180 = {note: "See http://tinyurl.com/KAImage4U to do your own image.",
author: "Created by Bob Lyon for Khan Academy image users.",
inflate: function(a){if(img180.img){return img180.img;}var c=function(a){var b=0,c,d,e;c=0;for(e=a.length;c<e;c++){d=a.charCodeAt(c);b=29*b+d|0;}return b&2147483647;},b=function(a){var b,c,d,e,h=256,f=[];for(b=0;256>b;b+=1){f[b]=String.fromCharCode(b);}d=c=String.fromCharCode(a[0]);for(b=1;b<a.length;b+=1){e=a[b];if(f[e]){e=f[e];}else if(e===h){e=c+c.charAt(0);}else{return null;}d+=e;f[h++]=c+e.charAt(0);c=e;}return d;},d=function(a){return this[a];}("JSON").parse(a?a:img180.csc);if(d){var e;a=(a=b(d.pix))?a:d.pix;b=255/d.digit.length;img180.img=createGraphics(d.width,d.height,JAVA2D);if(img180.img){img180.img.background(0,0,0,0);var f=img180.img.get(),k=f.sourceImg.getContext("2d"),g=k.getImageData(0,0,img180.img.width,img180.img.height),b=c(img180.note+img180.author)===d.h?b:b/4;for(e=c=0;c<a.length;){g.data[e++]=round(b*d.digit.indexOf(a[c++]));g.data[e++]=round(b*d.digit.indexOf(a[c++]));g.data[e++]=round(b*d.digit.indexOf(a[c++]));g.data[e++]=255;}k.putImageData(g,0,0);img180.img.image(f,0,0);}}return img180.img;}, 
};`;
    
    static reset_img180() {
        img180 = {
            note: "See http://tinyurl.com/KAImage4U to do your own image.",
            author: "Created by Bob Lyon for Khan Academy image users.",
            inflate: function(a) {
                if (img180.img) {
                    return img180.img;
                }
                var c = function(a) {
                    var b = 0, c, d, e;
                    c = 0;
                    for (e = a.length; c < e; c++) {
                        d = a.charCodeAt(c);
                        b = 29 * b + d | 0;
                    }
                    return b & 2147483647;
                };

                var b = function(a) {
                    var b, c, d, e, h = 256, f = [];
                    for (b = 0; 256 > b; b += 1) {
                        f[b] = String.fromCharCode(b);
                    }
                    d = c = String.fromCharCode(a[0]);
                    for (b = 1; b < a.length; b += 1) {
                        e = a[b];
                        if (f[e]) {
                            e = f[e];
                        } else if (e === h) {
                            e = c + c.charAt(0);
                        } else {
                            return null;
                        }
                        d += e;
                        f[h++] = c + e.charAt(0);
                        c = e;
                    }
                    return d;
                };

                var d = JSON.parse(a ? a : img180.csc);

                if (d) {
                    var e;
                    a = (a = b(d.pix)) ? a : d.pix;
                    b = 255 / d.digit.length;
                    img180.img = createGraphics(d.width, d.height, JAVA2D);
                    if (img180.img) {
                        img180.img.background(0, 0, 0, 0);
                        var f = img180.img.get()
                            , k = f.sourceImg.getContext("2d")
                            , g = k.getImageData(0, 0, img180.img.width, img180.img.height)
                            , b = c(img180.note + img180.author) === d.h ? b : b / 4;
                        for (e = c = 0; c < a.length; ) {
                            g.data[e++] = round(b * d.digit.indexOf(a[c++]));
                            g.data[e++] = round(b * d.digit.indexOf(a[c++]));
                            g.data[e++] = round(b * d.digit.indexOf(a[c++]));
                            g.data[e++] = 255;
                        }
                        k.putImageData(g, 0, 0);
                        img180.img.image(f, 0, 0);
                    }
                }
                return img180.img;
            }
        };
    }

    static async encode(settings) {
        CodecBobLyonImagenator.reset_img180();

        function z(a) {
            var c, b, d, e = "", f = [], k = 256, g = {};
            for (c = 0; 256 > c; c += 1)
                g[String.fromCharCode(c)] = c;
            for (c = 0; c < a.length; c += 1)
                b = a.charAt(c),
                d = e + b,
                g.hasOwnProperty(d) ? e = d : (f.push(g[e]),
                g[d] = k++,
                e = String(b));
            "" !== e && f.push(g[e]);
            return f
        }

        function A(a) {
            var b, d = "";
            for (b = 0; b < a.length; b++)
                d += "()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~\u00bc\u00bd\u00be\u00bf\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5\u00c6\u00c7\u00c8\u00c9\u00ca\u00cb\u00cc\u00cd\u00ce\u00cf\u00d0\u00d1\u00d2\u00d3\u00d4\u00d5\u00d6\u00d7\u00d8\u00d9\u00da\u00db\u00dc\u00dd\u00de\u00df\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u00e6\u00e7\u00e8\u00e9\u00ea\u00eb\u00ec\u00ed\u00ee\u00ef\u00f0\u00f1\u00f2\u00f3\u00f4\u00f5\u00f6\u00f7\u00f8\u00f9\u00fa\u00fb\u00fc\u00fd\u00fe"[round(map(a[b++], 0, 255, 0, 150))] + "()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~\u00bc\u00bd\u00be\u00bf\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5\u00c6\u00c7\u00c8\u00c9\u00ca\u00cb\u00cc\u00cd\u00ce\u00cf\u00d0\u00d1\u00d2\u00d3\u00d4\u00d5\u00d6\u00d7\u00d8\u00d9\u00da\u00db\u00dc\u00dd\u00de\u00df\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u00e6\u00e7\u00e8\u00e9\u00ea\u00eb\u00ec\u00ed\u00ee\u00ef\u00f0\u00f1\u00f2\u00f3\u00f4\u00f5\u00f6\u00f7\u00f8\u00f9\u00fa\u00fb\u00fc\u00fd\u00fe"[round(map(a[b++], 0, 255, 0, 150))] + "()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~\u00bc\u00bd\u00be\u00bf\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5\u00c6\u00c7\u00c8\u00c9\u00ca\u00cb\u00cc\u00cd\u00ce\u00cf\u00d0\u00d1\u00d2\u00d3\u00d4\u00d5\u00d6\u00d7\u00d8\u00d9\u00da\u00db\u00dc\u00dd\u00de\u00df\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u00e6\u00e7\u00e8\u00e9\u00ea\u00eb\u00ec\u00ed\u00ee\u00ef\u00f0\u00f1\u00f2\u00f3\u00f4\u00f5\u00f6\u00f7\u00f8\u00f9\u00fa\u00fb\u00fc\u00fd\u00fe"[round(map(a[b++], 0, 255, 0, 150))];
            a = z(d);
            return JSON.stringify(a).length < d.length ? a : d
        }

        function processImageData(imgData) {
            let a = {
                width: imgData.width,
                height: imgData.height,
                digit: "()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~\u00bc\u00bd\u00be\u00bf\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5\u00c6\u00c7\u00c8\u00c9\u00ca\u00cb\u00cc\u00cd\u00ce\u00cf\u00d0\u00d1\u00d2\u00d3\u00d4\u00d5\u00d6\u00d7\u00d8\u00d9\u00da\u00db\u00dc\u00dd\u00de\u00df\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u00e6\u00e7\u00e8\u00e9\u00ea\u00eb\u00ec\u00ed\u00ee\u00ef\u00f0\u00f1\u00f2\u00f3\u00f4\u00f5\u00f6\u00f7\u00f8\u00f9\u00fa\u00fb\u00fc\u00fd\u00fe",
                h: 1689796942,
                pix: A(imgData.data)
            };
            a = JSON.stringify(a);
            return a;
        }

        let imageJSONString = processImageData(settings.imageData);
        inflatedPJSImage = img180.inflate(imageJSONString);

        CodecBobLyonImagenator.reset_img180();

        return Promise.resolve(imageJSONString);
    }

    static decode() {
        image(inflatedPJSImage, 0, 0);
        return null;
    }
}
