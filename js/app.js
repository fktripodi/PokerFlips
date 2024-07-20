document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('tbody');
  const gameValueField = document.getElementById('game-value');
  const versionNumberElement = document.getElementById('version-number');
  const chipClickSound = document.getElementById('chip-sound');
  let selectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')) || [];

  const versionNumber = getComputedStyle(document.documentElement).getPropertyValue('--version-number').trim();
  versionNumberElement.textContent = versionNumber;

  const initialData = Array.from({ length: 8 }, () => ({
    players: '',
    wins: 0,
    button: '',
    w: 0,
    money: 0,
    d: 0,
    v: 0,
  }));

  const savePlayersToLocalStorage = () => {
    const players = [];
    tableBody.querySelectorAll('tr').forEach((tr) => {
      const player = {
        players: tr.querySelectorAll('input[type="text"]')[0].value,
        wins: parseInt(tr.querySelectorAll('input[type="text"]')[1].value, 10) || 0,
        money: parseFloat(tr.querySelectorAll('input[type="text"]')[4].value) || 0,
        w: parseFloat(tr.querySelectorAll('input[type="text"]')[3].value) || 0,
        d: parseFloat(tr.querySelectorAll('input[type="text"]')[5].value) || 0,
        v: parseFloat(tr.querySelectorAll('input[type="text"]')[6].value) || 0,
      };
      players.push(player);
    });
    localStorage.setItem('selectedPlayers', JSON.stringify(players));
  };

  const loadSelectedPlayers = () => {
    selectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')) || initialData;
    tableBody.innerHTML = ''; // Clear existing rows

    selectedPlayers.forEach((player, index) => {
      const tr = document.createElement('tr');

      Object.keys(player).forEach((column, i) => {
        const td = document.createElement('td');
        if (column === 'button') {
          const button = document.createElement('button');
          button.textContent = '+1';
          button.addEventListener('click', () => {
            const vValue = parseFloat(tr.querySelectorAll('input[type="text"]')[6].value) || 0;
            if (vValue > 0) {
              player.w += 1;
              player.money = player.w * vValue;
              savePlayersToLocalStorage();
              loadSelectedPlayers();
            }
          });
          td.appendChild(button);
        } else {
          const input = document.createElement('input');
          input.type = 'text';
          input.value = player[column] || '';
          input.addEventListener('input', () => {
            player[column] = input.value;
            savePlayersToLocalStorage();
          });
          td.appendChild(input);
        }
        tr.appendChild(td);
      });

      tableBody.appendChild(tr);
    });
  };

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const value = chip.getAttribute('data-value');
      gameValueField.value = value;
      const numericValue = parseFloat(value.replace('$', ''));
      selectedPlayers.forEach(player => {
        player.d = numericValue;
      });
      savePlayersToLocalStorage();
      chipClickSound.currentTime = 0;
      chipClickSound.play().catch(error => console.error('Audio playback failed:', error));
      loadSelectedPlayers();
    });
  });

  gameValueField.addEventListener('input', (e) => {
    if (!gameValueField.value.startsWith('$')) {
      gameValueField.value = '$' + gameValueField.value.replace(/^\$?/, '');
    }
    const numericValue = parseFloat(gameValueField.value.replace('$', ''));
    selectedPlayers.forEach(player => {
      player.d = numericValue;
    });
    savePlayersToLocalStorage();
  });

  loadSelectedPlayers();

  window.addEventListener('storage', (e) => {
    if (e.key === 'selectedPlayers') {
      loadSelectedPlayers();
    }
  });
});
