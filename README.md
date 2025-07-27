# 📄 PDF Slicer & Merger

A simple web application to slice and merge PDF files directly in your browser. No uploads, no servers - everything happens locally on your device!

## ✨ What Can It Do?

- **Slice PDFs**: Extract specific pages (e.g., pages 1-5 or 1,3,7)
- **Merge PDFs**: Combine multiple PDF files into one
- **Drag & Drop**: Simply drag files to upload them
- **Reorder Files**: Drag to change the order before merging
- **Mobile Friendly**: Works on phones, tablets, and computers

## � How to Use

### Step 1: Start the Application
Open your terminal and run:
```bash
cd /path/to/pdf-slicer-merger
python3 -m http.server 3000
```

Then open your browser and go to: **http://localhost:3000**

### Step 2: Upload PDF Files
- Drag and drop PDF files onto the upload area, OR
- Click "Browse Files" to select PDFs from your computer

### Step 3: Choose Your Action

**To Slice a PDF:**
1. Click the "Slice PDF" tab
2. Select which PDF to slice
3. Enter page numbers:
   - Single pages: `1,3,7`
   - Page ranges: `1-5`
   - Mixed: `1,3-7,10`
4. Click "Slice PDF"
5. Your new PDF downloads automatically!

**To Merge PDFs:**
1. Upload multiple PDF files
2. Click the "Merge PDFs" tab
3. Drag files to reorder them if needed
4. Click "Merge PDFs"
5. Your merged PDF downloads automatically!

## 🛠️ Requirements

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (to run the local server)

## 📱 Device Support

- ✅ Desktop computers
- ✅ Laptops
- ✅ Tablets
- ✅ Smartphones

## 🔒 Privacy & Security

- **100% Local**: All processing happens in your browser
- **No Uploads**: Your PDFs never leave your device
- **No Storage**: Files are not saved anywhere
- **No Internet Required**: Works offline after initial load

## 🆘 Troubleshooting

**Can't upload files?**
- Make sure you're using http://localhost:3000 (not opening the HTML file directly)
- Check that your files are actually PDF format

**Page numbers not working?**
- Use numbers starting from 1 (not 0)
- Make sure page numbers don't exceed your PDF's total pages
- Use commas for individual pages: `1,3,5`
- Use dashes for ranges: `1-10`

**App not loading?**
- Check if Python is installed: `python3 --version`
- Try a different port: `python3 -m http.server 8000`
- Make sure no other app is using port 3000

## 📁 Project Files

```
pdf-slicer-merger/
├── index.html    # Main application
├── app.js        # Core functionality
├── demo.html     # Tutorial page
└── start.sh      # Easy launch script
```

## 🚀 Quick Start Script

For easier launching, you can use the provided script:
```bash
./start.sh
```

This will automatically start the server and open your browser!

## � Technologies Used

- **HTML5** - Structure
- **JavaScript** - Functionality  
- **Tailwind CSS** - Styling
- **pdf-lib** - PDF processing
- **Font Awesome** - Icons

## � License

Free to use, modify, and share!

---

**Made with ❤️ for easy PDF management**

Need help? Check out the demo page at http://localhost:3000/demo.html
