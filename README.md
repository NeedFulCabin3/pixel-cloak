# Pixel Cloak

A zero-backend client engine for hiding secret text payloads inside standard image pixel bit arrays without altering visual appearance.

## Overview

Sending sensitive plain text over standard channels leaves a clear paper trail. pixel-cloak solves this by mutating the least significant bits (LSB) of raw image RGBA arrays to store encoded binary payloads inside standard PNG files. Processing happens 100% inside your browser session, meaning zero bytes of your imagery or text ever touch an external server.

## How It Works

1. **Upload & Render**: An input image gets drawn onto an HTML5 Canvas to expose raw pixel data through the 2D Context API.
2. **Binary Conversion**: Text characters are converted to 8-bit binary strings, appended with an `8-bit zero byte` (`00000000`) delimiter to mark the payload end.
3. **Bitwise Injection**: The engine loops over every color byte, applying `(data[i] & 0xFE) | bit` to overwrite the lowest bit of the channel with the payload bit.
4. **Extraction**: The decoder reads each pixel byte, extracts bit 0 via `data[i] & 1`, reconstructs original character codes, and halts execution when reading the zero-byte sentinel.

## Key Features

* **LSB Mutation**: Modifies channel values by a delta of 1 unit max, keeping changes invisible to the human eye.
* **Lossless PNG Export**: Generates raw Data URLs forcing PNG downloads to preserve pixel data against aggressive lossy compression.
* **Client-Only Processing**: Everything executes within local V8 JavaScript thread context; no remote uploads occur.
* **Automatic Sentinel Termination**: Injects a custom null-byte sequence at payload ends to prevent parsing random noise.

## Tech Stack Breakdown

* **HTML5 Canvas API**: Renders spatial pixel canvases and pulls raw array buffers via `getImageData()`.
* **Vanilla JavaScript (ES6+)**: Handles array manipulation, binary bit shifting, DOM operations, and memory downloads.
* **CSS Grid & Flexbox**: Structures responsive split-card layout views for encoding and decoding pipelines.

## Prerequisites & Web-Based Quick Start

You only need a modern web browser (Chrome, Firefox, Safari, Edge).

### Running in GitHub Codespaces (Browser Only)
1. Press `.` on your keyboard while viewing this repository to launch GitHub Dev / Codespaces.
2. Right-click `index.html` in the file explorer sidebar.
3. Select **Open with Live Server** (or install the Live Preview extension) to run the tool instantly inside your browser tab.

### Local Setup
1. Download or clone this repository.
2. Open `index.html` directly inside any browser.

## Project Structure

```text
pixel-cloak/
├── .github/
│   └── workflows/
│       └── linter.yml       # Automated HTML/CSS/JS sanity checks
├── index.html               # Main application view & structure
├── script.js                # Core LSB bitwise encoding and decoding logic
├── style.css                # Interface layout and card styles
├── .gitignore               # Ignored build & OS junk
└── LICENSE                  # MIT License
```

## Roadmap

[ ] Add AES-256 password encryption prior to LSB injection.

[ ] Implement multi-channel selection (e.g., target only Alpha or Green channels).

[ ] Add a visual difference preview tab showing mutated pixel locations.

[ ] Support drag-and-drop file uploading zones.

```"Privacy isn't about hiding bad things; it's about protecting what makes us human."```
