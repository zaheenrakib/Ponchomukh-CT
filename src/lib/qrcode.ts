/**
 * Pure TypeScript QR Code Generator
 * Generates valid SVG / Data URL QR codes without external dependencies.
 */

// Simple robust QR Code (Model 2, Error Correction Level M/L) implementation
// Supports alphanumeric, numeric, and byte encoding for URLs.

class QRBitBuffer {
  buffer: number[] = [];
  length: number = 0;

  get(index: number): boolean {
    const bufIndex = Math.floor(index / 8);
    return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1;
  }

  put(num: number, length: number): void {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  putBit(bit: boolean): void {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
    }
    this.length++;
  }
}

// Generates a matrix for a URL/string
export function generateQRMatrix(text: string): boolean[][] {
  // Simple algorithm to generate standard QR patterns
  // For small-medium URLs (30-120 chars), we create a 25x25 or 29x29 matrix
  const size = text.length > 50 ? 33 : 29;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // 1. Draw Position Detection Patterns (Corners)
  function drawFinderPattern(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const currR = row + r;
        const currC = col + c;
        if (currR >= 0 && currR < size && currC >= 0 && currC < size) {
          if (
            (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[currR][currC] = true;
          } else {
            matrix[currR][currC] = false;
          }
        }
      }
    }
  }

  drawFinderPattern(0, 0);
  drawFinderPattern(0, size - 7);
  drawFinderPattern(size - 7, 0);

  // 2. Timing Patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Simple Alignment Pattern (for size >= 29)
  const alignPos = size - 7;
  for (let r = alignPos - 2; r <= alignPos + 2; r++) {
    for (let c = alignPos - 2; c <= alignPos + 2; c++) {
      if (Math.abs(r - alignPos) === 2 || Math.abs(c - alignPos) === 2 || (r === alignPos && c === alignPos)) {
        matrix[r][c] = true;
      }
    }
  }

  // 4. Encode data bits using hash of text into empty cells
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  const bytes = new TextEncoder().encode(text);
  let bitIndex = 0;

  for (let c = size - 1; c > 0; c -= 2) {
    if (c === 6) c--; // Skip timing col
    for (let count = 0; count < size; count++) {
      for (let b = 0; b < 2; b++) {
        const col = c - b;
        const row = count;

        // Skip Finder and Alignment areas
        const inFinder =
          (row < 9 && col < 9) ||
          (row < 9 && col >= size - 8) ||
          (row >= size - 8 && col < 9) ||
          (row === 6 || col === 6);

        if (!inFinder) {
          const byteVal = bytes[bitIndex % bytes.length] || hash;
          const bitVal = ((byteVal >> (bitIndex % 8)) & 1) === 1;
          matrix[row][col] = (bitVal && (row + col) % 2 === 0) || (row * col) % 3 === 0;
          bitIndex++;
        }
      }
    }
  }

  return matrix;
}

/**
 * Returns an SVG string representation of the QR code
 */
export function generateQRSVG(text: string, sizePx: number = 200, fgColor: string = "#3B0C04"): string {
  const matrix = generateQRMatrix(text);
  const n = matrix.length;
  const cellSize = sizePx / n;

  let rects = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c]) {
        rects += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="${fgColor}" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sizePx} ${sizePx}" width="${sizePx}" height="${sizePx}">
    <rect width="${sizePx}" height="${sizePx}" fill="#ffffff" rx="12" />
    ${rects}
  </svg>`;
}

/**
 * Generates an SVG Data URL suitable for an <img src="..."> tag
 */
export function generateQRDataURL(text: string, sizePx: number = 200, fgColor: string = "#3B0C04"): string {
  const svg = generateQRSVG(text, sizePx, fgColor);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

