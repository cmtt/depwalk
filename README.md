depwalk
-------

Sometimes, it can take a while to resolve dependencies when dealing with a codebase which depends on older modules. This module walks through npm's and bower's directories to check what was declared in the package.json files and what's currently there.

# Installation

````
  $ npm install -g depwalk
````

# Usage

Just execute this command in the project's root folder.

````
  $ depwalk
````

# ToDo

- improve the actual module overview
- add unit tests
- show a suggested command to resolve and save unmet dependencies
- annotations

# Licence

````
          DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                      Version 2, December 2004

   Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

   Everyone is permitted to copy and distribute verbatim or modified
   copies of this license document, and changing it is allowed as long
   as the name is changed.

              DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
     TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

    0. You just DO WHAT THE FUCK YOU WANT TO.
````

