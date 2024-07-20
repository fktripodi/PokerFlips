document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('tbody');

  const savedPlayers = JSON.parse(localStorage.getItem('players')) || [];

  const initialData = Array.from({ length: 8 - savedPlayers.length }, () => ({
    inOut: false,
    players: '',
    d: '',
  })).concat(savedPlayers);

  const savePlayersToLocalStorage = () => {
    const players = [];
    tableBody.querySelectorAll('tr').forEach((tr) => {
      const player = {
        inOut: tr.querySelector('input[type="checkbox"]').checked,
        players: tr.querySelectorAll('input[type="text"]')[0].value,
        d: parseFloat(tr.querySelectorAll('input[type="text"]')[1].value) || 0,
      };
      players.push(player);
    });
    localStorage.setItem('players', JSON.stringify(players));
  };

  initialData.forEach((row) => {
    const tr = document.createElement('tr');

    Object.keys(row).forEach((column) => {
      const td = document.createElement('td');

      if (column === 'inOut') {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = row[column];
        input.classList.add('checkbox-size');
        input.addEventListener('change', (e) => {
          row[column] = e.target.checked;
          savePlayersToLocalStorage();
        });
        td.appendChild(input);
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = row[column];
        td.appendChild(input);
      }

      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });

  savePlayersToLocalStorage();
});

function clearData() {
  localStorage.removeItem('players');
  localStorage.removeItem('selectedPlayers');
  localStorage.removeItem('selectedPlayerValues');
  location.reload();
}
