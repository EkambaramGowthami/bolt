export function extractExplanation(text: string) {
    const explanationEnd = text.indexOf("```"); // start of first code block
    const explanationText = explanationEnd !== -1 ? text.slice(0, explanationEnd).trim() : text.trim();
  
    const requirements: string[] = [];
  
    // Try to find lines that look like requirements
    const lines = explanationText.split("\n");
    for (const line of lines) {
      if (
        line.trim().startsWith("-") ||
        line.trim().startsWith("*") ||
        line.trim().startsWith("•") ||
        line.trim().startsWith("Install") ||
        line.trim().startsWith("Run") ||
        line.trim().startsWith("npm") ||
        line.trim().startsWith("yarn") ||
        line.trim().startsWith("python") ||
        line.trim().startsWith("java")
      ) {
        requirements.push(line.trim());
      }
    }
  
    // Remove requirement lines from explanation
    const filteredExplanation = lines
      .filter((line) => !requirements.includes(line.trim()))
      .join("\n")
      .trim();
  
    return {
      explanation: filteredExplanation,
      requirements,
    };
  }
  