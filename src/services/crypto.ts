/**
 * AOS Cryptographic Provenance Engine
 * Enforces HMAC/SHA-256 hash chaining: Hash_n = SHA256(Payload_n || Hash_{n-1})
 * Fail-closed tamper detection & verification.
 */

import { ProvenanceBlock } from '../types/aos';

/**
 * Calculates SHA-256 hash of a string using Web Crypto API.
 */
export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Serializes block data consistently for hash computation.
 */
export function serializeBlockForHashing(
  index: number,
  timestamp: string,
  previousHash: string,
  actionType: string,
  surface: string,
  payload: any,
  accountability: any
): string {
  return JSON.stringify({
    index,
    timestamp,
    previousHash,
    actionType,
    surface,
    payload,
    accountability,
  });
}

/**
 * Computes the hash for a new provenance block chained to previousHash.
 */
export async function computeBlockHash(
  index: number,
  timestamp: string,
  previousHash: string,
  actionType: string,
  surface: string,
  payload: any,
  accountability: any
): Promise<string> {
  const serialized = serializeBlockForHashing(
    index,
    timestamp,
    previousHash,
    actionType,
    surface,
    payload,
    accountability
  );
  return await sha256(serialized);
}

/**
 * Verifies the entire cryptographic hash chain.
 * Returns valid status and index of first broken link if any.
 */
export async function verifyChainIntegrity(
  blocks: ProvenanceBlock[]
): Promise<{
  isValid: boolean;
  brokenIndex?: number;
  reason?: string;
  verifiedCount: number;
}> {
  if (blocks.length === 0) {
    return { isValid: true, verifiedCount: 0 };
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Check link to previous block
    if (i > 0) {
      const prevBlock = blocks[i - 1];
      if (block.previousHash !== prevBlock.hash) {
        return {
          isValid: false,
          brokenIndex: i,
          reason: `Block #${block.index} previousHash mismatch: expected ${prevBlock.hash.slice(0, 10)}..., received ${block.previousHash.slice(0, 10)}...`,
          verifiedCount: i,
        };
      }
    } else {
      // Genesis block check
      if (block.previousHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return {
          isValid: false,
          brokenIndex: 0,
          reason: 'Genesis block previousHash must be 64 zeros.',
          verifiedCount: 0,
        };
      }
    }

    // Check hash computation of current block
    const calculated = await computeBlockHash(
      block.index,
      block.timestamp,
      block.previousHash,
      block.actionType,
      block.surface,
      block.payload,
      block.accountability
    );

    if (calculated !== block.hash) {
      return {
        isValid: false,
        brokenIndex: i,
        reason: `Block #${block.index} content digest mismatch! Payload tampered or signature corrupted.`,
        verifiedCount: i,
      };
    }
  }

  return { isValid: true, verifiedCount: blocks.length };
}
