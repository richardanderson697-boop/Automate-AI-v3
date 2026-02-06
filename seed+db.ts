// scripts/seed-db.ts logic
const knowledgeItems = [/* items from above */];

for (const item of knowledgeItems) {
  const embedding = await generateEmbedding(item.content);
  await supabase.from('repair_knowledge').insert({
    ...item,
    embedding
  });
}
