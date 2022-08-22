#This is my first makefile
PYTHON = python3
PIP = pip3
# .PHONY defines parts of the makefile that are not dependant on any specific file
# This is most often used to store functions
.PHONY = install







install:

	mkdir ~/.config/MagicEye
	$(PYTHON) settings.py
	pyinstaller --hidden-import settings  -n 'Magic Eye' --onefile MagicEye.py
	mv  MagicEye-icon  ~/.local/share/icons
	chmod +x 'Magic Eye.desktop'
	mv 'Magic Eye.desktop' ~/.local/share/applications/
	cp 'dist/Magic Eye' /usr/local/bin

uninstall:
	rm -rf ~/.config/MagicEye
	rm -rf ~/.local/share/icons/ MagicEye-icon
	rm -rf ~/.local/share/applications/'Magic Eye.desktop'
	rm -rf /usr/local/bin/'Magic Eye'

update:
	rm -rf /usr/local/bin/'Magic Eye'
	pyinstaller --hidden-import settings  -n 'Magic Eye' --onefile MagicEye.py
	cp 'dist/Magic Eye' /usr/local/bin
# In this context, the *.project pattern means "anything that has the .project extension"
