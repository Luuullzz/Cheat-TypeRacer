document.getElementById('mode').addEventListener('change', () => {
  console.log('changing mode');
  const mode = document.getElementById('mode').value;
  if (mode === 'manual') document.getElementById('timeInput').disabled = true;
  else document.getElementById('timeInput').disabled = false;
  console.log(document.getElementById('timeInput'));
});

document.getElementById('btnCheat').addEventListener('click', async () => {
  try {
    const mode = document.getElementById('mode').value;
    const time = document.getElementById('timeInput').value;
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.storage.sync.set({ tab, mode, time });

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
          if (event.key == 'n' && index < words.length)
            typeNextWord(words[index++], input);
        });
      }
    }; //end typeText

    const typeNextWord = (word, input) => {
      console.log(word);
      input.value += word;
    }; //end typeNextWord
  } catch (err) {
    console.log(err);
  }
}; //end extractRaceText
