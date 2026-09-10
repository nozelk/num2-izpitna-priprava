window.STUDY_DATA = (() => {
  "use strict";

  const topics = [
    ...(window.NUM2_TOPICS_APPROX || []),
    ...(window.NUM2_TOPICS_CALCULUS || []),
    ...(window.NUM2_TOPICS_ODE || [])
  ];
  const practice = window.NUM2_PRACTICE || {};
  const flashcards = practice.flashcards || [];
  const quizQuestions = practice.quizQuestions || [];
  const examQuestions = practice.examQuestions || [];

  const ids = new Set(topics.map(topic => topic.id));
  if (ids.size !== topics.length) throw new Error("Podvojeni identifikatorji tem NUM2.");
  for (const item of [...flashcards, ...quizQuestions, ...examQuestions]) {
    if (!ids.has(item.topic)) throw new Error(`Neznana tema pri vprašanju: ${item.topic}`);
  }

  return { topics, flashcards, quizQuestions, examQuestions };
})();
window.StudyUI?.decorateRecaps();
