import fs from 'fs';

const filePath = './src/data/more_questions.json';
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const questionMap = new Map();

jsonData.forEach(question => {
  const questionText = question.question;
  
  if (!questionMap.has(questionText)) {
    questionMap.set(questionText, question);
    return;
  }
  
  const existingQuestion = questionMap.get(questionText);
  
  if (!existingQuestion.explanation && question.explanation) {
    questionMap.set(questionText, question);
    return;
  }
  
  if (existingQuestion.explanation && question.explanation && 
      question.explanation.length > existingQuestion.explanation.length) {
    questionMap.set(questionText, question);
    return;
  }
});

const deduplicatedQuestions = Array.from(questionMap.values());

fs.writeFileSync(
  './src/data/more_questions_deduplicated.json', 
  JSON.stringify(deduplicatedQuestions, null, 2)
);

console.log(`Original question count: ${jsonData.length}`);
console.log(`Deduplicated question count: ${deduplicatedQuestions.length}`);
console.log(`Removed ${jsonData.length - deduplicatedQuestions.length} duplicate questions`);
