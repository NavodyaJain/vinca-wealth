// Map personality to group deterministically
export default function personalityToGroup(personality) {
  if (!personality) return 'group-1';
  if (personality.includes('FIRE')) return 'group-1';
  if (personality.includes('Lifestyle')) return 'group-2';
  if (personality.includes('Health')) return 'group-3';
  return 'group-1';
}
