const blaguesContainer = document.getElementById('blagues');
const randomBtn = document.getElementById('randomBtn');
const randomBlagueContainer = document.getElementById('randomBlague');
const addBtn = document.getElementById('addBtn');
const texteInput = document.getElementById('texteInput');
const reponseInput = document.getElementById('reponseInput');

// ✔️ URL correcte
const API_BASE = 'https://carambar-backend-figj.onrender.com/blagues';

/**
 * Crée une carte HTML pour une blague
 */
function createBlagueCard(blague) {
  return `
    <div class="p-6 bg-white border-2 border-red-500 text-red-900 rounded-2xl shadow-md w-72 hover:shadow-xl hover:scale-105 transform transition-all duration-300">
      <p class="font-semibold mb-2">${blague.question}</p>
      <p class="text-red-700 italic">Réponse: ${blague.reponse || '...'}</p>
    </div>
  `;
}

async function fetchBlagues() {
  try {
    const res = await fetch(`${API_BASE}/lesblagues`);
    if (!res.ok) throw new Error('Erreur lors du fetch des blagues');
    
    const blagues = await res.json();

    blaguesContainer.innerHTML = blagues.length 
      ? blagues.map(createBlagueCard).join('')
      : `<p class="text-red-700 font-semibold">Aucune blague trouvée.</p>`;
  } catch (err) {
    console.error('Erreur fetchBlagues:', err);
    blaguesContainer.innerHTML = `<p class="text-red-700 font-semibold">Impossible de charger les blagues.</p>`;
  }
}

async function fetchRandomBlague() {
  try {
    randomBtn.disabled = true;
    randomBtn.textContent = 'Chargement...';

    const res = await fetch(`${API_BASE}/random`);
    if (!res.ok) throw new Error('Erreur lors de la récupération de la blague aléatoire');

    const blague = await res.json();

    randomBlagueContainer.innerHTML = `
      <p class="font-semibold mb-2">${blague.question}</p>
      <p class="text-red-700 italic">Réponse: ${blague.reponse || '...'}</p>
    `;
  } catch (err) {
    console.error('Erreur randomBlague:', err);
    randomBlagueContainer.innerHTML = `<p class="text-red-700 font-semibold">Impossible de charger une blague aléatoire.</p>`;
  } finally {
    randomBtn.disabled = false;
    randomBtn.textContent = 'Blague aléatoire';
  }
}

async function addBlague() {
  const question = texteInput.value.trim();
  const reponse = reponseInput.value.trim();

  if (!question || !reponse) {
    alert('Veuillez remplir la blague et sa réponse !');
    return;
  }

  try {
    addBtn.disabled = true;
    addBtn.textContent = 'Ajout en cours...';

    const res = await fetch(`${API_BASE}/ajouterblague`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, reponse })
    });

    if (!res.ok) throw new Error('Erreur lors de l’ajout');

    await res.json(); 
    await fetchBlagues(); 
    texteInput.value = '';
    reponseInput.value = '';
    alert('Blague ajoutée avec succès !');
  } catch (err) {
    console.error('Erreur addBlague:', err);
    alert('Impossible d’ajouter la blague.');
  } finally {
    addBtn.disabled = false;
    addBtn.textContent = 'Ajouter';
  }
}

randomBtn.addEventListener('click', fetchRandomBlague);
addBtn.addEventListener('click', addBlague);

fetchBlagues();
