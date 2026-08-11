import os

file_path = 'index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Truncate at line 338 and append correct closing tags
lines = lines[:338]
closing_tags = [
    '      </div>\n',
    '    </div>\n',
    '\n',
    '  </div>\n',
    '\n',
    '  <!-- JavaScript -->\n',
    '  <script src="js/app.js?v=20260811_2344"></script>\n',
    '</body>\n',
    '</html>\n'
]
lines.extend(closing_tags)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
