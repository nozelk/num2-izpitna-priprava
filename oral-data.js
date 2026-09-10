(() => {
  "use strict";

  const topics = [
    ...(window.NUM2_ORAL_PART1 || []),
    ...(window.NUM2_ORAL_PART2 || [])
  ].sort((a, b) => a.number - b.number);

  if (topics.length !== 13) {
    throw new Error(`Uradni ustni seznam mora vsebovati 13 vprašanj, naloženih je ${topics.length}.`);
  }

  const ids = new Set();
  topics.forEach((topic, index) => {
    if (!topic || typeof topic !== "object") throw new Error(`Neveljavno ustno vprašanje na mestu ${index + 1}.`);
    if (topic.number !== index + 1) throw new Error(`Manjka ali je napačno oštevilčeno ustno vprašanje ${index + 1}.`);
    if (!topic.id || ids.has(topic.id)) throw new Error(`Podvojen ali prazen ID ustnega vprašanja ${index + 1}.`);
    if (!topic.title || !topic.officialPrompt || !Array.isArray(topic.sections) || topic.sections.length < 7) {
      throw new Error(`Ustno vprašanje ${topic.number} nima dovolj vsebine.`);
    }
    ids.add(topic.id);
  });

  window.NUM2_ORAL = topics;
})();
