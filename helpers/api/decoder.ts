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
      base64String = Object.values(encodedData).join('');
    } else if (typeof encodedData === 'string') {
      base64String = encodedData;
    } else {
      return encodedData;
    }

    // 1. Convert Base64 string to a Buffer/Uint8Array
    const binaryData = Buffer.from(base64String, 'base64');

    // 2. Decompress using Zlib (Inflate)
    // Note: pako.inflate is compatible with zlib.deflate used on the backend
    const decompressedData = pako.inflate(binaryData, { to: 'string' });

    // 3. Parse JSON
    return JSON.parse(decompressedData);
  } catch (error) {
    console.error('Decoding response data failed:', error);
    return encodedData;
  }
};
