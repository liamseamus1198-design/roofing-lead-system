# 🗺️ Storm Maps Setup Guide

## 📸 **How to Save Your Storm Maps Images**

### **Step 1: Locate Your Storm Maps Images**
You have 4 Storm Maps images that need to be saved to the correct locations.

### **Step 2: Save Each Image with the Correct Name**

#### **Image 1: Rain Intensity Map**
- **Source:** Your first Storm Map (showing rain intensity)
- **Save as:** `storm-map-1.jpg`
- **Location:** `public/images/storm-maps/storm-map-1.jpg`
- **Shows:** 1.00" rain/hour in Barefoot Bay

#### **Image 2: Hail Detection Map**
- **Source:** Your second Storm Map (showing hail detection)
- **Save as:** `storm-map-2.jpg`
- **Location:** `public/images/storm-maps/storm-map-2.jpg`
- **Shows:** 0.5" hail in Vero Beach

#### **Image 3: Wind Gust Map**
- **Source:** Your third Storm Map (showing wind patterns)
- **Save as:** `storm-map-3.jpg`
- **Location:** `public/images/storm-maps/storm-map-3.jpg`
- **Shows:** 60mph wind gusts in Fellsmere

#### **Image 4: Overall Coverage Map**
- **Source:** Your fourth Storm Map (showing complete coverage)
- **Save as:** `storm-map-4.jpg`
- **Location:** `public/images/storm-maps/storm-map-4.jpg`
- **Shows:** Complete storm system coverage

### **Step 3: Quick Setup Commands**

Open Terminal and run these commands:

```bash
# Navigate to your project directory
cd /Users/liamoshaughnessy/roofing-lead-system

# Create the images directory (if not already created)
mkdir -p public/images/storm-maps

# Copy your Storm Maps images to the correct locations
# (Replace with your actual image file paths)

# Example (you'll need to adjust the source paths):
# cp ~/Downloads/storm-map-1.jpg public/images/storm-maps/storm-map-1.jpg
# cp ~/Downloads/storm-map-2.jpg public/images/storm-maps/storm-map-2.jpg
# cp ~/Downloads/storm-map-3.jpg public/images/storm-maps/storm-map-3.jpg
# cp ~/Downloads/storm-map-4.jpg public/images/storm-maps/storm-map-4.jpg
```

### **Step 4: Verify the Setup**

After saving the images, restart the server:

```bash
# Stop the current server
pkill -f "node server.js"

# Start the server again
node server.js &
```

### **Step 5: Test the Integration**

1. Go to http://localhost:8080
2. Scroll down to the "Real Storm Maps" section
3. Click on "View Rain Map", "View Hail Map", etc.
4. Your actual Storm Maps should now appear in the modal popups

## 🎯 **Alternative: Drag & Drop Method**

### **Using Finder:**
1. Open Finder
2. Navigate to: `/Users/liamoshaughnessy/roofing-lead-system/public/images/storm-maps/`
3. Drag and drop your Storm Maps images
4. Rename them to: `storm-map-1.jpg`, `storm-map-2.jpg`, `storm-map-3.jpg`, `storm-map-4.jpg`

## 📱 **Image Requirements:**
- **Format:** JPG or PNG
- **Size:** 800x600px or larger
- **Quality:** High resolution
- **Content:** Your actual Storm Maps with purple rain overlays

## ✅ **Expected Result:**
Once properly saved, users will see your real Storm Maps when they click the "View Rain Map", "View Hail Map", etc. buttons, creating maximum credibility and urgency for your lead generation system.

## 🆘 **Need Help?**
If you're having trouble saving the images, you can also:
1. Upload them to Imgur and I can update the code to use those URLs
2. Convert them to base64 and I can embed them directly in the code
3. Use a different image hosting service

**Your Storm Maps will make the system incredibly powerful once integrated!** 