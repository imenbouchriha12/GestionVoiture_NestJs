const socket = io();
let voitures = [];
let editVoitureId = null;
let showOnlyAvailable = false;
let searchText = '';
let currentDetailId = null;

// ================= SOCKET EVENTS =================

socket.on('connect', () => {
  socket.emit('voiture:findAll');
});

socket.on('voiture:findAllResult', data => {
  voitures = data;
  renderVoitures();
});

socket.on('voiture:created', voiture => {
  voitures.push(voiture);
  renderVoitures();
  alert('✅ Voiture ajoutée avec succès !');
});

socket.on('voiture:updated', updated => {
  voitures = voitures.map(v => v._id === updated._id ? updated : v);
  renderVoitures();
  alert('✅ Voiture mise à jour avec succès !');
});

socket.on('voiture:deleted', id => {
  voitures = voitures.filter(v => v._id !== id);
  renderVoitures();
  alert('✅ Voiture supprimée avec succès !');
});

// ================= RENDER =================

function showAvailable() {
  showOnlyAvailable = true;
  renderVoitures();
}

function showAll() {
  showOnlyAvailable = false;
  renderVoitures();
}

function renderVoitures(data) {
  if (data) voitures = data;

  const table = document.getElementById('voituresTable');
  table.innerHTML = '';

  let list = voitures;

  // filtre disponibilité
  if (showOnlyAvailable) {
    list = list.filter(v => v.isAvailable === true);
  }

  // filtre recherche (brand ou model)
  if (searchText) {
    list = list.filter(v =>
      v.brand.toLowerCase().includes(searchText) ||
      v.model.toLowerCase().includes(searchText)
    );
  }

  if (list.length === 0) {
    table.innerHTML = '<tr><td colspan="9" class="no-data">Aucune voiture trouvée</td></tr>';
    return;
  }

  list.forEach(v => {
    const year = new Date(v.year).getFullYear();
    const age = isNaN(year) ? 'N/A' : new Date().getFullYear() - year;

    table.innerHTML += `
      <tr>
        <td><strong>${v.brand}</strong></td>
        <td>${v.model}</td>
        <td>${v.color}</td>
        <td>${year}</td>
        <td><strong>${v.price.toLocaleString()} €</strong></td>
        <td>${age} ans</td>
        <td>${v.mileage.toLocaleString()} km</td>
        <td>
          <span class="badge ${v.isAvailable ? 'badge-yes' : 'badge-no'}">
            ${v.isAvailable ? 'Oui' : 'Non'}
          </span>
        </td>
        <td class="actions-cell">
          <button class="btn-edit" onclick="editVoiture('${v._id}')">✏️ Éditer</button>
          <button class="btn-delete" onclick="deleteVoiture('${v._id}')">🗑️ Supprimer</button>
          <button class="btn-details" onclick="showDetails('${v._id}')">👁️ Détails</button>
        </td>
      </tr>
    `;
  });
}

// ================= FORM =================

function showForm() {
  editVoitureId = null;
  document.getElementById('formTitle').innerText = '➕ Ajouter une Voiture';
  document.getElementById('form').style.display = 'block';
  document.getElementById('details').style.display = 'none';
  document.getElementById('stats').style.display = 'none';
  document.getElementById('advanced').style.display = 'none';
  clearForm();
}

function hideForm() {
  document.getElementById('form').style.display = 'none';
}

function clearForm() {
  ['brand','model','year','color','price','mileage']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('isAvailable').checked = false;
}

function submitForm() {
  const voiture = {
    brand: brand.value,
    model: model.value,
    year: year.value,
    color: color.value,
    price: Number(price.value),
    mileage: Number(mileage.value),
    isAvailable: isAvailable.checked,
  };

  if (!voiture.brand || !voiture.model || !voiture.year) {
    alert('❌ Veuillez remplir tous les champs obligatoires');
    return;
  }

  if (editVoitureId) {
    socket.emit('voiture:update', { id: editVoitureId, data: voiture });
  } else {
    socket.emit('voiture:create', voiture);
  }

  hideForm();
}

