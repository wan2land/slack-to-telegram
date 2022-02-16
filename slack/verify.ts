import { encode } from "https://deno.land/std@0.125.0/encoding/hex.ts";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function createVerifier(secret: string) {
  const keyPromise = crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  return async (
    body: string,
    timestamp: number | string | null,
    signature: string | null,
  ): Promise<boolean> => {
    if (timestamp == null || signature == null) {
      return false;
    }
    const key = await keyPromise;
    const result = await crypto.subtle.sign(
      "HMAC",
      key,
      textEncoder.encode(`v0:${timestamp}:${body}`).buffer,
    );
    const mySignature = textDecoder.decode(encode(new Uint8Array(result)));
    return `v0=${mySignature}` === signature;
  };
}
