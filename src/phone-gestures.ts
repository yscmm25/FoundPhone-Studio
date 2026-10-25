/**
 * Detect deliberate pointer movement in phone-screen coordinates.
 *
 * PointerEvent.movementX/Y can be unreliable across touch input implementations;
 * compare the current pointer position with the original press instead.
 */
export function movedBeyondThreshold(
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  scale = 1,
  threshold = 5,
): boolean {
  const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
  return (
    Math.abs(currentX - startX) / safeScale > threshold ||
    Math.abs(currentY - startY) / safeScale > threshold
  );
}
