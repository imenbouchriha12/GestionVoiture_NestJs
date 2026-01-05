const socket = io();
let voitures = [];
let editVoitureId = null;
let showOnlyAvailable = false;

// ================= SOCKET EVENTS =================

socket.on('connect', () => {
  socket.emit('voiture:findAll', null, renderVoitures);
});

socket.on('voiture:created', voiture => {
  voitures.push(voiture);
  renderVoitures();
});


socket.on('voiture:updated', updated => {
  voitures = voitures.map(v => v._id === updated._id ? updated : v);
  renderVoitures();
});

socket.on('voiture:deleted', id => {
  voitures = voitures.filter(v => v._id !== id);
  renderVoitures();
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

  // ✅ appliquer le filtre selon le bouton cliqué
  const list = showOnlyAvailable
    ? voitures.filter(v => v.isAvailable === true)
    : voitures;

  list.forEach(v => {
    const year = new Date(v.year).getFullYear();
    const age = isNaN(year)
      ? 'N/A'
      : new Date().getFullYear() - year;

    table.innerHTML += `
      <tr>
        <td>${v.brand}</td>
        <td>${v.model}</td>
        <td>${v.color}</td>
        <td>${v.year}</td>
        <td>${v.price}</td>
        <td>${age}</td>
        <td>${v.mileage}</td>
        <td>${v.isAvailable ? 'Yes' : 'No'}</td>
        <td>
          <button class="btn-edit" onclick="editVoiture('${v._id}')">Edit</button>
          <button class="btn-delete" onclick="deleteVoiture('${v._id}')">Delete</button>
          <button class="btn-details" onclick="showDetails('${v._id}')">Details</button>
        </td>
      </tr>
    `;
  });
}


// ================= FORM =================

function showForm() {
  editVoitureId = null;
  document.getElementById('formTitle').innerText = 'Add Voiture';
  document.getElementById('form').style.display = 'block';
  document.getElementById('details').style.display = 'none';
  clearForm();
}

function hideForm() {
  document.getElementById('form').style.display = 'none';
}

function clearForm() {
  ['brand','model','year','color','price']
    .forEach(id => document.getElementById(id).value = '');
}

function submitForm() {
  const voiture = {
    brand: brand.value,
    model: model.value,
    year: year.value,
    color: color.value,
    price: Number(price.value),
    mileage: Number(mileage.value),
    isAvailable: isAvailable.checked, // ✅ boolean true/false

  };

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
  isAvailable.value = v.isAvailable;


  document.getElementById('formTitle').innerText = 'Edit Voiture';
  document.getElementById('form').style.display = 'block';
  document.getElementById('details').style.display = 'none';
}

// ================= DETAILS =================

function showDetails(id) {
  const v = voitures.find(x => x._id === id);
  if (!v) return;

  document.getElementById('d-brand').innerText = v.brand;
  document.getElementById('d-model').innerText = v.model;
  document.getElementById('d-year').innerText = v.year;
  document.getElementById('d-color').innerText = v.color;
  document.getElementById('d-price').innerText = v.price;
  document.getElementById('d-mileage').innerText = v.mileage;
  document.getElementById('d-isAvailable').innerText = v.isAvailable;
  document.getElementById('details').style.display = 'block';
  document.getElementById('form').style.display = 'none';
}

function hideDetails() {
  document.getElementById('details').style.display = 'none';
}

// ================= DELETE =================

function deleteVoiture(id) {
  if (confirm('Delete this voiture ?')) {
    socket.emit('voiture:delete', id);
  }
}
