const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

export const encodeInp = (input: string) => {
  let output: string | number = ""
  let chr1: string | number = ""
  let chr2: string | number = ""
  let chr3: string | number = ""
  let enc1: string | number = ""
  let enc2: string | number = ""
  let enc3: string | number = ""
  let enc4: string | number = ""
  let i = 0;
  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output =
      output +
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";
  } while (i < input.length);
  return output;
};
export const loadImage = (src: string, timeout: number = 10000) => {
  return new Promise<string>((resolve, reject: (reason: string) => void) => {
    const img = new Image()
    if (!img) return;
    img.src = src;
    img.onload = (e) => {
      e.preventDefault();
      e.stopPropagation();
      resolve(src);
    };
    if (img) img.onerror = () => reject("Image loading fail!");
    setTimeout(() => reject("Image loading timeout!"), timeout);
  });
};
