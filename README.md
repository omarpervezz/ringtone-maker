# 🎧 Ringtone Maker

A simple and fast web app to create custom ringtones from MP3 files. Upload your music, select the perfect snippet, preview it, and download your ringtone!

## ✨ Features

- 🎵 **Easy Upload** - Drag and drop or click to upload MP3 files
- ✂️ **Precise Selection** - Highlight exactly which part you want
- 👂 **Real-time Preview** - Listen before you save
- ⚡ **Fast Export** - Download as WAV instantly
- 📱 **Mobile Friendly** - Works on all devices
- 🎨 **Clean UI** - Modern design with dark waveform

## 🚀 Quick Start

### Installation

Just open `index.html` in your browser! No installation needed.

**Tip:** For best experience, use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.

### How to Use

1. **Upload** - Drag an MP3 file into the upload zone (or click to browse)
2. **Select** - Click and drag on the waveform to choose your snippet
3. **Preview** - Click "Play Selection" to hear what you picked
4. **Download** - Click "Make Ringtone" and your ringtone downloads as WAV

## 📁 Project Structure

```
ringtone-maker/
├── index.html       # Main UI and layout
├── app.js           # All the app logic
├── style.css        # Custom styles
└── README.md        # This file
```

## 💻 Tech Stack

- **HTML5** - Structure
- **CSS3 + Tailwind CSS** - Beautiful styling
- **JavaScript** - Core functionality
- **WaveSurfer.js** - Audio visualization
- **Web Audio API** - Audio processing

## 🎯 How It Works

1. Upload an MP3 file
2. App visualizes the waveform using WaveSurfer.js
3. You select a time range by dragging on the waveform
4. Preview the selected portion
5. Export the selection as a WAV ringtone file

## 📝 File Details

| File         | Purpose                                          |
| ------------ | ------------------------------------------------ |
| `index.html` | Page layout, upload zone, controls               |
| `app.js`     | Upload handling, waveform setup, ringtone export |
| `style.css`  | Tailwind + custom theme colors                   |

## ⚙️ Supported Formats

- **Input:** MP3
- **Output:** WAV

## 🌐 Browser Support

Works in all modern browsers:

- ✅ Chrome / Edge
- ✅ Firefox
- ✅ Safari

Requires support for:

- Web Audio API
- File API
- ES6 JavaScript

## �️ Roadmap & Upcoming Features

### Current Version (v1.0)

- ✅ MP3 upload support
- ✅ WAV export format
- ✅ Waveform visualization
- ✅ Real-time preview
- ✅ Mobile responsive

### Coming Soon (v2.0+)

- 🔜 **MP3 export** - Download ringtones in MP3 format
- 🔜 **More audio formats** - WAV, OGG, FLAC input support
- 🔜 **Audio effects** - Fade in/fade out, volume control
- 🔜 **Batch processing** - Create multiple ringtones at once
- 🔜 **Presets** - Quick ringtone length templates
- 🔜 **Theme options** - Dark mode and custom themes
- 🔜 **Touch gestures** - Better mobile editing experience

**Status:** This is an active hobby project! Regular updates are planned.

## 🙏 Credits & Acknowledgments

This project is built with these amazing open-source packages:

- **[WaveSurfer.js](https://wavesurfer.xyz/)** - Interactive audio waveform visualization
- **[WaveSurfer Regions Plugin](https://wavesurfer.xyz/)** - Audio region selection and manipulation
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Inter Font](https://fonts.google.com/specimen/Inter)** - Beautiful system font from Google Fonts
- **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** - Browser audio processing (built-in)

Special thanks to the open-source community! 🎉

## 🤝 Contributing

We'd love your help! Whether you're fixing bugs, adding features, or improving documentation, contributions are welcome.

### How to Contribute

1. **Fork** the repository
2. **Create a branch** for your feature (`git checkout -b feature/awesome-feature`)
3. **Make your changes** and test thoroughly
4. **Commit** with clear messages (`git commit -m 'Add awesome feature'`)
5. **Push** to your fork (`git push origin feature/awesome-feature`)
6. **Open a Pull Request** with a description of your changes

### Contribution Ideas

- 🐛 Fix bugs or improve stability
- ✨ Add new features from the roadmap
- 📚 Improve documentation
- 🎨 Enhance UI/UX design
- 💬 Suggest improvements via Issues
- 📱 Test on different devices and browsers

### Development Tips

- Use VS Code with Live Server for development
- Test audio file uploads thoroughly
- Ensure mobile responsiveness
- Follow the existing code style
- Comment your code clearly

### Questions or Suggestions?

Feel free to open an issue or discussion if you have ideas, questions, or found a bug!

---

## 📄 License

This hobby project is open for personal and educational use. Feel free to use, modify, and share!

## 🐛 Known Limitations

- MP3 upload only (not all audio formats)
- Very large files (30+ min) may be slow
- Everything runs in your browser (no cloud storage)

---

**Made with ❤️ as a hobby project**

Happy ringtone making! 🎵