function editVoiture(id) {
  const v = voitures.find(x => x._id === id);
  if (!v) return;

  editVoitureId = id;
  brand.value = v.brand;
  model.value = v.model;
  year.value = v.year;
  color.value = v.color;
  price.value = v.price;
  mileage.value = v.mileage;
  isAvailable.checked = v.isAvailable;

  document.getElementById('formTitle').innerText = '✏️ Éditer la Voiture';
  document.getElementById('form').style.display = 'block';
  document.getElementById('details').style.display = 'none';
  document.getElementById('stats').style.display = 'none';
  document.getElementById('advanced').style.display = 'none';
}

// ================= DETAILS =================

function showDetails(id) {
  const v = voitures.find(x => x._id === id);
  if (!v) return;

  currentDetailId = id;

  const year = new Date(v.year).getFullYear();
  const age = isNaN(year) ? 'N/A' : new Date().getFullYear() - year;

  document.getElementById('d-brand').innerText = v.brand;
  document.getElementById('d-model').innerText = v.model;
  document.getElementById('d-year').innerText = year;
  document.getElementById('d-color').innerText = v.color;
  document.getElementById('d-price').innerText = v.price.toLocaleString();
  document.getElementById('d-age').innerText = age;
  document.getElementById('d-mileage').innerText = v.mileage.toLocaleString();
  document.getElementById('d-isAvailable').innerHTML = 
    `<span class="badge ${v.isAvailable ? 'badge-yes' : 'badge-no'}">${v.isAvailable ? 'Oui' : 'Non'}</span>`;
  
  document.getElementById('details').style.display = 'block';
  document.getElementById('form').style.display = 'none';
  document.getElementById('stats').style.display = 'none';
  document.getElementById('advanced').style.display = 'none';
}

function hideDetails() {
  document.getElementById('details').style.display = 'none';
  currentDetailId = null;
}

// ================= DELETE =================

function deleteVoiture(id) {
  if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
    socket.emit('voiture:delete', id);
  }
}

// ================= SEARCH =================

function searchVoiture() {
  searchText = document.getElementById('searchInput').value.toLowerCase();
  renderVoitures();
}

// ================= STATISTIQUES =================

function toggleStats() {
  const statsDiv = document.getElementById('stats');
  if (statsDiv.style.display === 'block') {
    hideStats();
  } else {
    loadStatistics();
  }
}

function hideStats() {
  document.getElementById('stats').style.display = 'none';
}

async function loadStatistics() {
  try {
    // Calculs locaux depuis les données déjà chargées
    const total = voitures.length;
    const available = voitures.filter(v => v.isAvailable).length;
    const unavailable = total - available;
    
    const avgPrice = total > 0 
      ? Math.round(voitures.reduce((sum, v) => sum + v.price, 0) / total)
      : 0;
    
    const avgMileage = total > 0
      ? Math.round(voitures.reduce((sum, v) => sum + v.mileage, 0) / total)
      : 0;

    const currentYear = new Date().getFullYear();
    const avgAge = total > 0
      ? Math.round(voitures.reduce((sum, v) => {
          const year = new Date(v.year).getFullYear();
          return sum + (currentYear - year);
        }, 0) / total)
      : 0;

    const statsContent = document.getElementById('statsContent');
    statsContent.innerHTML = `
      <div class="stat-card">
        <h4>Total Voitures</h4>
        <div class="value">${total}</div>
      </div>
      <div class="stat-card">
        <h4>Disponibles</h4>
        <div class="value">${available}</div>
      </div>
      <div class="stat-card">
        <h4>Vendues</h4>
        <div class="value">${unavailable}</div>
      </div>
      <div class="stat-card">
        <h4>Prix Moyen</h4>
        <div class="value">${avgPrice.toLocaleString()} €</div>
      </div>
      <div class="stat-card">
        <h4>Kilométrage Moyen</h4>
        <div class="value">${avgMileage.toLocaleString()} km</div>
      </div>
      <div class="stat-card">
        <h4>Âge Moyen</h4>
        <div class="value">${avgAge} ans</div>
      </div>
    `;

    document.getElementById('stats').style.display = 'block';
    document.getElementById('form').style.display = 'none';
    document.getElementById('details').style.display = 'none';
    document.getElementById('advanced').style.display = 'none';
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
    alert('❌ Erreur lors du chargement des statistiques');
  }
}

// ================= RECHERCHE AVANCÉE =================

function toggleAdvanced() {
  const advDiv = document.getElementById('advanced');
  if (advDiv.style.display === 'block') {
    hideAdvanced();
  } else {
    showAdvanced();
  }
}

