import os

file_path = 'js/app.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """      let combinedNotes = [];
      if (attend === 'yes') {
        const guestsVal = document.getElementById('rsvp-guests').value;
        const childrenVal = document.getElementById('rsvp-children') ? document.getElementById('rsvp-children').value : '0';
        const chairVal = document.getElementById('rsvp-baby-chair') ? document.getElementById('rsvp-baby-chair').value : '0';
        
        let adultsText = guestsVal === '5' ? '5人以上' : `${guestsVal}人`;
        let childrenText = childrenVal === '0' ? '' : ` / 兒童:${childrenVal}人`;
        let chairText = (childrenVal !== '0' && chairVal !== '0') ? `(需${chairVal}張兒童椅)` : '';
        
        let guestsText = `大人:${adultsText}${childrenText}${chairText}`;
        
        formData.append('entry.347691862', guestsText);
        
        const diet = document.getElementById('rsvp-diet').value.trim();
        if (diet) combinedNotes.push(`備註/飲食: ${diet}`);
        if (blessing) combinedNotes.push(`給我們的話: ${blessing}`);
      } else {
        if (blessing) combinedNotes.push(`給我們的話: ${blessing}`);
      }"""

replacement = """      let combinedNotes = [];
      if (attend === 'yes') {
        const guestsVal = document.getElementById('rsvp-guests').value;
        const childrenVal = document.getElementById('rsvp-children') ? document.getElementById('rsvp-children').value : '0';
        const chairVal = document.getElementById('rsvp-baby-chair') ? document.getElementById('rsvp-baby-chair').value : '0';
        
        let adultsText = guestsVal === '5' ? '5人以上' : `${guestsVal}人`;
        let childrenText = childrenVal === '0' ? '' : ` / 兒童:${childrenVal}人`;
        let chairText = (childrenVal !== '0' && chairVal !== '0') ? `(需${chairVal}張兒童椅)` : '';
        
        let guestsText = `大人:${adultsText}${childrenText}${chairText}`;
        
        formData.append('entry.347691862', guestsText);
        
        const diet = document.getElementById('rsvp-diet').value.trim();
        if (diet) combinedNotes.push(`備註/飲食: ${diet}`);
        if (blessing) combinedNotes.push(`給我們的話: ${blessing}`);
      } else {
        formData.append('entry.347691862', '0人');
        if (blessing) combinedNotes.push(`給我們的話: ${blessing}`);
      }"""

new_content = content.replace(target, replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
