#/usr/bin/sh
echo "installing Camip..."
chmod +x Camip.desktop
cd Camip
chmod +x *.py
cd ..
sudo  cp -a Camip/.  /usr/bin
cp -a Camip/  ~/.local/bin
cp Camip.desktop ~/.local/share/applications
echo -n "Do you want Camip on your desktop? [y/n]"
read
         if [[ $REPLY == "y" || $REPLY ==  "Y"  || $REPLY == "yes" ]]; then
                 cp Camip.desktop ~/Desktop
                 alias camip='python /usr/bin/camip.py' >> ~/.bashrc
                 echo "installation completed"  
                 break
         fi
         if [[  $REPLY == "n" || $REPLY == "N" || $REPLY == "no" ]];then
                alias camip='python /usr/bin/camip.py' >> ~/.bashrc
                echo "installation completed"  
                exit
         fi
        if [[ $REPLY != "y" || $REPLY != "Y" || $REPLY != "yes" || $REPLY != "n" || $REPLY != "N" || $REPLY == "no" ]];then
                echo -e "\e[0;31m"Error:Invalid input.  " \e[m""Do you want Camip on your desktop? [y/n]"
                read
                fi
