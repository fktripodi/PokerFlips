document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('tbody');
  const gameValueField = document.getElementById('game-value');
  const versionNumberElement = document.getElementById('version-number');
  const chipClickSound = document.getElementById('chip-sound');
  let selectedPlayerIndex = null; // This will store the index of the selected player

  // Read version number from CSS variable
  const versionNumber = getComputedStyle(document.documentElement).getPropertyValue('--version-number').trim();
  versionNumberElement.textContent = versionNumber;

  // Initial data
  const initialData = Array.from({ length: 8 }, () => ({
    wins: '',
    players: '',
    w: '',
    money: '',
    d: '',
    v: '',
  }));

  // Generate table rows
  initialData.forEach((row, index) => {
    const tr = document.createElement('tr');

    Object.keys(row).forEach((column) => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = row[column];
      input.addEventListener('input', (e) => {
        row[column] = e.target.value;
        if (column === 'players') {
          saveSelectedPlayers();
        }
      });

      // Highlight all text when clicking on the V column and reinstate dollar sign
      if (column === 'v') {
        input.addEventListener('click', (e) => {
          e.target.select();
        });

        input.addEventListener('input', (e) => {
          if (!e.target.value.startsWith('$')) {
            e.target.value = '$' + e.target.value.replace(/^\$?/, '');
          }
          saveSelectedPlayers();
        });
      }

      td.appendChild(input);
      tr.appendChild(td);
    });

    tr.addEventListener('click', () => {
      selectedPlayerIndex = index; // Set the selected player index when the row is clicked
      document.querySelectorAll('tr').forEach((tr) => tr.classList.remove('selected'));
      tr.classList.add('selected');
    });

    tableBody.appendChild(tr);
  });

  // Load selected players from local storage
  const loadSelectedPlayers = () => {
    const selectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')) || [];
    const selectedPlayerValues = JSON.parse(localStorage.getItem('selectedPlayerValues')) || [];
    tableBody.querySelectorAll('tr').forEach((tr, index) => {
      if (selectedPlayers[index]) {
        tr.querySelectorAll('input[type="text"]')[1].value = selectedPlayers[index].name;
        tr.querySelectorAll('input[type="text"]')[5].value = selectedPlayerValues[index] || '';
      } else {
        tr.querySelectorAll('input[type="text"]')[1].value = '';
        tr.querySelectorAll('input[type="text"]')[5].value = '';
      }
    });
  };

  // Save selected players to local storage
  const saveSelectedPlayers = () => {
    const selectedPlayers = [];
    const selectedPlayerValues = [];
    tableBody.querySelectorAll('tr').forEach((tr) => {
      const playerName = tr.querySelectorAll('input[type="text"]')[1].value;
      const playerValue = tr.querySelectorAll('input[type="text"]')[5].value;
      if (playerName.trim() !== '') {
        selectedPlayers.push({ name: playerName });
        selectedPlayerValues.push(playerValue);
      }
    });
    localStorage.setItem('selectedPlayers', JSON.stringify(selectedPlayers));
    localStorage.setItem('selectedPlayerValues', JSON.stringify(selectedPlayerValues));
  };

  // Add click event to chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const value = chip.getAttribute('data-value');
      gameValueField.value = value;
      localStorage.setItem('gameValue', value); // Store game value in localStorage
      chipClickSound.currentTime = 0; // Reset audio to start
      chipClickSound.play().catch(error => console.error('Audio playback failed:', error));

      // Update the "V" column for rows where a name exists
      tableBody.querySelectorAll('tr').forEach((tr) => {
        const playerName = tr.querySelectorAll('input[type="text"]')[1].value;
        if (playerName.trim() !== '') {
          tr.querySelectorAll('input[type="text"]')[5].value = value;
        }
      });
      saveSelectedPlayers();
    });
  });

  // Highlight all text when clicking on the game-value field
  gameValueField.addEventListener('click', () => {
    gameValueField.select();
  });

  // Add dollar sign automatically in front of new value in game value field
  gameValueField.addEventListener('input', (e) => {
    if (!gameValueField.value.startsWith('$')) {
      gameValueField.value = '$' + gameValueField.value.replace(/^\$?/, '');
    }
    localStorage.setItem('gameValue', gameValueField.value); // Update game value in localStorage on input
  });

  // Initialize game value with the stored value
  const initialGameValue = localStorage.getItem('gameValue') || '';
  gameValueField.value = initialGameValue;

  // Load selected players on page load
  loadSelectedPlayers();

  // Listen for storage events to update selected players
  window.addEventListener('storage', (e) => {
    if (e.key === 'selectedPlayers' || e.key === 'selectedPlayerValues') {
      loadSelectedPlayers();
    }
  });

  // Load selected players on page load
  loadSelectedPlayers();
});
