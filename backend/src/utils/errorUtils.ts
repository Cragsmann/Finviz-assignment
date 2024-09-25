export function isCustomErrorWithKind(
  err: unknown,
  kind: string
): err is { kind: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "kind" in err &&
    (err as { kind: string }).kind === kind
  );
}
