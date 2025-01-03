![image](https://github.com/user-attachments/assets/1c55a6d7-6ddd-4f01-9fcb-fc723d0bd61f)

# ReactSynth

ReactSynth is a small project I started to learn React and ReactFlow. It's a minimal wrapper around the WebAudio API, which I hope can eventually generate WebAudio JS code of a sound by building it with nodes.

## Live Demo

Try the live version here: [ReactSynth](https://brainshift.design/reactsynth)

## Installation

To set up the project locally, follow these steps:

```sh
# Clone the repository
git clone https://github.com/brainshift-design/ReactSynth
cd reactsynth

# Install dependencies
npm install

# Start the development server
npm run dev
```

This will start the development server, and you can access the app at `http://localhost:5173/` by default.

## Project Structure
```
reactsynth/
├── src/
│   ├── assets/         # Static assets
│   ├── audio/          # Audio-related logic
│   ├── components/     # UI components
│   ├── hooks/          # Custom React hooks
│   ├── nodes/          # Modular synthesis nodes
│   ├── parameters/     # Parameter handling
│   └── App.module.css  # Main styles
│
├── index.html          # Main entry point
├── package.json        # Project metadata & dependencies
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── LICENSE             # License file
└── README.md           # Project documentation
```

## Build & Deploy

To build the project for production:

```sh
npm run build
```

This will generate optimized assets in the `dist/` folder. Then I just FTP the `dist/` folder to my server. :)

## Contributing

Pull requests are welcome! Please open an issue first to discuss any changes.

## License

This project is licensed under the terms of the MIT License. See the [LICENSE](./LICENSE) file for details.

---

Happy Synthesizing! 🎛️🎵

