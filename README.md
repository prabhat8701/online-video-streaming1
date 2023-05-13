# CarsonTV

CarsonTV is a user-populated media viewer. You can access it at https://blakewintermute.github.io/CarsonTV It is primarily built for parents who want to tailor their kids viewing to specific contents, without just handing them a bunch of files to watch. It remembers your progress through a film and where you are in a tv show. All the content CarsonTV can access is defined by a JSON file. This includes not only the pointers(something we'll define later) but also the ratings, descriptions, and other meta-data. It works best with IPFS but can use basic HTTP as well.

## Getting Started

 To get started, you will need to make this JSON file. To do so, clone the repo and use the DataGenerator/main.py file. Open it and edit the custom settings. This includes the path to the folder of your data (remember to use double backslash instead of slash if you're on windows), your header, and the location of your IPFS executable. ('ipfs' if it is in your path)
 
 If you are using IPFS, you will likely want to make your header: "http://ipfs.io/ipfs/"
 If you are using a custom HTTP server, use "http://IP_OF_SERVER:PORT/"
 
You man also want to edit the getPointer function. By default, it returns the IPFS raw-leaves hash. If you are using an HTTP server, have it return the simple relative path.
 
Most likely the only thing you will have to do is edit your inputDirectory.

### Prerequisites

As the script collects much of the metadata for you, there are quite a few libraries it needs:

```
json
os
requests
PIL/pillow (good luck installing)
imdbpie
glob
cv2 (good luck)
subprocess

```

### Directory Structure
main.py assumes a certain directory structure. For the tall and wide images, main.py will attempt to get images from the internet if it doesn't find them, but these will be lower quality, and it CANNOT GET ALL OF THEM, specifically wide images for TV Shows. If there isn't a file matching the name wide.* in each tv show's folder, it will error out. 
    
     .
    ├── Movies                    
    │   ├── MovieName1
    │   │   ├──moviefile.mp4                          # Must follow *.mp4 naming
    │   │   ├──trailerfile.trailer                    # Must follow *.trailer naming
    │   │   ├──wide.jpg/png/gif/whatever              # must follow wide.* naming
    │   │   ├──tall.jpg/png/gif/whatever              # Must follow tall.* naming
    │   └── MoviesName2 
    │   │   ├──etc...
    ├── Series                  
    │   ├── SeriesName1          
    │   │   ├──wide.jpg/png/gif/whatever              # must follow wide.* naming
    │   │   ├──tall.jpg/png/gif/whatever              # Must follow tall.* naming  
    │   │   ├──seasons
    │   │   │  ├──01 - Season 1                       #(two digit season numbering) 01 - SeasonName
    │   │   │  │  ├──01 EpisodeName
    │   │   │  │  │  ├──episodefile.mp4              # Must follow *.mp4 naming
    │   │   │  │  │  ├──tall.jpg/png/gif/whatever    # Must follow tall.* naming
    │   │   │  │  ├──02 EpisodeName 
    │   │   │  │  │  ├──episodefile.mp4              # Must follow *.mp4 naming
    │   │   │  │  │  ├──tall.jpg/png/gif/whatever    # Must follow tall.* naming
    │   │   │  │  ├──03 EpisodeName
    │   │   │  │  │  ├──episodefile.mp4              # Must follow *.mp4 naming
    │   │   │  │  │  ├──tall.jpg/png/gif/whatever    # Must follow tall.* naming
    │   │   │  ├──02 - Season 2                     
    │   │   │  ├──03 - Season 3
    │   └── SeriesName2 

## Runing main.py

While main.py is running, it will ask you if the title it found on IMDb is correct. For example, it might say Shrek (2001) == Shrek, if your foldername was "Shrek (2001)". If it is correct, press enter. If it is incorrect, press "n" then enter and paste in the IMDb ID (the string starting with tt in the URL of the IMDb page) For example www.imdb.com/title/tt0303461/. It will take a long time to run if you are using IPFS as it has to hash every file, but don't worry if it errors out for any reason. It saves it's progress constantly!

## Deployment

After organizing your data, and running main.py, you will have a file named 'fileDump.json' in the same folder as main.py. When you open the website for the first time, or any other time by clicking the gears in the top right, you will be presented with a popup asking you to load your JSON file. If you choose to redo this process, to add more content, or to change something, beware you will lose your ALL your progression saves, as they are stored locally in the browser. 

## Built With

* SKRN Media Streaming - Template
* Bootstrap - Front-End Framework
* Vue.js - Used to dynamically render everything.

## Contributing

If you want to contribute feel free to contact me. 
 

## Authors

* **Blake Wintermute**


## License

This project is licensed under the MIT License

## Acknowledgments

* Thanks to my nephew. A small project for you turned into this. 
