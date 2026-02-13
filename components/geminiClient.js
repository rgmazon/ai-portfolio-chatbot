export async function getAvailableModels(apiKey) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Failed to fetch models:", err);
      return [];
    }

    const data = await res.json();

    // Return only models that support generateContent
    return data?.models?.filter((m) =>
      m.supportedGenerationMethods?.includes("generateContent")
    ) || [];
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
}