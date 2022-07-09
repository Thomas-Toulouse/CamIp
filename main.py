#!/usr/bin/env python3

import gi
import numpy
import subprocess
import os
from subprocess import call
import configparser
gi.require_version('GstVideo', '1.0')
gi.require_version('Gst', '1.0')
#gi.require_version('GstRtspServer', '1.0')
gi.require_version('Gdk', '3.0')
gi.require_version('Gtk','3.0')
gi.require_version('Polkit','1.0')
from gi.repository import Polkit
from gi.repository import Gst, GLib, GObject,Gtk,Gio
from gi.repository import Gdk, GstVideo
Gst.init(None)

class UI(Gtk.Window):
    def __init__(self):
        print(Gdk.set_allowed_backends("wayland,x11"))
        os.environ['GDK_BACKEND'] = 'x11'
        print(os.environ)
        Gdk.set_allowed_backends("wayland,x11")
        app_name = "CamViewerRtsp"
            
        config_folder = os.path.join(os.path.expanduser("~"), '.config', app_name)
        config = configparser.ConfigParser()
        builder=Gtk.Builder
        Gtk.Window.__init__(self, title="Mode ")
        self.set_default_size(400, 200)
        grid = Gtk.Grid(row_spacing =10,column_spacing = 10,column_homogeneous = True)
        self.package_check()
        self.set_border_width(10)
       
    
        hostBtn = Gtk.Button(label="Host")
        hostBtn.connect("clicked",self.loadHost)
        
        serverBtn = Gtk.Button(label="Server")
        serverBtn.connect("clicked",self.loadServer)

        aboutSection = Gtk.AboutDialog()
        aboutSection.add_credit_section("About","me")
     
     

        hb = Gtk.HeaderBar()
        hb.set_show_close_button(True)
        hb.props.title = "Mode"
        self.set_titlebar(hb)
        
        #button = Gtk.Button()
        self.popover = Gtk.Popover()
        vbox = Gtk.Box(orientation=Gtk.Orientation.VERTICAL)
        vbox.pack_start(Gtk.ModelButton(label="About"), False, True, 10)
        vbox.pack_start(Gtk.Label(label="Item 2"), False, True, 10)
        vbox.show_all()
        self.popover.add(vbox)
        self.popover.set_position(Gtk.PositionType.BOTTOM)

        button = Gtk.MenuButton(popover=self.popover)
        icon = Gio.ThemedIcon(name="open-menu-symbolic")
        image = Gtk.Image.new_from_gicon(icon, Gtk.IconSize.BUTTON)
        button.add(image)
        hb.pack_end(button)
        

        

        #button = Gtk.MenuButton(label="Click Me", popover=self.popover)
        #outerbox.pack_start(button, False, True, 0)

       # grid.add(aboutSection)
        grid.add(hostBtn)
        grid.attach(serverBtn, 1, 0, 1, 1)
        self.add(grid)
      
    def loadHost(file,shellBool):
        file=os.path.dirname(os.path.abspath(__file__))+"/host.py"
        shellBool= False
        subprocess.Popen(file, shell=shellBool)
    
    def loadServer(file,shellBool):
        file=os.path.dirname(os.path.abspath(__file__))+"/server.py"
        shellBool= False
        subprocess.Popen(file, shell=shellBool)
    
    def MessageBox(self,title=str,text=str,type=str):
        if(type=="error"):
            dialog = Gtk.MessageDialog(
                transient_for=self,
                flags=0,
                message_type=Gtk.MessageType.INFO,
                buttons=Gtk.ButtonsType.OK,
                text=title,
            )
            dialog.format_secondary_text(
                text
            )
            dialog.run()
        elif(type == "Confirmation"):
                dialog = Gtk.MessageDialog(
                transient_for=self,
                flags=0,
                message_type=Gtk.MessageType.INFO,
                buttons=Gtk.ButtonsType.YES_NO,
                text=title,
            )
                dialog.format_secondary_text(
                    text
                )
                response = dialog.run()
                if response == Gtk.ResponseType.YES:
                    #os.system('pkexec')
                    os.system('pkexec pacman -S gst-libav gst-plugins-bad gst-plugins-good gst-plugins-ugly gst-rtsp-server --noconfirm')
                    #dialog.a
                    #spinner = Gtk.Spinner()
                    #spinner.start()
                    #os.system('y')
                    
            


       
        
        print( type +": dialog closed")

        dialog.destroy()

    def package_check(self):
        print(os.getlogin())
        pacmanCheck = os.system('command -v pacman >/dev/null')
        aptCheck = os.system('command -v apt >/dev/null')
        print(pacmanCheck)
        print(aptCheck) 
        
        if aptCheck != 256:
            listPackage= os.system('apt list --installed gstreamer-plugins-base gstreamer-plugins-good gstreamer-plugins-bad '
            'gstreamer-plugins-ugly gstreamer-libav'
            'libgstrtspserver-1.0-dev gstreamer1.0-rtsp')
            
            if listPackage != 256:
             
                print("completed")
                
            else:
                self.MessageBox("Missing Dependancy","Please verify that all dependancy packages are install","error")
                print("Please verify if all of thos package are install ")
    
        elif pacmanCheck != 256 :
            listPackage = os.system('pacman -Qe gst-libav gst-plugins-bad gst-plugins-good gst-plugins-ugly gst-rtsp-server')
            
            if listPackage != 256: 
                print("completed")
                #self.MessageBox("Missing Dependancy","Do you want to install the dependancy ?","Confirmation")
            else:
                self.MessageBox("Missing Dependancy","Do you want to install the dependancy ?","Confirmation")
                #self.MessageBox("Missing Dependancy","Please verify that all dependancy packages are install","error")
                print("Please verify if all of thos package are install ")

win = UI()
win.connect("destroy", Gtk.main_quit)
win.show_all()
Gtk.main()