function showAdvanced() {
  document.getElementById('advanced').style.display = 'block';
  document.getElementById('form').style.display = 'none';
  document.getElementById('details').style.display = 'none';
  document.getElementById('stats').style.display = 'none';
}

function hideAdvanced() {
  document.getElementById('advanced').style.display = 'none';
}

function applyAdvancedFilters() {
  const minPrice = document.getElementById('minPrice').value;
  const maxPrice = document.getElementById('maxPrice').value;
  const minYear = document.getElementById('minYear').value;
  const maxMileage = document.getElementById('maxMileage').value;

  let filtered = [...voitures];

  if (minPrice) {
    filtered = filtered.filter(v => v.price >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(v => v.price <= Number(maxPrice));
  }
  if (minYear) {
    filtered = filtered.filter(v => new Date(v.year).getFullYear() >= Number(minYear));
  }
  if (maxMileage) {
    filtered = filtered.filter(v => v.mileage <= Number(maxMileage));
  }

  renderVoitures(filtered);
  alert(`✅ ${filtered.length} voiture(s) trouvée(s)`);
}

function clearAdvancedFilters() {
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('minYear').value = '';
  document.getElementById('maxMileage').value = '';
  renderVoitures();
}

// ================= TRI =================

function sortByPrice(order) {
  const sorted = [...voitures].sort((a, b) => 
    order === 'ASC' ? a.price - b.price : b.price - a.price
  );
  renderVoitures(sorted);
  alert(`✅ Voitures triées par prix ${order === 'ASC' ? 'croissant' : 'décroissant'}`);
}

// ================= ACTIONS SUR DÉTAILS =================

async function applySimilar() {
  if (!currentDetailId) return;
  
  try {
    const response = await fetch(`/voitures/${currentDetailId}/similar`);
    const similar = await response.json();
    
    if (similar.length === 0) {
      alert('ℹ️ Aucune voiture similaire trouvée');
      return;
    }
    
    renderVoitures(similar);
    hideDetails();
    alert(`✅ ${similar.length} voiture(s) similaire(s) trouvée(s)`);
  } catch (error) {
    console.error('Erreur:', error);
    alert('❌ Erreur lors de la recherche de voitures similaires');
  }
}

async function applyDiscountPrompt() {
  if (!currentDetailId) return;
  
  const percentage = prompt('💸 Entrez le pourcentage de remise (ex: 10 pour 10%)');
  if (!percentage) return;
  
  const discount = Number(percentage);
  if (isNaN(discount) || discount <= 0 || discount > 100) {
    alert('❌ Pourcentage invalide (entre 1 et 100)');
    return;
  }
  
  try {
    const response = await fetch(`/voitures/${currentDetailId}/discount?percentage=${discount}`, {
      method: 'PATCH'
    });
    
    if (response.ok) {
      const updated = await response.json();
      voitures = voitures.map(v => v._id === currentDetailId ? updated : v);
      renderVoitures();
      hideDetails();
      alert(`✅ Remise de ${discount}% appliquée avec succès !`);
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('❌ Erreur lors de l\'application de la remise');
  }
}

async function markAsSoldAction() {
  if (!currentDetailId) return;
  
  if (!confirm('❌ Marquer cette voiture comme vendue ?')) return;
  
  try {
    const response = await fetch(`/voitures/${currentDetailId}/mark-sold`, {
      method: 'PATCH'
    });
    
    if (response.ok) {
      const updated = await response.json();
      voitures = voitures.map(v => v._id === currentDetailId ? updated : v);
      renderVoitures();
      hideDetails();
      alert('✅ Voiture marquée comme vendue');
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('❌ Erreur lors du marquage');
  }
}

async function markAsAvailableAction() {
  if (!currentDetailId) return;
  
  if (!confirm('✅ Marquer cette voiture comme disponible ?')) return;
  
  try {
    const response = await fetch(`/voitures/${currentDetailId}/mark-available`, {
      method: 'PATCH'
    });
    
    if (response.ok) {
      const updated = await response.json();
      voitures = voitures.map(v => v._id === currentDetailId ? updated : v);
      renderVoitures();
      hideDetails();
      alert('✅ Voiture marquée comme disponible');
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('❌ Erreur lors du marquage');
  }
}