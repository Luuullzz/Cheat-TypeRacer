const timeInput = document.getElementById('timeInput');
chrome.storage.sync.get(['time'], (result) => {
  timeInput.value = result.time;
});

const modeSelect = document.getElementById('mode');
chrome.storage.sync.get(['mode'], (result) => {
  modeSelect.value = result.mode;
  const keydownEvent = new Event('change');
  modeSelect.dispatchEvent(keydownEvent);
});

timeInput.addEventListener('change', (event) => {
  chrome.storage.sync.set({ time: event.target.value });
});

document.getElementById('mode').addEventListener('change', () => {
  const mode = document.getElementById('mode').value;
  chrome.storage.sync.set({ mode });
  if (mode === 'manual') {
    document.getElementById('timeInput').disabled = true;
    const alert = document.querySelector('.alert');
    alert.style.display = 'block';
    alert.innerText = 'Press Ctrl + / for typing';
    setTimeout(() => {
      alert.style.display = 'none';
    }, 1500);
  } else document.getElementById('timeInput').disabled = false;
});

document.getElementById('btnCheat').addEventListener('click', async () => {
  try {
    const mode = document.getElementById('mode').value;
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.storage.sync.set({ tab, mode });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractRaceText,
    });
  } catch (err) {
    console.log('catch error');
    console.log(err);
  }
});

extractRaceText = async (tab, mode, time) => {
  try {
    chrome.storage.sync.get(['tab', 'mode', 'time'], function (result) {
      tab = result.tab;
      mode = result.mode;
      time = result.time;

      if (!tab.url.includes('play.typeracer.com')) {
        alert(
          'Sorry you are not on TypeRacer website\nGo on start new race and CHEAT :b'
        );
        return;
      }

      const timeDisplay = document.querySelector('.timeDisplay');
      const startingIn = timeDisplay.querySelector('.time');
      if(!startingIn.getAttribute('title') && mode !== 'manual') {
        alert('Race hasn\'t started yet');
        return ;
      }

      const inputPanel = document.querySelector('.inputPanel');
      if (!inputPanel) return;
      const tds = inputPanel.querySelectorAll('[align="left"]');
      const texttd = tds[1];
      const text = texttd.textContent;
      const input = document.querySelector('.txtInput');
      typeText(text, input, mode, time * 1);
    });

    const typeText = (text, input, mode, time) => {
      let words = text.split(' ');
      words = words.map((el) => (el += ' '));
      let index = 0;

      if (mode === 'auto') {
        const itervalID = setInterval(() => {
          typeNextWord(words[index++], input);
          if (index == words.length) clearInterval(itervalID);
        }, time);
      } else if (mode === 'manual') {
        document.addEventListener('keydown', (event) => {
          if (event.key == '/' && event.ctrlKey && index < words.length)
            typeNextWord(words[index++], input);
        });
      }
    }; //end typeText

    const typeNextWord = (word, input) => {
      input.value += word;
    }; //end typeNextWord
  } catch (err) {
    console.log(err);
  }
}; //end extractRaceText
