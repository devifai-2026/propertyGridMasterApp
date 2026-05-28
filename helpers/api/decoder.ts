import pako from 'pako';
import { Buffer } from 'buffer';

/**
 * Decodes the custom encoded response data from the backend.
 * The backend compresses data with Zlib Deflate and then Base64 encodes it.
 *
 * @param encodedData - The compressed/encoded data (as a string or object of characters)
 * @returns The original JSON object
 */
export const decodeResponseData = (encodedData: any): any => {
  if (!encodedData) return null;

  try {
    let base64String = '';

    // Handle if encodedData is an object with indices like {"0": "e", "1": "J", ...}
    if (typeof encodedData === 'object' && !Array.isArray(encodedData)) {
      if (encodedData["0"] === "e" && encodedData["1"] === "J") {
        base64String = Object.values(encodedData).join('');
      } else {
        return encodedData;
      }
    } else if (typeof encodedData === 'string') {
      if (encodedData.startsWith('eJ')) {
        base64String = encodedData;
      } else {
        try {
          return JSON.parse(encodedData);
        } catch {
          return encodedData;
        }
      }
    } else {
      return encodedData;
    }

    // 1. Convert Base64 string to a Buffer/Uint8Array
    const binaryData = Buffer.from(base64String, 'base64');

    // 2. Decompress using Zlib (Inflate)
    const decompressedData = pako.inflate(binaryData, { to: 'string' });

    // 3. Parse JSON
    return JSON.parse(decompressedData);
  } catch (error) {
    console.warn('Decoding response data failed:', error);
    return encodedData;
  }
};
