export const hideControls = {
  controls: { disable: true },
};

export const showControls = {
  controls: { disable: false },
};

export function example(source: string, description?: string) {
  const docs: Record<string, unknown> = { source: { code: source } };

  if (description)
    docs.description = { story: description };

  return { docs };
}
