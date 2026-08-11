import os

file_path = 'js/app.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """      // 3. 顯示前端成功彈窗
      if (attend === 'yes') {
        const guestsVal = document.getElementById('rsvp-guests').value;
        successMessage.innerHTML = `親愛的 <strong>${name}</strong>，<br>已為你登記 <strong>${guestsVal} 位</strong> 出席！<br>期待婚宴當天與你相聚，共度這份幸福 💍`;
      } else {"""

replacement = """      // 3. 顯示前端成功彈窗
      if (attend === 'yes') {
        const guestsVal = document.getElementById('rsvp-guests').value;
        const childrenVal = document.getElementById('rsvp-children') ? document.getElementById('rsvp-children').value : '0';
        
        let adultsText = guestsVal === '5' ? '5位以上大人' : `${guestsVal}位大人`;
        let childrenText = childrenVal === '0' ? '' : `，${childrenVal}位兒童`;
        
        successMessage.innerHTML = `親愛的 <strong>${name}</strong>，<br>已為你登記 <strong>${adultsText}${childrenText}</strong> 出席！<br>期待婚宴當天與你相聚，共度這份幸福 💍`;
      } else {"""

new_content = content.replace(target, replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
