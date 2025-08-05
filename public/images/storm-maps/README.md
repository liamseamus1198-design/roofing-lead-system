# 🌩️ Storm Maps Integration Guide

## 📸 **How to Add Your Storm Map Images**

### **Step 1: Prepare Your Storm Map Images**
You need 4 storm map screenshots from your weather tracking system:

1. **storm-map-1.jpg** - Rain intensity map (showing 1.00" rain/hour in Barefoot Bay)
2. **storm-map-2.jpg** - Hail detection map (showing 0.5" hail in Vero Beach)  
3. **storm-map-3.jpg** - Wind gust map (showing 60mph wind gusts in Fellsmere)
4. **storm-map-4.jpg** - Overall storm coverage map (complete system coverage)

### **Step 2: Save Images to This Directory**
**Option A: Drag & Drop (Easiest)**
1. Open Finder
2. Navigate to: `/Users/liamoshaughnessy/roofing-lead-system/public/images/storm-maps/`
3. Drag and drop your 4 storm map images
4. Rename them to: `storm-map-1.jpg`, `storm-map-2.jpg`, `storm-map-3.jpg`, `storm-map-4.jpg`

**Option B: Terminal Commands**
```bash
# Navigate to the storm-maps directory
cd /Users/liamoshaughnessy/roofing-lead-system/public/images/storm-maps/

# Copy your images (replace with your actual file paths)
cp ~/Downloads/your-rain-map.jpg storm-map-1.jpg
cp ~/Downloads/your-hail-map.jpg storm-map-2.jpg
cp ~/Downloads/your-wind-map.jpg storm-map-3.jpg
cp ~/Downloads/your-coverage-map.jpg storm-map-4.jpg
```

### **Step 3: Image Requirements**
- **Format**: JPG or PNG
- **Size**: 800x600px or larger
- **Quality**: High resolution for professional appearance
- **Content**: Storm radar overlays showing purple rain areas, hail detection, wind patterns

### **Step 4: Test the Integration**
1. Make sure your server is running: `node server.js`
2. Go to http://localhost:8080
3. Scroll down to "Real Storm Maps - Your Area Affected"
4. Click "View Rain Map", "View Hail Map", etc.
5. Your actual storm maps should now appear in the modal popups!

## ✅ **Expected Result**
Once properly saved, users will see your real storm maps when they click the buttons, creating maximum credibility and urgency for your lead generation system.

## 🆘 **Need Help?**
If you're having trouble:
1. Make sure the image files are named exactly: `storm-map-1.jpg`, `storm-map-2.jpg`, etc.
2. Check that the images are in the correct directory: `/public/images/storm-maps/`
3. Restart the server after adding images: `node server.js`

**Your storm maps will make the system incredibly powerful once integrated!** 🚀 