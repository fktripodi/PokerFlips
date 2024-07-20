document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('tbody');

  // Load existing players from local storage
  const savedPlayers = JSON.parse(localStorage.getItem('players')) || [];

  // Initial data for the player page
  const initialData = Array.from({ length: 8 - savedPlayers.length }, () => ({
    inOut: false,
    players: '',
    playerValue: '',
    previousMoney: '',
    d: '',
  })).concat(savedPlayers);

  // Save players to local storage
  const savePlayersToLocalStorage = () => {
    const players = [];
    tableBody.querySelectorAll('tr').forEach((tr) => {
      const player = {
        inOut: tr.querySelector('input[type="checkbox"]').checked,
        players: tr.querySelectorAll('input[type="text"]')[0].value,
        playerValue: tr.querySelectorAll('input[type="text"]')[1].value,
        previousMoney: tr.querySelectorAll('input[type="text"]')[2].value,
        d: tr.querySelectorAll('input[type="text"]')[3].value,
      };
      players.push(player);
    });
    localStorage.setItem('players', JSON.stringify(players));
    updateSelectedPlayersOnMainPage();
  };

  // Update selected players on the main page
  const updateSelectedPlayersOnMainPage = () => {
    const selectedPlayers = [];
    tableBody.querySelectorAll('tr').forEach((tr) => {
      if (tr.querySelector('input[type="checkbox"]').checked) {
        const playerName = tr.querySelectorAll('input[type="text"]')[0].value;
        selectedPlayers.push({ name: playerName });
      }
    });
    localStorage.setItem('selectedPlayers', JSON.stringify(selectedPlayers));
    window.dispatchEvent(new Event('storage')); // Trigger storage event to update the main page
  };

  // Generate table rows
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
        if (column === 'players') {
          input.addEventListener('input', savePlayersToLocalStorage);
        }
        if (column === 'playerValue') {
          input.classList.add('player-value-cell'); // Add class to player value cells
          input.addEventListener('focus', (e) => {
            e.target.select();
          });
          input.addEventListener('input', (e) => {
            if (!e.target.value.startsWith('$')) {
              e.target.value = '$' + e.target.value.replace(/^\$?/, '');
            }
            input.style.backgroundColor = '#FFFF99'; // Highlight the cell
            savePlayersToLocalStorage();
          });
          input.addEventListener('blur', (e) => {
            setTimeout(() => {
              input.style.backgroundColor = ''; // Remove highlight after a short delay
            }, 200);
          });
        }
        td.appendChild(input);
      }

      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });

  // Initial update for selected players on the main page
  savePlayersToLocalStorage();
});

// Add this function at the bottom of Player.js
function clearData() {
  localStorage.removeItem('players');
  localStorage.removeItem('selectedPlayers');
  location.reload(); // Reload the page to reflect changes
}
