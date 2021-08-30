# pcb-miraheze-utility-scripts

quite possibly the worst javascript code ever written

"i would be lying if i said i don't regret writing this."

# Installation

Download git and npm:

- Debian and Derivatives:
  ```
  sudo apt install git npm
  ```
- Windows:
  ```
  winget install git npm
  ```
- Arch and Derivatives:
  ```
  sudo pacman -S git npm
  ```
- Fedora and Similar:
  ```
  sudo yum install git npm
  ```

Install Node.js version management:

```
npm i -g n
```

Install latest version of Node.js:

```
n latest
```

Clone this repository:

```
git clone https://github.com/Vizdun/pcb-miraheze-utility-scripts.git
```

Cd into it:

```
cd pcb-miraheze-utility-scripts
```

Install required packages:

```
npm install
```

Copy and rename "login.example.json" to "login.json":

```
cp login.example.json login.json
```

Configure "login.json":

```
vim login.json
```
