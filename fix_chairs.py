import os

file_path = 'js/app.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """      // 兒童人數變更時的處理
      if (rsvpChildren && groupBabyChair) {
        rsvpChildren.addEventListener('change', (e) => {
          if (e.target.value === '0') {
            groupBabyChair.style.display = 'none';
            document.getElementById('rsvp-baby-chair').value = '0'; // reset
          } else {
            groupBabyChair.style.display = 'block';
          }
        });
      }"""

replacement = """      // 兒童人數變更時的處理
      if (rsvpChildren && groupBabyChair) {
        rsvpChildren.addEventListener('change', (e) => {
          const numChildren = parseInt(e.target.value, 10);
          const babyChairSelect = document.getElementById('rsvp-baby-chair');
          
          if (numChildren === 0) {
            groupBabyChair.style.display = 'none';
            babyChairSelect.innerHTML = '<option value="0" selected>0 張</option>'; // reset
          } else {
            groupBabyChair.style.display = 'block';
            // 重新產生選項，最多不超過兒童數量
            const currentChairVal = parseInt(babyChairSelect.value, 10) || 0;
            babyChairSelect.innerHTML = '';
            for (let i = 0; i <= numChildren; i++) {
              const option = document.createElement('option');
              option.value = i;
              option.textContent = `${i} 張`;
              if (i === currentChairVal && currentChairVal <= numChildren) {
                option.selected = true;
              } else if (i === 0 && currentChairVal > numChildren) {
                // 如果原本選的數量大於現在的兒童數，重設為 0
                option.selected = true;
              }
              babyChairSelect.appendChild(option);
            }
          }
        });
      }"""

new_content = content.replace(target, replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
