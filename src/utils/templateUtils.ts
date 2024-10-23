export const getTemplateForTempo = (tempo: number | null): 'dynamic' | 'static' => {
  if (!tempo) return 'static';
  
  // For faster tempos, use the dynamic template
  return tempo > 100 ? 'dynamic' : 'static';
};