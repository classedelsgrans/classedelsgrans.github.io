const ROUND_SIZE = 5;
const $ = id => document.getElementById(id);
let deck, index, correct, answered;

function shuffled(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function updateScore(totalAnswered) {
  $('score').textContent = `Aciertos: ${correct} · Respondidas: ${totalAnswered}/${ROUND_SIZE}`;
}

function startGame(moveFocus = true) {
  deck = shuffled(minerals).slice(0, ROUND_SIZE);
  index = 0;
  correct = 0;
  updateScore(0);
  showQuestion(moveFocus);
}

function showQuestion(moveFocus) {
  const mineral = deck[index];
  answered = false;
  $('sample').hidden = false;
  $('round').textContent = `PREGUNTA ${index + 1} DE ${ROUND_SIZE}`;
  $('question').textContent = '¿Qué muestra es?';
  $('feedback').hidden = true;
  $('credit').hidden = true;
  $('next').hidden = true;
  $('clues').replaceChildren();
  $('answers').replaceChildren();
  $('photoError').hidden = true;
  const photo = $('mineralImage');
  photo.hidden = false;
  photo.alt = 'Fotografía de la muestra que debes identificar';
  photo.src = mineral.photo;
  mineral.clues.forEach((clue, i) => {
    const row = document.createElement('div');
    const number = document.createElement('span');
    number.className = 'num';
    number.textContent = i + 1;
    row.className = 'clue';
    row.append(number, clue);
    $('clues').append(row);
  });
  for (const option of shuffled([mineral.name, ...mineral.wrong])) {
    const button = document.createElement('button');
    button.className = 'answer';
    button.textContent = option;
    button.onclick = () => answer(option);
    $('answers').append(button);
  }
  if (moveFocus) $('question').focus();
}

function answer(option) {
  if (answered) return;
  answered = true;
  const mineral = deck[index];
  const isCorrect = option === mineral.name;
  if (isCorrect) correct++;
  updateScore(index + 1);
  for (const button of $('answers').children) {
    button.disabled = true;
    if (button.textContent === mineral.name) button.classList.add('correct');
    else if (button.textContent === option) button.classList.add('wrong');
  }
  const title = document.createElement('strong');
  title.textContent = isCorrect ? `¡Exacto! Es ${mineral.name.toLowerCase()}.` : `La respuesta es ${mineral.name.toLowerCase()}.`;
  const detail = document.createElement('p');
  detail.textContent = mineral.formula;
  $('feedback').replaceChildren(title, detail);
  $('feedback').hidden = false;
  $('mineralImage').alt = `Fotografía de ${mineral.name.toLowerCase()}`;
  const creditLink = document.createElement('a');
  creditLink.href = `creditos.html#${mineral.id}`;
  creditLink.target = '_blank';
  creditLink.rel = 'noopener';
  creditLink.textContent = 'Ver autoría y licencia';
  $('credit').replaceChildren(creditLink);
  $('credit').hidden = false;
  $('next').textContent = index + 1 === ROUND_SIZE ? 'Ver resultado →' : 'Siguiente mineral →';
  $('next').hidden = false;
  $('next').focus();
}

function advance() {
  if (!answered) return;
  index++;
  if (index < ROUND_SIZE) {
    showQuestion(true);
    return;
  }
  $('sample').hidden = true;
  $('round').textContent = 'PARTIDA TERMINADA';
  $('question').textContent = `${correct} de ${ROUND_SIZE} aciertos`;
  $('clues').replaceChildren();
  $('answers').replaceChildren();
  $('feedback').hidden = true;
  $('next').hidden = true;
  $('question').focus();
}

$('mineralImage').onerror = () => {
  $('mineralImage').hidden = true;
  $('photoError').hidden = false;
};
$('next').onclick = advance;
$('restart').onclick = () => startGame();
startGame(false);
